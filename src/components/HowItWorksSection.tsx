'use client'
import React from 'react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'

const HowItWorksSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [showHoverControls, setShowHoverControls] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const sectionRef = React.useRef<HTMLDivElement>(null)

  const handlePlay = () => {
    if (!videoRef.current) return
    videoRef.current.muted = false
    setIsMuted(false)
    videoRef.current.play()
    setIsPlaying(true)
  }

  const handlePause = () => {
    if (!videoRef.current) return
    videoRef.current.pause()
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }

  const handleMuteUnmute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const loadVideo = () => {
    if (!videoRef.current || isLoaded) return
    videoRef.current.load()
    setIsLoaded(true)
  }

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onLoadedData = () => setIsLoaded(true)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('loadeddata', onLoadedData)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('loadeddata', onLoadedData)
    }
  }, [])

  // Intersection Observer para cargar video cuando sea visible
  React.useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            loadVideo()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isLoaded])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  const arrowVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  const steps = [
    {
      id: 1,
      image: '/images/icon-img1.png',
      title: 'Scratch & Reveal',
      subtitle: 'Find your code or scan QR.',
    },
    {
      id: 2,
      image: '/images/icon-img2.png',
      title: 'Enter & Connect',
      subtitle: 'Input code, connect wallet.',
    },
    {
      id: 3,
      image: '/images/icon-img3.png',
      title: 'Redeem Instantly',
      subtitle: 'Receive $RWAINC tokens directly into your wallet.',
    },
  ]

  return (
    <section ref={sectionRef} className='w-full py-16 lg:py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          className='text-center mb-16'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2
            className='text-4xl lg:text-5xl font-bold mb-4'
            style={{
              background: 'linear-gradient(135deg, #0055D6 0%, #002C70 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            variants={itemVariants}
          >
            How It Works
          </motion.h2>
          <motion.p
            className='text-sm text-gray-400 uppercase tracking-wider'
            variants={itemVariants}
          >
            3 Easy Steps
          </motion.p>
        </motion.div>

        {/* Steps Row - Desktop */}
        <motion.div
          className='hidden lg:flex items-stretch justify-center mb-16'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Card */}
              <motion.div
                className='flex flex-col items-center justify-center gap-4 h-full'
                variants={itemVariants}
              >
                {/* Icon Container */}
                <div
                  className='w-24 h-24 flex items-center justify-center'
                  style={{
                    background:
                      'linear-gradient(180deg, #020664 0%, #0055D6 100%)',
                    borderRadius: '25px 25px 25px 0px',
                  }}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={index === 2 ? 90 : 75}
                    height={index === 2 ? 90 : 75}
                    className='object-contain'
                  />
                </div>

                {/* Text Content */}
                <div className='text-center w-34'>
                  <h3 className='text-md font-bold text-[#0055D6]'>
                    {step.title}
                  </h3>
                  <p className='text-gray-400 text-sm leading-relaxed'>
                    {step.subtitle}
                  </p>
                </div>
              </motion.div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className={`mx-8 flex h-24 ${
                    index === 0 ? '-mt-5 self-start' : 'mt-5 self-start'
                  }`}
                  variants={arrowVariants}
                >
                  <Image
                    src={`/images/arrow-${index + 1}.png`}
                    alt={`Arrow ${index + 1}`}
                    width={160}
                    height={80}
                    className='object-contain'
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Steps Column - Mobile */}
        <motion.div
          className='lg:hidden space-y-8 mb-16'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className='flex flex-row items-center justify-start text-left relative gap-4 min-h-[110px]'
              style={{ alignItems: 'flex-start' }}
              variants={itemVariants}
            >
              {/* Icon Container con número arriba a la izquierda */}
              <div
                className='relative w-20 h-20 flex items-center justify-center'
                style={{
                  background:
                    'linear-gradient(180deg, #020664 0%, #0055D6 100%)',
                  borderRadius: '25px 25px 25px 0px',
                }}
              >
                <span className='absolute -top-3 -left-3 w-9 h-9 bg-[#0055D6] text-white rounded-full flex items-center justify-center text-base font-bold shadow-md'>
                  {step.id}
                </span>
                <Image
                  src={step.image}
                  alt={step.title}
                  width={48}
                  height={48}
                  className='object-contain'
                />
              </div>
              <div className='flex flex-col justify-center w-full max-w-[180px] min-h-[80px]'>
                <h3 className='text-lg font-bold text-[#0055D6] mb-2'>
                  {step.title}
                </h3>
                <p className='text-gray-400 text-base leading-relaxed mb-2'>
                  {step.subtitle}
                </p>
              </div>
              {/* Arrow for mobile (except last item) */}
              {index < steps.length - 1 && (
                <motion.div
                  className='ml-4 rotate-90 flex items-center'
                  variants={arrowVariants}
                >
                  <Image
                    src='/images/arrow-1.png'
                    alt='Next step'
                    width={36}
                    height={18}
                    className='object-contain opacity-60'
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Video Section */}
        <motion.div
          className='text-center'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <div className='max-w-4xl mx-auto'>
            <motion.div
              className='relative bg-gray-300 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border border-[#e3e8f0] min-h-[300px]'
              variants={itemVariants}
              onMouseEnter={() => setShowHoverControls(true)}
              onMouseLeave={() => setShowHoverControls(false)}
            >
              {/* Video element */}
              <video
                ref={videoRef}
                className='w-full h-full object-cover'
                poster='/images/video-poster.jpg'
                preload='none'
                playsInline
                onClick={handlePlayPause}
              >
                <source src='/videos/how-it-works.mp4' type='video/mp4' />
                Your browser does not support the video tag.
              </video>

              {/* Play button overlay (when video is not playing) */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className='absolute inset-0 m-auto flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0055D6] to-[#002C70] hover:from-[#0066FF] hover:to-[#003380] rounded-full shadow-2xl border-4 border-white transition-all duration-300 transform hover:scale-110 z-20 focus:outline-none focus:ring-4 focus:ring-[#0055D6]/30'
                  aria-label='Play video'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='w-8 h-8 text-white ml-1'
                    fill='currentColor'
                  >
                    <path d='M8 5v14l11-7z' />
                  </svg>
                </button>
              )}

              {/* Hover pause button (when video is playing) */}
              {isPlaying && showHoverControls && (
                <button
                  onClick={handlePlayPause}
                  className='absolute inset-0 m-auto flex items-center justify-center w-16 h-16 bg-black/70 hover:bg-black/80 rounded-full shadow-xl transition-all duration-200 z-20 focus:outline-none focus:ring-4 focus:ring-white/30'
                  aria-label='Pause video'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='w-6 h-6 text-white'
                    fill='currentColor'
                  >
                    <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
                  </svg>
                </button>
              )}

              {/* Mute/unmute button bottom right */}
              <button
                onClick={handleMuteUnmute}
                className='absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border-2 border-[#0055D6]/20 hover:border-[#0055D6] hover:bg-[#0055D6]/10 rounded-full p-2.5 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0055D6]/50 z-20 group'
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='w-5 h-5 text-[#0055D6] group-hover:text-[#002C70]'
                    fill='currentColor'
                  >
                    <path d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z' />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='w-5 h-5 text-[#0055D6] group-hover:text-[#002C70]'
                    fill='currentColor'
                  >
                    <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
                  </svg>
                )}
              </button>

              {/* Loading indicator */}
              {!isLoaded && (
                <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#002C70]/20 to-[#0055D6]/20 backdrop-blur-sm'>
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='w-8 h-8 border-4 border-[#0055D6]/30 border-t-[#0055D6] rounded-full animate-spin'></div>
                    <p className='text-white text-sm font-medium'>
                      Loading video...
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
            <motion.p
              className='mt-6 text-gray-600 text-sm'
              variants={itemVariants}
            >
              Watch how easy it is to claim your $RWAINC tokens
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorksSection
