import type { CSSProperties } from 'react'

type SectionStyleInput = Record<string, unknown> | null | undefined

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function sectionStyleVars(settings: SectionStyleInput): CSSProperties {
  const background = stringValue(settings?.backgroundColor ?? settings?.background_color)
  const text = stringValue(settings?.textColor ?? settings?.text_color)
  const font = stringValue(settings?.fontFamily ?? settings?.font_family)
  const heroTitleFontSize = stringValue(settings?.heroTitleFontSize ?? settings?.hero_title_font_size)

  return {
    ...(background ? { '--section-bg': background } : {}),
    ...(text ? { '--section-text': text } : {}),
    ...(font ? { '--section-font': font } : {}),
    ...(heroTitleFontSize ? { '--hero-title-size': heroTitleFontSize } : {}),
  } as CSSProperties
}
