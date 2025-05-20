import Link from 'next/link'
import { LandingHeader } from './components/LandingHeader'
import { Heart, Gift, Calendar, Share2, Lock, Smile } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pink-50">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-pink-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Compartilhe Momentos Especiais
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Cupons de Amor é a forma mais fácil de criar e compartilhar cupons
            personalizados com alguém especial. Surpreenda seu amor com gestos
            que importam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-pink-600 px-6 py-3 rounded-md font-bold hover:bg-pink-50 transition-colors text-lg"
            >
              Começar Agora
            </Link>
            <Link
              href="/login"
              className="bg-pink-700 text-white px-6 py-3 rounded-md font-bold hover:bg-pink-800 transition-colors text-lg"
            >
              Entrar
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-black text-3xl font-bold text-center mb-12">
            Como Funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-black text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-pink-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Crie Seus Cupons</h3>
              <p className="text-gray-600">
                Personalize cupons de amor com diferentes categorias e
                validades. Seja criativo e surpreenda com gestos especiais.
              </p>
            </div>

            <div className="text-black text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="text-pink-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compartilhe</h3>
              <p className="text-gray-600">
                Envie um link único para a pessoa especial acessar seus cupons a
                qualquer momento, de qualquer dispositivo.
              </p>
            </div>

            <div className="text-black  text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-pink-600 h-8 w-8" fill="#ec4899" />
              </div>
              <h3 className="text-xl font-bold mb-2">Celebre</h3>
              <p className="text-gray-600">
                Acompanhe os cupons resgatados e crie memórias especiais a cada
                momento compartilhado juntos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-black  text-3xl font-bold text-center mb-12">
            Exemplos de Cupons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleCoupons.map((coupon, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      {coupon.icon}
                      <span className="ml-2 text-xs py-1 px-2 bg-pink-100 text-pink-800 rounded-full">
                        {coupon.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-black  text-lg font-bold mb-1">
                    {coupon.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{coupon.description}</p>
                </div>
                <div className="bg-gradient-to-r from-pink-100 to-red-100 p-2 text-center">
                  <span className="text-sm font-medium text-pink-700">
                    Exemplo de Cupom
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-md font-bold hover:from-pink-600 hover:to-red-600 transition-colors inline-flex items-center"
            >
              <Heart className="mr-2" /> Crie Seus Próprios Cupons
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-black  text-3xl font-bold text-center mb-12">
            Por Que Escolher Cupons de Amor?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <Lock className="text-pink-600 h-5 w-5" />
              </div>
              <div>
                <h3 className=" text-black text-xl font-bold mb-2">
                  Seguro e Privado
                </h3>
                <p className="text-gray-600">
                  Seus cupons são compartilhados apenas com quem você escolher,
                  através de um link único e seguro.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <Calendar className="text-pink-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-black text-xl font-bold mb-2">
                  Sempre Acessível
                </h3>
                <p className="text-gray-600">
                  Os cupons ficam disponíveis online, podem ser acessados de
                  qualquer dispositivo e a qualquer momento.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <Smile className="text-pink-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-black  text-xl font-bold mb-2">
                  Experiências Memoráveis
                </h3>
                <p className="text-gray-600">
                  Crie momentos únicos e especiais que vão fortalecer seu
                  relacionamento e criar memórias duradouras.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <Gift className="text-pink-600 h-5 w-5" />
              </div>
              <div>
                <h3 className="text-black  text-xl font-bold mb-2">
                  Presente Personalizado
                </h3>
                <p className="text-gray-600">
                  Um presente feito com carinho e personalizado para a pessoa
                  que você ama, mostrando que você se importa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-red-500 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Pronto para Surpreender?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Comece agora mesmo a criar seus cupons de amor e surpreenda aquela
            pessoa especial.
          </p>
          <Link
            href="/register"
            className="bg-white text-pink-600 px-8 py-3 rounded-md font-bold hover:bg-pink-50 transition-colors"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Heart className="mr-2" fill="white" />
            <h2 className="text-xl font-bold">Cupons de Amor</h2>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Cupons de Amor. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Exemplos de cupons para mostrar na landing page
const exampleCoupons = [
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
