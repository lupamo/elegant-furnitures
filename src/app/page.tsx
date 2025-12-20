import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import { getFeaturedProducts } from '@/app/actions/products'

export default async function HomePage() {
  const { products } = await getFeaturedProducts(8)

  return (
    <div className="min-h-screen bg-white">
     <Navbar />
     <HeroSection />
    </div>
  )
}
