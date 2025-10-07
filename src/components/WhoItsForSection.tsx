'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { IoArrowDownOutline } from 'react-icons/io5'
import Button from './Button'

interface AudienceItem {
  title: string
  description: string
}

const audiences: AudienceItem[] = [
  {
    title: 'Everyday Users',
    description: 'Buy gift cards at kiosks, redeem for tokens without a bank.',
  },
  {
    title: 'Retailers & Partners',
    description: 'New revenue stream, zero-risk consignment model.',
  },
  {
    title: 'Event Companies & B2B',
    description: 'Bulk gift cards for promotions and rewards.',
  },
]

export default function WhoItsForSection() {
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

  const cardHoverAnimation = {
    y: -8,
    rotate: 2,
  }

  const backgroundCardHoverAnimation = {
    y: -4,
    rotate: -1,
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-center'>
          {/* Left Side - Gift Card Visual */}
          <motion.div
            className='flex justify-center'
            variants={leftColumnVariants}
          >
            <motion.div
              className='relative w-80 h-80 flex items-center justify-center py-50 lg:py-0'
              whileHover='hover'
              initial='initial'
            >
              {/* Background Card - Larger, Lower, Blurred */}
              <motion.div
                className='absolute'
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                whileHover={backgroundCardHoverAnimation}
                style={{
                  filter: 'blur(2px)',
                  opacity: 0.35,
                  transform: 'scale(1.1) translateY(20px)',
                }}
              >
                <Image
                  src='/images/Blue-Gift-Card-50-reverse.png'
                  alt='Background Gift Card'
                  width={300}
                  height={200}
                  className='drop-shadow-lg'
                />
              </motion.div>

              {/* Foreground Card */}
              <motion.div
                className='relative z-10'
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={cardHoverAnimation}
                style={{
                  filter: 'drop-shadow(0 10px 30px rgba(0, 85, 214, 0.2))',
                }}
              >
                <Image
                  src='/images/Blue-Gift-Card-50.png'
                  alt='Blue Gift Card'
                  width={280}
                  height={180}
                  className='transform hover:scale-105 transition-transform duration-300'
                />

                {/* Subtle glow effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-[#0055D6]/20 to-[#002C70]/20 rounded-lg blur-xl -z-10 opacity-0 hover:opacity-100 transition-opacity duration-500' />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className='flex flex-col justify-center space-y-8'
            variants={rightColumnVariants}
          >
            {/* Title */}
            <div>
              <h2 className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0055D6] to-[#002C70] bg-clip-text text-transparent leading-tight'>
                Who It&apos;s For
              </h2>
            </div>

            {/* Audience Descriptions */}
            <div className='space-y-6'>
              {audiences.map((audience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className='flex flex-col space-y-2'>
                    <p className='text-lg leading-relaxed text-[#1E1E1E] px-6'>
                      <span className='font-semibold bg-gradient-to-r from-[#0055D6] to-[#002C70] bg-clip-text text-transparent'>
                        {audience.title}:
                      </span>{' '}
                      {audience.description}
                    </p>
                  </div>
                  {/* Divider line except after last item */}
                  {index < audiences.length - 1 && (
                    <div className='mt-6 w-full h-px bg-[#d3d3d3]' />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='p-4 flex justify-center'
            >
              <Button
                label='Redeem your Gift Card'
                icon={<IoArrowDownOutline className='w-4 h-4' />}
                onClick={() => {}}
                variant='inverted'
                className='text-sm'
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
