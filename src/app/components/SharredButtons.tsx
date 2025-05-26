'use client'

interface ClientShareButtonsProps {
  title: string
  metaDescription: string
}

export default function ClientShareButtons({
  title,
  metaDescription
}: ClientShareButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => {
          const url = window.location.href
          const text = `${title} - ${metaDescription}`
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
          window.open(whatsappUrl, '_blank')
        }}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        WhatsApp
      </button>
      <button
        onClick={() => {
          const url = window.location.href
          const text = title
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
          window.open(twitterUrl, '_blank')
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Twitter
      </button>
      <button
        onClick={() => {
          const url = window.location.href
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          window.open(facebookUrl, '_blank')
        }}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
      >
        Facebook
      </button>
    </div>
  )
}
