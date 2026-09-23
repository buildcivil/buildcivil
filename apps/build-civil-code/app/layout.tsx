import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import MetaPixelPageViewTracker from '@/components/MetaPixelPageViewTracker'
import { getGoogleSetup } from '@buildcivil/cms/google-setup'
import { getPublicSiteUrl } from '@buildcivil/cms/seo'
import { getGlobalLayoutSettings } from '@buildcivil/cms/site-settings'
import { getSiteTheme, siteThemeToCssVars } from '@buildcivil/cms/site-theme'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  title: 'BuildCivil Constructions – Premium Construction & Architecture',
  description: 'BuildCivil delivers premium construction services from architecture to interiors with 12+ years of experience and a curated portfolio of residential and commercial work.',
  keywords: 'construction company, architecture, building construction, residential construction, interior design, renovation, India',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BuildCivil Constructions – Premium Construction & Architecture',
    description: 'Building smarter. Delivering better. Premium construction planning meets exceptional craftsmanship.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, googleSetup, layoutSettings] = await Promise.all([getSiteTheme(), getGoogleSetup(), getGlobalLayoutSettings()])
  const hasGtm = Boolean(googleSetup.gtmId)
  const hasGa = Boolean(googleSetup.gaMeasurementId)
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '2409260756272524'
  const faviconUrl = layoutSettings.header.brand.faviconUrl
  const socialImageUrl = layoutSettings.header.brand.socialImageUrl

  return (
    <html lang="en" className="font-sans" data-scroll-behavior="smooth">
      <head>
        {theme.typography.googleFontUrl ? (
          <link rel="stylesheet" href={theme.typography.googleFontUrl} />
        ) : null}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {faviconUrl ? <link rel="alternate icon" href={faviconUrl} /> : null}
        {socialImageUrl ? <meta property="og:image" content={socialImageUrl} /> : null}
        {googleSetup.searchConsoleVerification ? (
          <meta name="google-site-verification" content={googleSetup.searchConsoleVerification} />
        ) : null}
        <meta name="facebook-domain-verification" content="gbi23s90zmzrdowttb1p9ipstt7yqn" />
      </head>
      <body className="antialiased" style={siteThemeToCssVars(theme)}>
        {hasGtm ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleSetup.gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        {children}
        {hasGtm ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleSetup.gtmId}');`}
          </Script>
        ) : null}
        {hasGa ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleSetup.gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleSetup.gaMeasurementId}');`}
            </Script>
          </>
        ) : null}
        {metaPixelId ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
            </Script>
            <noscript>
              <img
                height={1}
                width={1}
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
            <MetaPixelPageViewTracker />
          </>
        ) : null}
        <Analytics />
      </body>
    </html>
  )
}
