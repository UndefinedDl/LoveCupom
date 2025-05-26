export const seoConfig = {
  defaultTitle: 'Cupons de Amor - Presente Perfeito Dia dos Namorados 2025',
  titleTemplate: '%s | Cupons de Amor',
  defaultDescription:
    '🎁 Presente criativo e romântico para o Dia dos Namorados! Crie cupons de amor personalizados por apenas R$ 7,99. Surpresa única que seu amor vai guardar para sempre. ❤️',
  siteUrl: 'https://lovecupoms.store',
  ogImage: '/images/dia-namorados-cupons-amor-og.jpg',
  twitterHandle: '@cuponsdeamor',
  facebookAppId: '123456789'
}

// Palavras-chave por página
export const pageKeywords = {
  home: [
    'presente dia dos namorados',
    'presente criativo namorado',
    'cupons de amor',
    'presente romântico',
    'presente personalizado namorado',
    'presente barato dia dos namorados',
    'vale presente romântico',
    'cupons românticos',
    'presente digital namorado',
    'presente surpresa namorado'
  ],
  login: [
    'login cupons de amor',
    'entrar presente romântico',
    'acesso cupons namorado'
  ],
  register: [
    'criar conta cupons amor',
    'cadastro presente romântico',
    'registro dia dos namorados'
  ]
}

export function generateMetaDescription(
  page: string,
  customData?: any
): string {
  const descriptions = {
    home: '🎁 Presente criativo e romântico para o Dia dos Namorados! Crie cupons de amor personalizados por apenas R$ 7,99. Surpresa única que seu amor vai guardar para sempre. ❤️',
    login:
      'Faça login na sua conta Cupons de Amor e acesse seus presentes românticos personalizados. Entre agora e surpreenda seu amor!',
    register:
      'Crie sua conta grátis e comece a fazer cupons de amor personalizados. O presente perfeito para o Dia dos Namorados por R$ 7,99.',
    dashboard:
      'Gerencie seus cupons de amor e crie presentes românticos únicos. Painel completo para personalizar suas experiências especiais.',
    collection: customData?.title
      ? `Coleção "${customData.title}" - Cupons de amor personalizados criados com carinho. Acesse e resgates suas experiências românticas.`
      : 'Acesse sua coleção de cupons românticos personalizados. Experiências únicas criadas especialmente para vocês dois.'
  }

  return descriptions[page as keyof typeof descriptions] || descriptions.home
}

export const schemaMarkup = {
  // Homepage - Product + Organization
  homepage: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': 'https://lovecupoms.store/#product',
        name: 'Cupons de Amor - Presente Dia dos Namorados',
        description:
          'Presente criativo e romântico para o Dia dos Namorados. Cupons de amor personalizados para criar experiências únicas.',
        category: 'Presentes Românticos',
        brand: {
          '@type': 'Brand',
          name: 'Cupons de Amor'
        },
        offers: {
          '@type': 'Offer',
          price: '7.99',
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '127'
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://lovecupoms.store/#organization',
        name: 'Cupons de Amor',
        url: 'https://lovecupoms.store',
        logo: 'https://lovecupoms.store/images/logo.png',
        description:
          'Plataforma para criar cupons de amor personalizados - o presente perfeito para o Dia dos Namorados.'
      }
    ]
  }
}
