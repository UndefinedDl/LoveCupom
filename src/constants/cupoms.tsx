import { Calendar, Gift, Heart } from 'lucide-react'

export const initialCoupons = [
  {
    id: 1,
    title: 'Lanchinho na cama',
    description: 'Direito a um lanchinho caseiro na cama',
    icon: 'heart',
    category: 'Bem-estar',
    used: false,
    validUntil: '31/12/2025'
  },
  {
    id: 2,
    title: 'Massagem Relaxante',
    description: 'Direito a uma massagem relaxante de 30 minutos',
    icon: 'heart',
    category: 'Bem-estar',
    used: false,
    validUntil: '31/12/2025'
  },
  {
    id: 4,
    title: 'Dia de Filme',
    description: 'Você escolhe o filme, eu preparo a pipoca e os petiscos',
    icon: 'gift',
    category: 'Lazer',
    used: false,
    validUntil: '31/12/2025'
  },
  {
    id: 5,
    title: 'Noite de Jogos',
    description: 'Uma noite inteira dedicada aos seus jogos favoritos',
    icon: 'gift',
    category: 'Lazer',
    used: false,
    validUntil: '31/12/2025'
  }
]

export const exampleCoupons = [
  {
    title: 'Jantar Romântico',
    description: 'Direito a um jantar em qualquer restaurante à sua escolha',
    icon: <Heart className="text-red-500" />,
    category: 'Encontro'
  },
  {
    title: 'Massagem Relaxante',
    description: 'Direito a uma massagem relaxante de 30 minutos',
    icon: <Heart className="text-red-500" />,
    category: 'Bem-estar'
  },
  {
    title: 'Passeio Surpresa',
    description: 'Um passeio especial planejado com muito carinho',
    icon: <Gift className="text-purple-500" />,
    category: 'Aventura'
  },
  {
    title: 'Dia de Filme',
    description: 'Você escolhe o filme, eu preparo a pipoca e os petiscos',
    icon: <Gift className="text-purple-500" />,
    category: 'Lazer'
  },
  {
    title: 'Café da Manhã na Cama',
    description: 'Acordar com um delicioso café da manhã preparado com amor',
    icon: <Heart className="text-red-500" />,
    category: 'Bem-estar'
  },
  {
    title: 'Sessão de Fotos',
    description: 'Uma sessão de fotos especial só para nós dois',
    icon: <Calendar className="text-blue-500" />,
    category: 'Memórias'
  }
]
