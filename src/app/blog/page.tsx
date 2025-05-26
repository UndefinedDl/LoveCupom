import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, Heart, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - Ideias de Presentes e Dicas Românticas | Cupons de Amor',
  description:
    'Descubra ideias criativas de presentes para o Dia dos Namorados, dicas de relacionamento e inspirações românticas. Tudo sobre cupons de amor e presentes especiais.',
  keywords:
    'blog presentes românticos, ideias dia dos namorados, dicas relacionamento, cupons de amor, presentes criativos',
  openGraph: {
    title: 'Blog - Ideias Românticas e Presentes Criativos',
    description:
      'Dicas, ideias e inspirações para criar os melhores presentes românticos',
    type: 'website'
  }
}

const blogPosts = [
  {
    slug: '15-ideias-cupons-romanticos-dia-namorados-2025',
    title: '15 Ideias de Cupons Românticos para o Dia dos Namorados 2025',
    excerpt:
      'Descubra as melhores ideias de cupons de amor para surpreender seu parceiro. Desde experiências íntimas até aventuras inesquecíveis.',
    publishDate: '2025-01-20',
    readTime: '8 min',
    category: 'Ideias de Presentes',
    featured: true,
    image: '/blog/ideias-cupons-romanticos.jpg'
  },
  {
    slug: 'presente-barato-especial-economia-dia-namorados',
    title: 'Presente Barato mas Especial: Como Economizar no Dia dos Namorados',
    excerpt:
      'Aprenda a criar presentes únicos e especiais gastando pouco. Cupons de amor são a solução perfeita para orçamentos apertados.',
    publishDate: '2025-01-18',
    readTime: '6 min',
    category: 'Economia',
    featured: true,
    image: '/blog/presente-barato-especial.jpg'
  },
  {
    slug: 'experiencias-melhores-presentes-objetos-relacionamento',
    title: 'Por Que Experiências São Melhores Presentes que Objetos',
    excerpt:
      'Ciência comprova: experiências compartilhadas fortalecem relacionamentos mais que presentes materiais. Entenda o porquê.',
    publishDate: '2025-01-15',
    readTime: '10 min',
    category: 'Relacionamento',
    featured: false,
    image: '/blog/experiencias-vs-objetos.jpg'
  },
  {
    slug: 'criar-presente-romantico-10-minutos',
    title: 'Como Criar o Presente Mais Romântico do Mundo em 10 Minutos',
    excerpt:
      'Passo a passo completo para criar cupons de amor únicos em poucos minutos. Perfeito para quem deixou para a última hora.',
    publishDate: '2025-01-12',
    readTime: '5 min',
    category: 'Tutorial',
    featured: false,
    image: '/blog/presente-10-minutos.jpg'
  },
  {
    slug: 'dia-namorados-o-que-nao-dar-presente',
    title: 'Dia dos Namorados: O Que Não Dar de Presente (E O Que Dar)',
    excerpt:
      'Lista definitiva dos presentes que você deve evitar e alternativas criativas que realmente funcionam.',
    publishDate: '2025-01-10',
    readTime: '7 min',
    category: 'Dicas',
    featured: false,
    image: '/blog/o-que-nao-dar-presente.jpg'
  }
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog - Ideias Românticas & Presentes Criativos
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Dicas, inspirações e ideias para criar os melhores presentes
            românticos e fortalecer seu relacionamento
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Posts em Destaque */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Posts em Destaque
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-pink-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-pink-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors"
                  >
                    Ler mais
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Todos os Posts */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Todos os Posts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {regularPosts.map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-pink-500" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-pink-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-pink-600 font-medium text-sm hover:text-pink-700 transition-colors"
                  >
                    Ler mais →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para Criar Seus Cupons de Amor?
          </h2>
          <p className="mb-6">
            Transforme essas ideias em realidade com nossos cupons
            personalizados
          </p>
          <Link
            href="/"
            className="bg-white text-pink-600 px-6 py-3 rounded-md font-bold hover:bg-pink-50 transition-colors inline-block"
          >
            Começar Agora - R$ 7,99
          </Link>
        </section>
      </div>
    </div>
  )
}
