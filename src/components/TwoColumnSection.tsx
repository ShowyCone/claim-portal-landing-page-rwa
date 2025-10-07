'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { IoArrowDownOutline } from 'react-icons/io5'
import Button from './Button'

export default function TwoColumnSection() {
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

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const phoneVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        delay: 0.2,
      },
    },
  }

  const giftCardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.6,
      rotate: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 15,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        delay: 0.5,
      },
    },
  }

  const handleRedeemClick = () => {
    console.log('Redeem Now clicked!')
  }

  return (
    <motion.section
      className='w-full py-8 px-4 md:px-8 lg:px-16'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      viewport={{ once: true }}
    >
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Left Column - Image Content */}
          <motion.div
            className='relative flex justify-center items-center order-1 lg:order-1'
            variants={leftColumnVariants}
          >
            <div className='relative w-full max-w-md mx-auto'>
              {/* Gift Card - Behind and smaller */}
              <motion.div
                className='absolute top-1/2 left-1/2 transform translate-x-[10%] -translate-y-[70%] z-10'
                variants={giftCardVariants}
                style={{
                  width: '45%',
                  height: '45%',
                  transform: 'translate(-30%, -40%) rotate(15deg)',
                }}
              >
                <Image
                  src='/images/Blue-Gift-Card-50.png'
                  alt='Blue Gift Card'
                  fill
                  className='object-contain w-full h-full'
                  draggable={false}
                />
              </motion.div>

              {/* Phone Mock - Main image */}
              <motion.div className='relative z-20' variants={phoneVariants}>
                <Image
                  src='/images/mock.png'
                  alt='Phone mockup showing Claim Portal interface'
                  width={200}
                  height={300}
                  className='object-contain w-[85%] h-auto drop-shadow-2xl'
                  draggable={false}
                  unoptimized
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div
            className='space-y-4 order-2 lg:order-2 self-start'
            variants={rightColumnVariants}
          >
            {/* Main Heading */}
            <motion.h2
              className='text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0055D6] leading-tight pr-0 text-center lg:text-left'
              variants={rightColumnVariants}
            >
              Claim Portal converts physical/digital gift cards into $RWAINC
              tokens instantly, bridging cash-based economies and blockchain.
            </motion.h2>

            {/* Subtext */}
            <motion.p
              className='text-gray-400 text-lg md:text-xl'
              variants={rightColumnVariants}
            >
              From kiosk cash to digital assets — in seconds.
            </motion.p>

            {/* Button */}
            <motion.div
              className='flex justify-center'
              variants={rightColumnVariants}
            >
              <Button
                label='Redeem Now'
                icon={<IoArrowDownOutline className='w-3.5 h-3.5' />}
                onClick={handleRedeemClick}
                variant='inverted'
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
