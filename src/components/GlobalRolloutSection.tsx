'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { IoArrowForwardOutline } from 'react-icons/io5'
import Button from './Button'

export default function GlobalRolloutSection() {
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

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const bannerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <section className='bg-[#FEFEFE] py-12 lg:py-16'>
      <motion.div
        className='max-w-7xl mx-auto px-6 lg:px-36'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Title */}
        <motion.div className='text-center mb-8' variants={titleVariants}>
          <h2 className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0055D6] to-[#002C70] bg-clip-text text-transparent leading-tight uppercase'>
            Global Rollout
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className='text-center mb-12 lg:mb-16'
          variants={subtitleVariants}
        >
          <p className='text-[#AFAFAF] text-base lg:text-lg font-medium max-w-3xl mx-auto'>
            Regions Covered: Africa (Nigeria, Kenya, Ghana, South Africa),
            LATAM, MENA, Asia.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className='flex justify-center mb-0'
          variants={imageVariants}
        >
          <div className='relative w-full max-w-5xl'>
            <Image
              src='/images/global-rollout.png'
              alt='Global Rollout Coverage Map'
              width={1352}
              height={513}
              className='w-full h-auto object-contain rounded-lg'
              priority
            />
          </div>
        </motion.div>

        {/* Banner Section */}
        <motion.div className='w-full -mt-10' variants={bannerVariants}>
          <div className='bg-gradient-to-r from-[#02074B] to-[#0F40A5] rounded-lg p-6'>
            <div className='flex flex-col items-center justify-between gap-6 lg:gap-8'>
              {/* Left Side - Text */}
              <div className='text-center lg:text-left lg:flex-1'>
                <p className='text-base lg:text-xl leading-relaxed font-bold bg-gradient-to-r from-[#0253EE] via-white to-[#0253EE] bg-clip-text text-transparent'>
                  Partner Types: Telecoms, retail chains, kiosks, e-voucher
                  platforms, fintech resellers.
                </p>
              </div>

              {/* Right Side - Button */}
              <div className='flex-shrink-0'>
                <Button
                  label='Become a Distributor'
                  icon={<IoArrowForwardOutline className='w-4 h-4' />}
                  onClick={() => {
                    console.log('Become a Distributor clicked')
                  }}
                  variant='default'
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
