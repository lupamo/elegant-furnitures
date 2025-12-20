'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className='relative overflow-hidden bg-linear-to-br from-[#f6f6f6] via to-[#f0f0f0]'>
      
    </section>
  )
}