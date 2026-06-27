'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'

type EnquiryRow = {
  id: string
  name: string
  email: string
  phone: string
  service: string
  other_service?: string | null
  source?: string | null
  status?: string | null
  created_at?: string | null
}

type AdminServiceEnquiriesPanelProps = {
  connected: boolean
  saving: boolean
  enquiries: EnquiryRow[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}

const statusOptions = ['new', 'read', 'replied', 'closed']

function formatStatusLabel(status?: string | null) {
  return (status || 'new').replaceAll('_', ' ')
}

export default function AdminServiceEnquiriesPanel({
  connected,
  saving,
  enquiries,
  onUpdateStatus,
  onDelete,
}: AdminServiceEnquiriesPanelProps) {
  const [rows, setRows] = useState<EnquiryRow[]>(enquiries)
  const [loading, setLoading] = useState(!enquiries.length)
  const [error, setError] = useState('')
  const [panelConnected, setPanelConnected] = useState(connected)

  async function loadEnquiries() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/enquiries', { cache: 'no-store' })
      const payload = await readJsonResponse<{ rows?: EnquiryRow[]; error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to load service enquiries.')
      setRows(payload.rows ?? [])
      setPanelConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load service enquiries.')
      setRows(enquiries)
      setPanelConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setRows(enquiries)
  }, [enquiries])

  useEffect(() => {
    void loadEnquiries()
    // Run once on tab mount so this panel is not dependent on the overview load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mt-6 rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Hero service enquiries</div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
            Consultation requests
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-white/55">
          These leads are generated from the home page consultation popup and stored in Supabase.
        </p>
        <button
          type="button"
          onClick={loadEnquiries}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/74 transition hover:border-[#D8FF6A]/30"
        >
          Refresh enquiries
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {loading ? (
          <div className="rounded-[24px] border border-white/8 bg-white/5 px-5 py-10 text-center text-sm text-white/52 xl:col-span-2">
            Loading service enquiries...
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-[#E87F24]/30 bg-[#E87F24]/10 px-5 py-6 text-sm leading-6 text-[#FFBC8C] xl:col-span-2">
            {error}
          </div>
        ) : rows.length ? (
          rows.map((enquiry) => (
            <div
              key={enquiry.id}
              className="rounded-[24px] border border-white/8 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{enquiry.name}</h3>
                    <span className="rounded-full border border-white/8 bg-[#D8FF6A]/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#111]">
                      {formatStatusLabel(enquiry.status)}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-white/58 sm:grid-cols-2">
                    <p className="break-all">{enquiry.email}</p>
                    <p>{enquiry.phone}</p>
                  </div>
                  <div className="mt-4 rounded-[18px] border border-white/8 bg-[#0f0f0f] p-4">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/36">Selected service</div>
                    <p className="mt-2 text-base font-semibold text-[#D8FF6A]">
                      {enquiry.service === 'Other' ? enquiry.other_service : enquiry.service}
                    </p>
                    {enquiry.service === 'Other' ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/36">Custom request</p>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/38">
                    <span>Source: {enquiry.source || 'home_hero'}</span>
                    {enquiry.created_at ? <span>{new Date(enquiry.created_at).toLocaleString()}</span> : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[180px]">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={!panelConnected || saving}
                      onClick={async () => {
                        await onUpdateStatus(enquiry.id, status)
                        await loadEnquiries()
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold capitalize text-white/74 disabled:opacity-50"
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={!panelConnected || saving}
                    onClick={async () => {
                      await onDelete(enquiry.id)
                      await loadEnquiries()
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-3 py-2 text-xs font-semibold text-[#FFBC8C] disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/52 xl:col-span-2">
            No service enquiries yet. New consultation popup submissions will appear here.
          </div>
        )}
      </div>
    </div>
  )
}
