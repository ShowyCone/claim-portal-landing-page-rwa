import HeroSection from '@/components/HeroSection'
import TrustedBrandsSection from '@/components/TrustedBrandsSection'
import TwoColumnSection from '@/components/TwoColumnSection'

export default function Home() {
  return (
    <div className='min-h-screen bg-[#EFEFEF]'>
      <HeroSection />
      <TrustedBrandsSection />
      <TwoColumnSection />
    </div>
  )
}
