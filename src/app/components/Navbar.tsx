'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <nav className="bg-white shadow-sm p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0 flex items-center space-x-2">
            <Link href="/">
              <Image 
                src="/images/logo.png"
                alt="Elegant Furniture Logo"
                width={30}
                height={30}
                className="cursor-pointer"
              />
            </Link>
            <span className="font-bold px-2 text-[#A65CF0] text-xl">Elegant Furnitures</span>

          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Search className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors" />
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors" />
            </div>
            <User className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors" />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
            <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray-200">
              <Link 
                href="/profile" 
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-2" />
                Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}