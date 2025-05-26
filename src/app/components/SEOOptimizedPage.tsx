import { Metadata } from 'next'
import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  structuredData?: object
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/images/dia-namorados-cupons-amor-og.jpg'
}: SEOProps): Metadata {
  return {
    title: `${title} | Cupons de Amor`,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'website',
      locale: 'pt_BR',
      url: canonical || 'https://lovecupoms.store'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: canonical || 'https://lovecupoms.store'
    }
  }
}
