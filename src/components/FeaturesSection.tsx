'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { section } from 'framer-motion/client'

interface Feature {
  title: string
  description: string
  image: string
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      title: 'Easy Claims',
      description:
        'Submit and track your claims effortlessly with our intuitive interface.',
      image: '/images/features1.png',
    },
    {
      title: 'Instant Processing',
      description:
        'Get your claims processed quickly with our automated system.',
      image: '/images/features2.png',
    },
    {
      title: 'Secure Payments',
      description:
        'Receive secure payments directly to your preferred account.',
      image: '/images/features3.png',
    },
    {
      title: '24/7 Support',
      description:
        'Our support team is available around the clock to help you.',
      image: '/images/features4.png',
    },
  ]

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

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <section
      className='w-full h-full p-6 relative'
      style={{
        background: 'linear-gradient(180deg, #EFEFEF 80%, #FFFFFF 100%)',
      }}
    >
      {/* Gradient at bottom for smooth transition to next section */}
      <div className='absolute bottom-0 left-0 w-full h-24 pointer-events-none z-10' />
      <div className='bg-[#020664] rounded-[40px] relative overflow-hidden'>
        {/* Grid Pattern Background */}
        <div
          className='absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10'
          style={{
            backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px',
            backgroundPosition: 'bottom left',
            maskImage: `
            radial-gradient(
              ellipse at bottom left,
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,0.5) 90%,
              rgba(0,0,0,0) 95%
              )
              `,
            WebkitMaskImage: `
              radial-gradient(
                ellipse at bottom left,
                rgba(0,0,0,1) 0%,
                rgba(0,0,0,0.5) 50%,
                rgba(0,0,0,0) 70%
                )
                `,
          }}
        />

        {/* Top Decoration */}
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-full z-20'>
          <Image
            src='/images/top-decoration.png'
            alt='Top Decoration'
            unoptimized
            width={160}
            height={160}
            className='w-full h-full object-cover rounded-full'
          />
        </div>

        {/* Content Container */}
        <div className='relative z-30 px-6 py-12 lg:px-12 lg:pt-25 lg:pb-12'>
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-4xl lg:text-5xl z-25 font-bold text-white text-center mb-16'
          >
            Features
          </motion.h2>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4'
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className='relative h-full p-4 lg:p-6 rounded-[30px] bg-gradient-to-br from-[#020664] to-[#040CCA] border border-white/10 backdrop-blur-sm '
              >
                <div className='flex flex-col h-full justify-between items-center text-center space-y-4'>
                  {/* Title */}
                  <h3 className='text-xl lg:text-2xl font-bold bg-gradient-to-b from-white to-[#0055D6] bg-clip-text text-transparent'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='text-gray-400 text-sm lg:text-base leading-relaxed'>
                    {feature.description}
                  </p>

                  {/* Image */}
                  <div className='w-full h-32 lg:h-40 relative'>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className='object-contain'
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
