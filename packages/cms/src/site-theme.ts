import type { CSSProperties } from 'react'
import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type SiteTheme = {
  colors: Record<string, string>
  typography: Record<string, string>
  spacing: Record<string, string>
  buttons: Record<string, string>
  cards: Record<string, string>
  motion: Record<string, string>
}

export type SiteThemeRow = SiteTheme & {
  id: string
  key: string
  published: boolean
}

export const siteThemeDefaults: SiteTheme = {
  colors: {
    highlight: '#E87F24',
    border: '#FFC81E',
    base: '#FEFDDF',
    header: '#73A5CA',
    dark: '#1c1712',
    ink: '#2b251d',
    muted: '#6e6256',
    footer: '#0f0d0b',
  },
  typography: {
    headingFamily: 'Outfit',
    bodyFamily: 'Inter',
    displayFamily: 'Outfit',
    baseSize: '16px',
    headingScale: '1',
    letterSpacing: 'normal',
    lineHeight: '1.6',
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap',
  },
  spacing: {
    sectionPadding: '7rem',
    containerPadding: '4rem',
    mobilePadding: '1.5rem',
  },
  buttons: {
    radius: '999px',
    style: 'gradient',
    textTransform: 'none',
    backgroundColor: 'linear-gradient(135deg, #73A5CA 0%, #E87F24 52%, #FFC81E 100%)',
    textColor: '#1c1712',
    borderColor: 'transparent',
    hoverBackgroundColor: 'linear-gradient(135deg, #E87F24 0%, #FFC81E 100%)',
    hoverTextColor: '#1c1712',
    hoverBorderColor: 'transparent',
    fontFamily: 'var(--font-body, Inter)',
  },
  cards: {
    radius: '30px',
    shadow: 'soft',
    glassIntensity: 'medium',
  },
  motion: {
    intensity: 'full',
    duration: 'normal',
  },
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function mergeRecord(fallback: Record<string, string>, value: unknown) {
  return {
    ...fallback,
    ...(value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, string>) : {}),
  }
}

export function mergeSiteTheme(value?: Partial<SiteTheme> | null): SiteTheme {
  return {
    colors: mergeRecord(siteThemeDefaults.colors, value?.colors),
    typography: mergeRecord(siteThemeDefaults.typography, value?.typography),
    spacing: mergeRecord(siteThemeDefaults.spacing, value?.spacing),
    buttons: mergeRecord(siteThemeDefaults.buttons, value?.buttons),
    cards: mergeRecord(siteThemeDefaults.cards, value?.cards),
    motion: mergeRecord(siteThemeDefaults.motion, value?.motion),
  }
}

export async function getSiteTheme(): Promise<SiteTheme> {
  if (!isSupabaseConfigured()) return clone(siteThemeDefaults)

  try {
    const rows = await supabaseRequest<SiteThemeRow[]>(
      '/rest/v1/site_theme?select=*&key=eq.default&published=eq.true&limit=1',
      { method: 'GET' },
    )
    return mergeSiteTheme(rows[0])
  } catch {
    return clone(siteThemeDefaults)
  }
}

export function siteThemeToCssVars(theme: SiteTheme): CSSProperties {
  return {
    '--brand-highlight': theme.colors.highlight,
    '--brand-border': theme.colors.border,
    '--brand-base': theme.colors.base,
    '--brand-header': theme.colors.header,
    '--brand-dark': theme.colors.dark,
    '--brand-ink': theme.colors.ink,
    '--brand-muted': theme.colors.muted,
    '--brand-footer': theme.colors.footer,
    '--font-heading': theme.typography.headingFamily,
    '--font-body': theme.typography.bodyFamily,
    '--font-display': theme.typography.displayFamily,
    '--body-size': theme.typography.baseSize,
    '--body-leading': theme.typography.lineHeight,
    '--section-padding': theme.spacing.sectionPadding,
    '--container-padding': theme.spacing.containerPadding,
    '--mobile-padding': theme.spacing.mobilePadding,
    '--button-radius': theme.buttons.radius,
    '--button-background': theme.buttons.backgroundColor,
    '--button-text': theme.buttons.textColor,
    '--button-border': theme.buttons.borderColor,
    '--button-hover-background': theme.buttons.hoverBackgroundColor,
    '--button-hover-text': theme.buttons.hoverTextColor,
    '--button-hover-border': theme.buttons.hoverBorderColor,
    '--button-font': theme.buttons.fontFamily,
    '--button-text-transform': theme.buttons.textTransform,
    '--card-radius': theme.cards.radius,
  } as CSSProperties
}
