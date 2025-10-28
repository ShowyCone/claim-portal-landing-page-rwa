'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose, IoScanOutline } from 'react-icons/io5'
import BarcodeScanner from './BarcodeScanner'

export default function BarcodeScannerModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' as const },
    },
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as const,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: {
        duration: 0.2,
        ease: 'easeIn' as const,
      },
    },
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <motion.button
        onClick={() => setOpen(true)}
        className='bg-[#0055D6] text-3xl sm:text-4xl font-bold text-white px-6 py-3 rounded-full inline-flex items-center space-x-3 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden'
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-controls='barcode-scanner-modal'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out' />

        <IoScanOutline className='w-8 h-8 sm:w-10 sm:h-10' />
        <span>Scan Gift Card</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <div
            id='barcode-scanner-modal'
            role='dialog'
            aria-modal='true'
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
          >
            <motion.div
              className='absolute inset-0 bg-gradient-to-br from-[#020664]/80 via-black/60 to-[#020664]/80 backdrop-blur-sm'
              onClick={() => setOpen(false)}
              variants={backdropVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            />

            <motion.div
              className='relative z-10 w-full max-w-2xl'
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <div className='relative bg-gradient-to-br from-white via-gray-50 to-blue-50/50 rounded-3xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm'>
                <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent' />

                <div className='relative px-6 py-5 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/30'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-[#0055D6]/10 rounded-xl'>
                        <IoScanOutline className='w-6 h-6 text-[#0055D6]' />
                      </div>
                      <div>
                        <h3 className='text-xl font-bold bg-gradient-to-r from-[#020664] to-[#0055D6] bg-clip-text text-transparent'>
                          Scan to Redeem
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Position your gift card in the camera view
                        </p>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => setOpen(false)}
                      className='p-2 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-800 transition-all duration-200 backdrop-blur-sm cursor-pointer'
                      aria-label='Close'
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoClose className='w-5 h-5 text-red-300' />
                    </motion.button>
                  </div>
                </div>

                <div className='relative max-h-[500px] overflow-y-auto custom-scrollbar p-6'>
                  <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#0055D6] to-[#3EF2D0] rounded-full opacity-60' />

                  <BarcodeScanner />
                </div>

                <div className='px-6 py-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-gray-100/50'>
                  <p className='text-xs text-center text-gray-500'>
                    Secure scanning powered by advanced recognition technology
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
