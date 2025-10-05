import HeroSection from '@/components/HeroSection'
import TrustedBrandsSection from '@/components/TrustedBrandsSection'
import ValuePropositionSection from '@/components/ValuePropositionSection'
import TwoColumnSection from '@/components/TwoColumnSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesSection from '@/components/FeaturesSection'
import WhoItsForSection from '@/components/WhoItsForSection'
import GlobalRolloutSection from '@/components/GlobalRolloutSection'
import GiftCardJourneySection from '@/components/GiftCardJourneySection'
import TrustSecuritySection from '@/components/TrustSecuritySection'
import TrustedUsersSection from '@/components/TrustedUsersSection'
import FAQSection from '@/components/FAQSection'
import FinalBanner from '@/components/FinalBanner'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className='min-h-screen bg-[#EFEFEF]'>
      <HeroSection />
      <TrustedBrandsSection />
      <TwoColumnSection />
      <HowItWorksSection />
      <ValuePropositionSection />
      <FeaturesSection />
      <WhoItsForSection />
      <GlobalRolloutSection />
      <TrustSecuritySection />
      <GiftCardJourneySection />
      <TrustedUsersSection />
      <FAQSection />
      <FinalBanner />
      <Footer />
    </div>
  )
}
