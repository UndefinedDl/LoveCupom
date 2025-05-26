import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/presente-dia-namorados',
          '/cupons-romanticos',
          '/ideias-presente-namorado',
          '/presente-personalizado-barato'
        ],
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/admin/*',
          '/s/*' // Links compartilhados são privados
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/presente-dia-namorados',
          '/cupons-romanticos',
          '/ideias-presente-namorado'
        ],
        disallow: ['/dashboard/*', '/api/*', '/s/*']
      }
    ],
    sitemap: 'https://lovecupoms.store/sitemap.xml',
    host: 'https://lovecupoms.store'
  }
}
