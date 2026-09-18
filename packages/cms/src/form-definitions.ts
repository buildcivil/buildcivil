import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type PublicFormField = {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  placeholder: string
  required: boolean
  options: string[]
}

export type PublicFormDefinition = {
  form_key: string
  title: string
  description: string
  submit_label: string
  success_message: string
  error_message: string
  fields: PublicFormField[]
  visible: boolean
}

type FormDefinitionRow = {
  form_key: string
  title: string | null
  description: string | null
  submit_label: string | null
  success_message: string | null
  error_message: string | null
  fields: unknown
  visible: boolean | null
}

const fallbackForms: Record<string, PublicFormDefinition> = {
  service_enquiry: {
    form_key: 'service_enquiry',
    title: 'Tell us what you need built.',
    description: 'Fill the details below and our team will contact you with the right next step.',
    submit_label: 'Submit enquiry',
    success_message: 'Thank you. Your service enquiry has been saved and our team will get back to you soon.',
    error_message: 'Please fill all required fields before submitting.',
    visible: true,
    fields: [
      { id: 'name', name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your full name', required: true, options: [] },
      { id: 'phone', name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+91 ...', required: true, options: [] },
      { id: 'email', name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', required: true, options: [] },
      {
        id: 'service',
        name: 'service',
        label: 'Service',
        type: 'select',
        placeholder: 'Select a service',
        required: true,
        options: ['Turnkey Construction', 'Interior & Exterior Design', 'Renovation & Remodeling', 'Architectural Planning', 'Project Management', 'Other'],
      },
      { id: 'other_service', name: 'other_service', label: 'Other service details', type: 'textarea', placeholder: 'Tell us which service you need.', required: false, options: [] },
    ],
  },
  contact: {
    form_key: 'contact',
    title: 'Project inquiry',
    description: 'Send us your brief and we will help shape the project.',
    submit_label: 'Send Inquiry',
    success_message: 'Your inquiry has been submitted. Our team will contact you soon.',
    error_message: 'Please fill all required fields.',
    visible: true,
    fields: [
      { id: 'name', name: 'name', label: 'Your name', type: 'text', placeholder: 'Enter your name', required: true, options: [] },
      { id: 'phone', name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+91 ...', required: true, options: [] },
      { id: 'email', name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', required: true, options: [] },
      { id: 'project_type', name: 'project_type', label: 'Project type', type: 'text', placeholder: 'Turnkey home, renovation, interiors, etc.', required: true, options: [] },
      { id: 'details', name: 'details', label: 'Project details', type: 'textarea', placeholder: 'Tell us about the site, your timeline, budget range, and what kind of finish you want.', required: true, options: [] },
    ],
  },
  package_quote: {
    form_key: 'package_quote',
    title: 'Package quote',
    description: 'Request a quote for the selected package.',
    submit_label: 'Get Quote',
    success_message: 'Thank you. Your package quote request has been saved.',
    error_message: 'Please fill all required fields.',
    visible: true,
    fields: [
      { id: 'name', name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name', required: true, options: [] },
      { id: 'phone', name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+91 ...', required: true, options: [] },
      { id: 'email', name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', required: true, options: [] },
      { id: 'plan_name', name: 'plan_name', label: 'Plan name', type: 'text', placeholder: 'Auto selected plan', required: true, options: [] },
      { id: 'start_timeline', name: 'start_timeline', label: 'How soon do you want to start?', type: 'text', placeholder: 'Example: Next month', required: false, options: [] },
    ],
  },
}

function normalizeField(value: unknown, index: number): PublicFormField {
  const field = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  const id = typeof field.id === 'string' ? field.id : typeof field.name === 'string' ? field.name : `field_${index + 1}`
  const type = typeof field.type === 'string' ? field.type : 'text'
  return {
    id,
    name: typeof field.name === 'string' ? field.name : id,
    label: typeof field.label === 'string' ? field.label : id,
    type: ['text', 'email', 'tel', 'textarea', 'select'].includes(type) ? type as PublicFormField['type'] : 'text',
    placeholder: typeof field.placeholder === 'string' ? field.placeholder : '',
    required: Boolean(field.required),
    options: Array.isArray(field.options) ? field.options.map(String) : [],
  }
}

function normalizeForm(row: FormDefinitionRow): PublicFormDefinition {
  const fallback = fallbackForms[row.form_key]
  return {
    form_key: row.form_key,
    title: row.title || fallback?.title || row.form_key,
    description: row.description || fallback?.description || '',
    submit_label: row.submit_label || fallback?.submit_label || 'Submit',
    success_message: row.success_message || fallback?.success_message || 'Submitted successfully.',
    error_message: row.error_message || fallback?.error_message || 'Please fill all required fields.',
    visible: row.visible ?? true,
    fields: Array.isArray(row.fields) ? row.fields.map(normalizeField) : fallback?.fields ?? [],
  }
}

export function getFallbackFormDefinition(key: string) {
  return fallbackForms[key]
}

export async function getFormDefinition(key: string): Promise<PublicFormDefinition> {
  if (!isSupabaseConfigured()) return fallbackForms[key]

  try {
    const rows = await supabaseRequest<FormDefinitionRow[]>(
      `/rest/v1/form_definitions?select=*&form_key=eq.${encodeURIComponent(key)}&visible=eq.true&limit=1`,
      { method: 'GET' },
    )
    return rows[0] ? normalizeForm(rows[0]) : fallbackForms[key]
  } catch {
    return fallbackForms[key]
  }
}
