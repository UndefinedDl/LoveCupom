import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from './providers/AuthProvider'
import { SupportWidget } from './components/Suporte'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title:
    'Presente Perfeito Dia dos Namorados 2025 | Cupons de Amor Personalizados',
  description:
    '🎁 Presente criativo e romântico para o Dia dos Namorados! Crie cupons de amor personalizados por apenas R$ 7,99. Surpresa única que seu amor vai guardar para sempre. ❤️',

  keywords: [
    'presente dia dos namorados',
    'presente criativo namorado',
    'cupons de amor',
    'presente romântico',
    'presente personalizado namorado',
    'presente barato dia dos namorados',
    'vale presente romântico',
    'cupons românticos',
    'presente digital namorado',
    'presente surpresa namorado',
    'ideias presente dia dos namorados 2025'
  ].join(', '),

  authors: [{ name: 'Cupons de Amor' }],
  creator: 'Cupons de Amor',
  publisher: 'Cupons de Amor',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://lovecupoms.store',
    title: 'Presente Perfeito Dia dos Namorados 2025 | Cupons de Amor',
    description:
      '🎁 Surpreenda seu amor com cupons românticos personalizados! Presente criativo, barato e cheio de carinho para o Dia dos Namorados.',
    siteName: 'Cupons de Amor',
    images: [
      {
        url: '/images/dia-namorados-cupons-amor-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Presente Dia dos Namorados - Cupons de Amor Personalizados',
        type: 'image/jpeg'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Presente Criativo Dia dos Namorados | Cupons de Amor',
    description:
      '🎁 Crie cupons românticos personalizados por R$ 7,99. O presente mais especial para o Dia dos Namorados!',
    images: ['/images/dia-namorados-cupons-amor-twitter.jpg'],
    creator: '@cuponsdeamor',
    site: '@cuponsdeamor'
  },

  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  },

  alternates: {
    canonical: 'https://lovecupoms.store',
    languages: {
      'pt-BR': 'https://lovecupoms.store'
    }
  },

  category: 'Presentes e Relacionamentos'
}

// Schema.org JSON-LD
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Cupons de Amor - Presente Dia dos Namorados',
  description:
    'Presente criativo e romântico para o Dia dos Namorados. Cupons de amor personalizados para criar experiências únicas com seu parceiro.',
  image: [
    'https://lovecupoms.store/images/dia-namorados-cupons-amor.jpg',
    'https://lovecupoms.store/images/cupons-romanticos-personalizados.jpg'
  ],
  brand: {
    '@type': 'Brand',
    name: 'Cupons de Amor'
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'Cupons de Amor',
    url: 'https://lovecupoms.store'
  },
  offers: {
    '@type': 'Offer',
    price: '7.99',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    validFrom: '2025-01-01',
    validThrough: '2025-06-12',
    priceValidUntil: '2025-06-12',
    seller: {
      '@type': 'Organization',
      name: 'Cupons de Amor'
    },
    itemCondition: 'https://schema.org/NewCondition',
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'BRL'
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 0,
          unitCode: 'DAY'
        }
      }
    }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1'
  },
  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Ana Carolina'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      reviewBody:
        'Melhor presente que já ganhei no Dia dos Namorados! Meu namorado criou cupons lindos e ainda estou usando eles. Vale muito a pena!'
    }
  ],
  category: 'Presentes Românticos',
  keywords:
    'presente dia dos namorados, cupons de amor, presente romântico, presente criativo',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://lovecupoms.store'
  }
}

// FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Por que cupons de amor são melhores que presentes tradicionais?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cupons de amor criam experiências memoráveis que vocês vivem juntos, ao contrário de presentes materiais que se desgastam. Por R$ 7,99 você tem um presente personalizado que dura para sempre e fortalece o relacionamento.'
      }
    },
    {
      '@type': 'Question',
      name: 'Quanto custa criar cupons de amor para o Dia dos Namorados?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nossos planos começam em R$ 7,99 para 3 cupons personalizados. É mais barato que um buquê de flores e infinitamente mais especial e duradouro.'
      }
    },
    {
      '@type': 'Question',
      name: 'Consigo criar meu presente de última hora?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim! O processo leva menos de 10 minutos. Você cria os cupons, personaliza e já pode compartilhar com seu amor no mesmo dia. Perfeito para quem deixou para a última hora.'
      }
    }
  ]
}

// Organization Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cupons de Amor',
  url: 'https://lovecupoms.store',
  logo: 'https://lovecupoms.store/images/logo-cupons-amor.png',
  description:
    'Plataforma para criar cupons de amor personalizados - o presente perfeito para o Dia dos Namorados e datas especiais.',
  foundingDate: '2025',
  founders: [
    {
      '@type': 'Person',
      name: 'Fundador Cupons de Amor'
    }
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-11-99999-9999',
    contactType: 'customer service',
    availableLanguage: 'Portuguese'
  },
  sameAs: [
    'https://www.instagram.com/cuponsdeamor',
    'https://www.facebook.com/cuponsdeamor',
    'https://twitter.com/cuponsdeamor'
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#ec4899" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://lovecupoms.store" />

        {/* Hreflang for Portuguese Brazil */}
        <link
          rel="alternate"
          hrefLang="pt-BR"
          href="https://lovecupoms.store"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://lovecupoms.store"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SupportWidget />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
