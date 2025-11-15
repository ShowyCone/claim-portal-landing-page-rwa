import HeroSection from "@/components/HeroSection";
import TrustedBrandsSection from "@/components/TrustedBrandsSection";
import ValuePropositionSection from "@/components/ValuePropositionSection";
import TwoColumnSection from "@/components/TwoColumnSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import WhoItsForSection from "@/components/WhoItsForSection";
import GlobalRolloutSection from "@/components/GlobalRolloutSection";
import GiftCardJourneySection from "@/components/GiftCardJourneySection";
import TrustSecuritySection from "@/components/TrustSecuritySection";
import TrustedUsersSection from "@/components/TrustedUsersSection";
import FAQSection from "@/components/FAQSection";
import FinalBanner from "@/components/FinalBanner";
import Footer from "@/components/Footer";
import GiftCardSection from "@/components/GiftCardSection";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ScrollFadeIn delay={100}>
        <TrustedBrandsSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={200}>
        <TwoColumnSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={300}>
        <HowItWorksSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={400}>
        <ValuePropositionSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={500}>
        <FeaturesSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={600}>
        <WhoItsForSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={700}>
        <GlobalRolloutSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={800}>
        <TrustSecuritySection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={900}>
        <GiftCardJourneySection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={1000}>
        <TrustedUsersSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={1100}>
        <FAQSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={1200}>
        <GiftCardSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={1300}>
        <FinalBanner />
      </ScrollFadeIn>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
