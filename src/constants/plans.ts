export const plans = [
  {
    name: 'Base',
    price: 'R$ 7,99',
    period: '/pagamento único',
    description: 'Perfeito para começar',
    features: [
      'Até 3 cupons',
      '1 coleção',
      'Compartilhamento seguro',
      'Suporte básico'
    ],
    color: 'from-pink-400 to-pink-500',
    popular: false
  },
  {
    name: 'Premium',
    price: 'R$ 14,99',
    period: '/mês',
    description: 'Ideal para casais',
    features: [
      'Até 6 cupons',
      '2 coleções',
      'Compartilhamento seguro',
      'Personalização avançada',
      'Suporte prioritário'
    ],
    color: 'from-pink-500 to-red-500',
    popular: true
  },
  {
    name: 'VIP',
    price: 'R$ 24,99',
    period: '/mês',
    description: 'Sem limites para o amor',
    features: [
      'Cupons ilimitados',
      'Coleções ilimitadas',
      'Compartilhamento seguro',
      'Todas as personalizações',
      'Suporte VIP',
      'Recursos exclusivos'
    ],
    color: 'from-red-500 to-red-600',
    popular: false
  }
]
