'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      {/* Top bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center gap-6">
              <span className="text-gray-600">Your region: <span className="text-purple-600">Nakuru</span></span>
              <span className="text-gray-600">📞 +254 712 345 678</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-gray-600">
              <Link href="/about" className="hover:text-gray-900">About Company</Link>
              <Link href="/guarantee" className="hover:text-gray-900">Guarantee & Returns</Link>
              <Link href="/corporate" className="hover:text-gray-900">Corporate Clients</Link>
              <Link href="/designer" className="hover:text-gray-900">Designer Solutions</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-orange-500">🪑</span>
                <span className="text-purple-600 ml-1">Elegant</span>
                <span className="text-gray-800">Furniture</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/catalog" className="text-gray-700 hover:text-purple-600 transition">
                Catalog
              </Link>
              <Link href="/stores" className="text-gray-700 hover:text-purple-600 transition">
                Stores
              </Link>
              <Link href="/showroom" className="text-gray-700 hover:text-purple-600 transition">
                Showroom
              </Link>
              <Link href="/delivery" className="text-gray-700 hover:text-purple-600 transition">
                Delivery & Payment
              </Link>
              <Link href="/discount" className="text-gray-700 hover:text-purple-600 transition">
                Discount
              </Link>
              <Link href="/contacts" className="text-gray-700 hover:text-purple-600 transition">
                Contacts
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="I want to buy..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white p-1.5 rounded-full hover:bg-purple-700 transition">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="hidden lg:block">
              <select className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Category</option>
                <option>Sofas</option>
                <option>Tables</option>
                <option>Chairs</option>
                <option>Beds</option>
                <option>Storage</option>
              </select>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-700 hover:text-purple-600 transition">
                <User className="w-6 h-6" />
              </Link>
              <Link href="/cart" className="relative text-gray-700 hover:text-purple-600 transition">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <Link href="/catalog" className="block text-gray-700 hover:text-purple-600 py-2">
                Catalog
              </Link>
              <Link href="/stores" className="block text-gray-700 hover:text-purple-600 py-2">
                Stores
              </Link>
              <Link href="/showroom" className="block text-gray-700 hover:text-purple-600 py-2">
                Showroom
              </Link>
              <Link href="/delivery" className="block text-gray-700 hover:text-purple-600 py-2">
                Delivery & Payment
              </Link>
              <Link href="/discount" className="block text-gray-700 hover:text-purple-600 py-2">
                Discount
              </Link>
              <Link href="/contacts" className="block text-gray-700 hover:text-purple-600 py-2">
                Contacts
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}