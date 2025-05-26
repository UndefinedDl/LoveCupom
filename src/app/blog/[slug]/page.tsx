import ClientShareButtons from '@/app/components/SharredButtons'
import { blogContent } from '@/constants/blog'
import { Calendar, Clock, Heart } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Dados dos posts (em produção viria de um CMS ou banco de dados)

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = blogContent[params.slug as keyof typeof blogContent]

  if (!post) {
    return {
      title: 'Post não encontrado',
      description: 'O post que você está procurando não foi encontrado.'
    }
  }

  return {
    title: `${post.title} | Blog Cupons de Amor`,
    description: post.metaDescription,
    keywords: post.keywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.keywords
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription
    },
    alternates: {
      canonical: `https://lovecupoms.store/blog/${params.slug}`
    }
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogContent[params.slug as keyof typeof blogContent]

  if (!post) {
    notFound()
  }

  // Schema markup para o artigo
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Organization',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cupons de Amor',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lovecupoms.store/images/logo.png'
      }
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lovecupoms.store/blog/${params.slug}`
    },
    keywords: post.keywords.join(', '),
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readTime.replace(' min', 'M')}`,
    inLanguage: 'pt-BR'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="text-black min-h-screen bg-white">
        {/* Header do Post */}
        <header className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 text-sm mb-4">
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
                <span>•</span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {post.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-pink-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishDate).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime} de leitura
                </div>
                <div className="flex items-center gap-2">
                  <span>Por {post.author}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo do Post */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg prose-pink max-w-none"
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/\n/g, '<br>')
              }}
            />

            {/* CTA no final do post */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Gostou das Dicas?</h3>
              <p className="mb-6">
                Transforme essas ideias em realidade criando seus cupons
                personalizados
              </p>
              <Link
                href="/"
                className="bg-white text-pink-600 px-8 py-3 rounded-md font-bold hover:bg-pink-50 transition-colors inline-block"
              >
                Criar Cupons Agora - R$ 7,99
              </Link>
            </div>

            {/* Compartilhamento */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-bold mb-4">Compartilhe este post:</h4>
              <div className="flex gap-4">
                <ClientShareButtons
                  title={post.title}
                  metaDescription={post.metaDescription}
                />
                <ClientShareButtons
                  title={post.title}
                  metaDescription={post.metaDescription}
                />
                <ClientShareButtons
                  title={post.title}
                  metaDescription={post.metaDescription}
                />
              </div>
            </div>
          </div>
        </article>

        {/* Posts Relacionados */}
        <section className="bg-pink-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-8">
                Posts Relacionados
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(blogContent)
                  .filter(([slug]) => slug !== params.slug)
                  .slice(0, 3)
                  .map(([slug, relatedPost]) => (
                    <Link
                      key={slug}
                      href={`/blog/${slug}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-video bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
                        <Heart className="h-12 w-12 text-pink-500" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {relatedPost.metaDescription}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
