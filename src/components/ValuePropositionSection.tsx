'use client'

import { motion } from 'framer-motion'
import { FaMoneyBill, FaGlobe, FaLock, FaChartBar } from 'react-icons/fa'
import Image from 'next/image'

interface BenefitItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const benefits: BenefitItem[] = [
  {
    icon: FaMoneyBill,
    title: 'Instant Utility: Tokens delivered in under 30 seconds.',
    description:
      'Scan or enter your code, confirm once, and receive tokens in your wallet—typically in under 30 seconds.',
  },
  {
    icon: FaGlobe,
    title: 'Borderless Access: Works globally — Lagos, London, New York.',
    description:
      'Redeem anywhere with multi-language flows and low-bandwidth support—built for phones, kiosks, and global users.',
  },
  {
    icon: FaLock,
    title:
      'Secure & Trustworthy: One-time codes, Chainlink price feeds, fraud protection.',
    description:
      'Server-side validation of one-time codes, Chainlink price feeds, and active monitoring protect every redemption.',
  },
  {
    icon: FaChartBar,
    title:
      'Financial Onramp: Empowering unbanked users to access the tokenized economy.',
    description:
      'Add funds via cash or local payment rails and convert to tokens instantly—no bank account required.',
  },
]

const BenefitCard: React.FC<{ benefit: BenefitItem; index: number }> = ({
  benefit,
  index,
}) => {
  const Icon = benefit.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className='flex items-start gap-4 py-4'
      >
        {/* Icon Container */}
        <div className='flex-shrink-0 w-12 h-12 bg-[#0055D6] rounded-[10px] flex items-center justify-center'>
          <Icon className='w-6 h-6 text-white' />
        </div>

        {/* Text Content */}
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2 leading-tight'>
            {benefit.title}
          </h3>
          <p className='text-sm text-gray-400 leading-relaxed'>
            {benefit.description}
          </p>
        </div>
      </motion.div>
      {/* Dashed separator except after last item */}
      {index < benefits.length - 1 && (
        <div className='w-full border-t border-dashed border-gray-300' />
      )}
    </>
  )
}

const MarqueeText: React.FC = () => {
  return (
    <div className='w-full overflow-hidden py-8 mb-16'>
      <motion.div
        className='flex whitespace-nowrap'
        animate={{ x: [0, -2000] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <h1
            key={i}
            className='text-5xl md:text-7xl lg:text-8xl font-medium mr-8 bg-gradient-to-r from-[#020968] to-[#2498B8] bg-clip-text text-transparent'
          >
            Turn Your Gift Card Into $RWAINC in Seconds
          </h1>
        ))}
      </motion.div>
    </div>
  )
}

const ValuePropositionSection: React.FC = () => {
  return (
    <section className='w-full bg-[#EFEFEF]'>
      {/* Marquee Headline */}
      <MarqueeText />

      <div className='flex flex-col lg:flex-row w-full'>
        {/* Left Column - Benefits */}
        <div className='w-full lg:w-7/12 px-4 sm:px-8 lg:px-32'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='order-2 lg:order-1'
          >
            <h2 className='text-3xl md:text-4xl font-bold text-[#0055D6] mb-8'>
              Key Benefits & Value Proposition
            </h2>

            <div className='space-y-0'>
              {benefits.map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Image flush to right edge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='w-full lg:w-5/12 flex justify-end items-center order-1 lg:order-2 bg-[#EFEFEF] p-0 m-0'
          style={{ marginRight: 0, paddingRight: 0 }}
        >
          <div className='w-full flex justify-end items-center p-0 m-0'>
            <Image
              src='/images/hand-giftcard.png'
              alt='Gift Card to Token Conversion'
              width={450}
              height={450}
              unoptimized
              className='object-contain w-full max-w-[450px] h-auto m-0 p-0'
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ValuePropositionSection
