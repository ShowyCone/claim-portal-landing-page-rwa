'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { IoClose, IoScanOutline } from 'react-icons/io5'
import BarcodeScanner from './BarcodeScanner'

export default function BarcodeScannerModal() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  return (
    <div className='w-full flex flex-col items-center'>
      <motion.button
        onClick={() => setOpen(true)}
        className='bg-gradient-to-r from-[#3EF2D0] to-[#00B894] text-2xl sm:text-3xl font-bold text-[#020664] px-8 py-4 rounded-full inline-flex items-center space-x-4 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden border border-white/20'
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-controls='barcode-scanner-modal'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out' />

        <IoScanOutline className='w-7 h-7 sm:w-8 sm:h-8' />
        <span>Scan Gift Card</span>
      </motion.button>

      {mounted &&
        open &&
        createPortal(
          <div
            className='fixed inset-0 z-[9999] flex items-center justify-center p-4'
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Backdrop */}
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setOpen(false)}
            />

            {/* Modal Content */}
            <div className='relative z-10 w-full max-w-xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col'>
              {/* Header */}
              <div className='px-5 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                      <IoScanOutline className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-900'>
                        Scan to Redeem
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Position your gift card in the camera view
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className='p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 transition-colors'
                    aria-label='Close'
                  >
                    <IoClose className='w-5 h-5' />
                  </button>
                </div>
              </div>

              {/* Content with scrollbar */}
              <div
                className='flex-1 overflow-y-auto p-5'
                style={{ maxHeight: 'calc(85vh - 140px)' }}
              >
                <BarcodeScanner />
              </div>

              {/* Footer */}
              <div className='px-5 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0'>
                <p className='text-xs text-center text-gray-500'>
                  Secure scanning powered by advanced recognition technology
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
