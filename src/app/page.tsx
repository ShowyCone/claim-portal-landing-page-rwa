import HeroSection from '@/components/HeroSection'
import TrustedBrandsSection from '@/components/TrustedBrandsSection'
import ValuePropositionSection from '@/components/ValuePropositionSection'
import TwoColumnSection from '@/components/TwoColumnSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesSection from '@/components/FeaturesSection'

export default function Home() {
  return (
    <div className='min-h-screen bg-[#EFEFEF]'>
      <HeroSection />
      <TrustedBrandsSection />
      <TwoColumnSection />
      <HowItWorksSection />
      <ValuePropositionSection />
      <FeaturesSection />
    </div>
  )
}
