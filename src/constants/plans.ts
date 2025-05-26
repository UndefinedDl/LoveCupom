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
    popular: false,
    maxCupons: 3,
    maxCollections: 1,
    planType: 'base'
  },
  {
    name: 'Premium',
    price: 'R$ 14,99',
    period: '/pagamento único',
    description: 'Ideal para casais',
    features: [
      'Até 6 cupons',
      '2 coleções',
      'Compartilhamento seguro',
      'Personalização avançada',
      'Suporte prioritário'
    ],
    color: 'from-pink-500 to-red-500',
    popular: true,
    maxCupons: 6,
    maxCollections: 2,
    planType: 'premium'
  },
  {
    name: 'VIP',
    price: 'R$ 24,99',
    period: '/pagamento único',
    description: 'Para quem quer mais opções',
    features: [
      'Até 10 cupons',
      '3 coleções',
      'Compartilhamento seguro',
      'Todas as personalizações',
      'Suporte VIP',
      'Recursos exclusivos'
    ],
    color: 'from-red-500 to-red-600',
    popular: false,
    maxCupons: 10,
    maxCollections: 3,
    planType: 'vip'
  }
]

// Função para obter limites do plano
export const getPlanLimits = (planType: string | null) => {
  const plan = plans.find(p => p.planType === planType)
  return {
    maxCupons: plan?.maxCupons || 0,
    maxCollections: plan?.maxCollections || 0
  }
}
