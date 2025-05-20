'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SessionProvider, signOut } from 'next-auth/react'
import { Heart, Menu, X, Home, Package, LogOut, User } from 'lucide-react'
import AuthProvider from '../providers/AuthProvider'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="mr-2 h-5 w-5" />
    },
    {
      name: 'Minhas Coleções',
      path: '/dashboard/collections',
      icon: <Package className="mr-2 h-5 w-5" />
    },
    {
      name: 'Meu Perfil',
      path: '/dashboard/profile',
      icon: <User className="mr-2 h-5 w-5" />
    }
  ]

  return (
    <AuthProvider>
      <div className="min-h-screen bg-pink-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="md:hidden focus:outline-none"
            >
              <Menu size={24} />
            </button>

            <Link href="/dashboard" className="flex items-center">
              <Heart className="mr-2" fill="white" />
              <span className="font-bold text-xl">Cupons de Amor</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center ${
                    pathname === item.path ? 'font-bold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center text-white"
            >
              <LogOut size={20} className="md:mr-2" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-200 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        />

        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-200 ease-in-out md:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 flex justify-between items-center bg-gradient-to-r from-pink-500 to-red-500 text-white">
            <div className="flex items-center">
              <Heart className="mr-2" fill="white" />
              <span className="font-bold">Cupons de Amor</span>
            </div>
            <button onClick={toggleSidebar} className="focus:outline-none">
              <X size={24} />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-4">
              {menuItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center py-2 px-4 rounded-md ${
                      pathname === item.path
                        ? 'bg-pink-100 text-pink-700 font-medium'
                        : 'text-gray-700 hover:bg-pink-50'
                    }`}
                    onClick={toggleSidebar}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={handleSignOut}
                  className="flex items-center py-2 px-4 rounded-md text-gray-700 hover:bg-pink-50 w-full"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthProvider>
  )
}
