'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function GiftCardJourneySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const circleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const circleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const expansionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        delay: 0.6,
      },
    },
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut' as const,
      repeat: Infinity,
    },
  }

  const journeyData = [
    {
      quarter: 'Q1',
      month: 'June',
      description: 'Research & Setup',
    },
    {
      quarter: 'Q2',
      month: 'July',
      description: 'Development & QA',
    },
    {
      quarter: 'Q3',
      month: 'August',
      description: 'Pilot Launch',
      extra: '(X number of cards)',
    },
  ]

  return (
    <section className='bg-[#EFEFEF] py-12 lg:py-16'>
      <motion.div
        className='max-w-7xl mx-auto px-8 md:px-16 relative'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className='relative w-full rounded-[40px] bg-gradient-to-r from-[#0055D6] to-[#020664] overflow-hidden py-16 px-8 md:px-16'>
          <div className='absolute bottom-0 right-0 opacity-[0.46]'>
            <Image
              src='/images/diamond.png'
              alt='Decorative diamond'
              width={600}
              height={600}
              className='object-contain w-96 h-96'
            />
          </div>

          <motion.div className='text-center mb-12' variants={titleVariants}>
            <h2 className='text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#FFFFFF] to-[#3EF2D0] bg-clip-text text-transparent tracking-wide'>
              The RWA Gift Card Journey
            </h2>
          </motion.div>

          <motion.div
            className='flex justify-center gap-8 md:gap-16 flex-wrap mb-12'
            variants={circleContainerVariants}
          >
            {journeyData.map((item, index) => (
              <motion.div
                key={item.quarter}
                className='flex flex-col items-center text-center gap-4'
                variants={circleVariants}
              >
                <motion.div
                  className='w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-[#0055D6] to-[#002C70] p-[12px]'
                  animate={pulseAnimation}
                  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                >
                  <div className='flex items-center justify-center w-full h-full bg-white rounded-full'>
                    <span className='text-2xl md:text-3xl font-bold text-[#0055D6]'>
                      {item.quarter}
                    </span>
                  </div>
                </motion.div>

                <div className='flex flex-col items-center gap-1 max-w-[200px]'>
                  <span className='text-white font-medium text-lg md:text-xl'>
                    {item.month}
                  </span>
                  <span className='text-gray-300 font-light text-sm md:text-base text-center'>
                    {item.description}
                  </span>
                  {item.extra && (
                    <span className='text-gray-300 font-light text-sm md:text-base text-center'>
                      {item.extra}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className='text-center mt-12'
            variants={expansionVariants}
          >
            <p className='text-xl md:text-2xl font-medium bg-gradient-to-r from-white to-[#44F2D2] bg-clip-text text-transparent'>
              Expansion: Digital-only cards, bulk B2B, global rollout.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
