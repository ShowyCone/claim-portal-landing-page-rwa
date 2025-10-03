'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  IoArrowUpOutline,
  IoDownloadOutline,
  IoPersonOutline,
  IoAddOutline,
  IoStar,
} from 'react-icons/io5'
import Button from './Button'

export default function HeroSection() {
  const [isBlueFront, setIsBlueFront] = useState(true)
  const [zIndexSwapped, setZIndexSwapped] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlueFront((prev) => !prev)

      setTimeout(() => {
        setZIndexSwapped((prev) => !prev)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  }

  const cardAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <motion.section
      className='bg-[#020664] m-5 rounded-[40px] h-[calc(100vh-2.5rem)] flex flex-col overflow-hidden relative'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div
        className='pointer-events-none absolute z-0'
        style={{
          width: '1200px',
          height: '1200px',
          right: '-500px',
          bottom: '-600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 70% 80%, #79A7FF 0%, rgba(121, 167, 255, 0.7) 25%, rgba(121, 167, 255, 0.4) 50%, rgba(121, 167, 255, 0.1) 75%, transparent 100%)',
          filter: 'blur(60px)',
        }}
      />

      <div className='pointer-events-none absolute bottom-0 right-0 z-[1] opacity-[38%]'>
        <Image
          src='/images/diamond.png'
          alt='Diamond decoration'
          width={355}
          height={370}
          className='object-contain'
          draggable='false'
        />
      </div>

      <div className='pointer-events-none absolute top-0 -left-10 z-[99] w-[800px] h-[400px]'>
        <img
          src='/light.svg'
          alt='Rayo de luz diagonal'
          className='h-[600px] object-contain -top-15 left-0 absolute'
          draggable='false'
        />
        <img
          src='/light.svg'
          alt='Rayo de luz diagonal corto'
          className='h-[460px] object-contain absolute opacity-70 top-2 -left-20'
          draggable='false'
        />
      </div>
      <motion.header
        className='flex items-center justify-between px-6 lg:px-20 py-4'
        variants={itemVariants}
      >
        <div className='w-48 flex justify-start'>
          <Image
            src='/Logo.svg'
            alt='RWA Logo'
            width={120}
            height={40}
            className='h-10 w-auto'
          />
        </div>

        <nav className='hidden lg:flex items-center space-x-8'>
          {['Home', 'About', 'FAQ', 'Pricing', 'Contact'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className='text-white hover:text-[#3EF2D0] transition-colors duration-300 font-medium text-md'
            >
              {link}
            </a>
          ))}
        </nav>

        <div className='w-48 flex justify-end'>
          <Button
            label='Buy Gift Card'
            icon={<IoArrowUpOutline className='w-3.5 h-3.5 rotate-45' />}
            onClick={() => console.log('Buy Gift Card clicked!')}
          />
        </div>
      </motion.header>

      <div className='flex-1 flex items-center px-6 lg:px-12 py-6 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 w-full max-w-6xl mx-auto items-center'>
          <motion.div
            className='lg:col-span-2 space-y-3 flex flex-col justify-center lg:pl-8 lg:pr-4'
            variants={itemVariants}
          >
            <motion.h1
              className='text-xl md:text-2xl lg:text-3xl font-bold leading-tight'
              variants={itemVariants}
            >
              <span className='bg-gradient-to-r from-white to-[#3EF2D0] bg-clip-text text-transparent'>
                Redeem Your RWA
              </span>
              <br />
              <span className='bg-gradient-to-r from-white to-[#3EF2D0] bg-clip-text text-transparent'>
                Gift Card in Seconds
              </span>
            </motion.h1>

            <motion.p
              className='text-white/70 text-xs md:text-sm max-w-xs leading-relaxed'
              variants={itemVariants}
            >
              Seamless, secure, and borderless redemption — turn physical or
              digital gift cards into real on-chain value.
            </motion.p>

            <motion.div className='space-y-2' variants={itemVariants}>
              <Button
                label='Button Component/More Services'
                icon={<IoDownloadOutline className='w-3.5 h-3.5' />}
                onClick={() => console.log('Hero button clicked!')}
              />

              <motion.a
                href='#learn'
                className='text-white underline hover:text-[#3EF2D0] transition-colors duration-300 block text-xs'
                whileHover={{ x: 5 }}
              >
                Learn How It Works
              </motion.a>
            </motion.div>

            <motion.div
              className='flex items-start gap-2 space-x-4 flex-col'
              variants={itemVariants}
            >
              <div className='flex items-center'>
                <div className='flex -space-x-2 items-center'>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border-2 border-white'
                    >
                      <IoPersonOutline className='w-4 h-4 text-white' />
                    </div>
                  ))}
                  <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-700'>
                    <IoAddOutline className='w-3 h-3 text-gray-700' />
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <div className='bg-yellow-500 p-2.5 rounded-lg'>
                  <IoStar className='w-3.5 h-3.5 text-white' />
                </div>
                <span className='text-white/80 text-xs'>
                  Rated 4.9/5 from over 600 reviews
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className='lg:col-span-3 relative flex items-center justify-center h-80 lg:h-96 w-full z-10'
            variants={itemVariants}
          >
            <motion.div
              className={`absolute ${zIndexSwapped ? 'z-20' : 'z-10'}`}
              variants={cardAnimation}
              initial='hidden'
              animate={{
                rotateZ: isBlueFront ? -8 : 8,
                x: isBlueFront ? -20 : 20,
                scale: isBlueFront ? 1 : 0.95,
                opacity: isBlueFront ? 1 : 0.7,
                transition: {
                  duration: 1.2,
                  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth animation
                },
              }}
              style={{
                filter: `${
                  zIndexSwapped
                    ? 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))'
                    : 'blur(3px) drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))'
                }`,
              }}
            >
              <Image
                src='/images/Blue-Gift-Card-50.png'
                alt='Blue Gift Card $50'
                width={280}
                height={350}
                className='rounded-2xl'
                priority
              />
            </motion.div>

            <motion.div
              className={`absolute ${zIndexSwapped ? 'z-10' : 'z-20'}`}
              variants={cardAnimation}
              initial='hidden'
              animate={{
                rotateZ: isBlueFront ? 8 : -8,
                x: isBlueFront ? 20 : -20,
                scale: isBlueFront ? 0.95 : 1,
                opacity: isBlueFront ? 0.7 : 1,
                transition: {
                  duration: 1.2,
                  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth animation
                },
              }}
              style={{
                filter: `${
                  zIndexSwapped
                    ? 'blur(3px) drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))'
                    : 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))'
                }`,
              }}
            >
              <Image
                src='/images/Gold-Gift-Card-1k.png'
                alt='Gold Gift Card $1000'
                width={280}
                height={350}
                className='rounded-2xl'
                priority
              />
            </motion.div>

            <motion.div
              className='absolute inset-0 rounded-full blur-3xl opacity-20'
              animate={{
                background: isBlueFront
                  ? 'radial-gradient(circle at 40% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle at 60% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                transition: {
                  duration: 0.8,
                  ease: 'easeInOut',
                },
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
