'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { IoArrowUpOutline, IoArrowForwardOutline } from 'react-icons/io5'
import Button from './Button'

export default function FinalBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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

  const giftCards = [
    {
      image: '/images/Blue-Gift-Card-50.png',
      rotation: 5,
      delay: 0.2,
      zIndex: 3,
    },
    {
      image: '/images/Blue-Gift-Card-50.png',
      rotation: 5,
      delay: 0.4,
      zIndex: 2,
    },
    {
      image: '/images/Blue-Gift-Card-50.png',
      rotation: 5,
      delay: 0.6,
      zIndex: 1,
    },
  ]

  return (
    <section
      className='bg-white py-6 px-5'
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 80%, #EFEFEF 100%)',
      }}
    >
      <div className='relative max-w-6xl mx-auto'>
        <motion.div
          className='relative rounded-[40px] overflow-hidden'
          style={{
            background: 'linear-gradient(180deg, #020664 0%, #0055D6 100%)',
            height: '280px',
          }}
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className='absolute inset-0'>
            <div className='absolute left-[-60px] top-0 h-full hidden md:block'>
              <Image
                src='/images/diamond2.png'
                alt='Diamond decoration'
                width={200}
                height={280}
                className='h-full w-auto object-cover opacity-75'
                style={{ opacity: 0.76 }}
              />
            </div>

            <div className='absolute bottom-0 left-[12%] h-full hidden md:block'>
              <Image
                src='/images/dubai.png'
                alt='Dubai decoration'
                width={280}
                height={280}
                className='h-full w-auto object-cover object-bottom'
              />
            </div>
          </div>

          <div className='relative z-10 h-full flex flex-col md:flex-row justify-center items-center md:justify-between p-6 md:p-8'>
            <motion.div
              className='flex flex-col justify-center items-center md:items-start space-y-4 md:space-y-5 text-center md:text-left md:flex-1 md:mb-0 md:ml-32'
              variants={textVariants}
            >
              <h2
                className='text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight'
                style={{
                  background:
                    'linear-gradient(90deg, #FFFFFF 0%, #3EF2D0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ready to Claim Your $RWAINC?
              </h2>

              <div className='flex flex-col gap-3 items-center'>
                <div className='flex flex-col gap-3 items-center w-full'>
                  <Button
                    label='Buy your Gift Card Now'
                    icon={<IoArrowUpOutline className='text-sm' />}
                    onClick={() => {}}
                    className='text-sm w-fit'
                  />
                  <Button
                    label='Partner With Us'
                    icon={<IoArrowForwardOutline className='text-sm' />}
                    onClick={() => {}}
                    variant='inverted'
                    className='text-sm w-fit'
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div
          className='hidden md:block absolute top-0 right-0 h-[280px] pointer-events-none'
          style={{ width: '500px' }}
        >
          {giftCards.map((card, index) => (
            <motion.div
              key={index}
              className='absolute pointer-events-auto'
              style={{
                zIndex: card.zIndex,
                left: `${180 + index * 40}px`,
                top: `${-60 + index * 5}px`,
                transform: `rotate(${card.rotation}deg)`,
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                  scale: 0.9,
                  rotate: card.rotation + 10,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: card.rotation,
                  transition: {
                    duration: 0.8,
                    delay: card.delay,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  },
                },
              }}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                transition: { duration: 0.3 },
              }}
            >
              <Image
                src={card.image}
                alt={`Gift Card ${index + 1}`}
                width={280}
                height={420}
                unoptimized
                className='w-auto h-auto max-h-[380px] drop-shadow-2xl'
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
