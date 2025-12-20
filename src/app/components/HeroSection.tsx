'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "15% Discount",
      subtitle: "on your first purchase",
      buttonText: "Get it!",
      image: "/hero-sofa-1.jpg", // You'll need to add furniture images
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      title: "New Collection",
      subtitle: "Modern furniture for your home",
      buttonText: "Shop Now",
      image: "/hero-sofa-2.jpg",
      bgGradient: "from-blue-50 to-purple-50"
    },
    {
      title: "Premium Quality",
      subtitle: "Handcrafted with love",
      buttonText: "Explore",
      image: "/hero-sofa-3.jpg",
      bgGradient: "from-pink-50 to-orange-50"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative overflow-hidden">
      {/* Slider */}
      <div className={`min-h-[600px] bg-linear-to-r ${slides[currentSlide].bgGradient} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="text-left space-y-6 py-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-3xl md:text-4xl text-gray-600">
                {slides[currentSlide].subtitle}
              </p>
              <div className="pt-4">
                <Link
                  href="/catalog"
                  className="inline-block bg-linear-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  {slides[currentSlide].buttonText}
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Placeholder for furniture image */}
                <div className="relative w-full h-full">
                  {/* Red Sofa Illustration */}
                  <div className="absolute bottom-0 right-0 w-full h-4/5">
                    <div className="relative w-full h-full">
                      {/* Sofa body */}
                      <div className="absolute bottom-16 right-0 w-11/12 h-48 bg-linear-to-r from-red-600 to-red-700 rounded-t-3xl shadow-2xl">
                        {/* Sofa back */}
                        <div className="absolute -top-8 left-0 w-full h-24 bg-linear-to-r from-red-600 to-red-700 rounded-t-2xl"></div>
                        {/* Sofa arms */}
                        <div className="absolute -left-4 top-0 w-20 h-32 bg-linear-to-r from-red-700 to-red-800 rounded-l-xl"></div>
                        <div className="absolute -right-4 top-0 w-20 h-32 bg-linear-to-r from-red-700 to-red-800 rounded-r-xl"></div>
                      </div>
                      
                      {/* Decorative pillows */}
                      <div className="absolute bottom-40 right-24 w-24 h-24 bg-linear-to-br from-yellow-100 to-yellow-200 rounded-lg transform rotate-12 shadow-lg">
                        <div className="w-full h-full opacity-50">
                          <div className="absolute inset-0 bg-repeat" style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,200,0,0.3) 10px, rgba(255,200,0,0.3) 20px)`
                          }}></div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-40 right-48 w-24 h-24 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg transform -rotate-6 shadow-lg">
                        <div className="w-full h-full opacity-50">
                          <div className="absolute inset-0 bg-repeat" style={{
                            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,150,0,0.2) 10px, rgba(255,150,0,0.2) 20px)`
                          }}></div>
                        </div>
                      </div>

                      {/* Sofa legs */}
                      <div className="absolute bottom-8 right-12 w-3 h-12 bg-linear-to-b from-amber-700 to-amber-900 rounded-full shadow"></div>
                      <div className="absolute bottom-8 right-64 w-3 h-12 bg-linear-to-b from-amber-700 to-amber-900 rounded-full shadow"></div>
                    </div>
                  </div>

                  {/* Decorative plant */}
                  <div className="absolute top-0 right-0 w-32 h-64">
                    <div className="absolute bottom-0 right-0 w-2 h-48 bg-linear-to-t from-amber-800 to-amber-700"></div>
                    <div className="absolute top-12 right-4 w-12 h-24 border-4 border-amber-700 rounded-full opacity-30 transform -rotate-12"></div>
                    <div className="absolute top-8 right-0 w-12 h-24 border-4 border-amber-700 rounded-full opacity-30 transform rotate-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-purple-600 w-8' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  )
}