import React from 'react'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import BenefitsSection from '@/components/landing/BenefitsSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import AuthSection from '@/components/landing/LoginSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'
export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <AuthSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
