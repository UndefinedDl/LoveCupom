import { Heart } from 'lucide-react'

export const Header = () => (
  <header className="bg-gradient-to-r from-pink-500 to-red-500 p-4 text-white shadow-md">
    <div className="container mx-auto flex items-center justify-between">
      <h1 className="text-2xl font-bold flex items-center">
        <Heart className="mr-2" fill="white" /> Cupons de Amor
      </h1>
      {/* <div className="text-sm">Com todo meu amor para Mariane ❤️</div> */}
    </div>
  </header>
)
