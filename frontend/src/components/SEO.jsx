import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'BuxTech'
const SITE_URL = 'https://buxtech-store.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`

export default function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  path = '',
  noindex = false,
  jsonLd = null,
}) {
  const fullTitle = title || `${SITE_NAME} — Power Your World`
  const canonical = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
