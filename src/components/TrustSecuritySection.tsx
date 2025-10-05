'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaLock, FaShieldAlt } from 'react-icons/fa'
import { TbZoomExclamation } from 'react-icons/tb'

interface TrustCard {
  id: number
  icon: React.ReactNode
  text: string
  numberPosition: 'top' | 'bottom'
}

const TrustSecuritySection: React.FC = () => {
  const ref = React.useRef(null)

  const trustCards: TrustCard[] = [
    {
      id: 1,
      icon: (
        <span className='text-8xl text-[#0055D6] group-hover:text-white flex items-center justify-center transition-colors duration-500'>
          <FaLock />
        </span>
      ),
      text: 'End-to-end encryption.',
      numberPosition: 'top',
    },
    {
      id: 2,
      icon: (
        <span className='text-8xl text-[#0055D6] group-hover:text-white flex items-center justify-center transition-colors duration-500'>
          <TbZoomExclamation />
        </span>
      ),
      text: 'Fraud detection & monitoring.',
      numberPosition: 'bottom',
    },
    {
      id: 3,
      icon: (
        <span className='text-8xl text-[#0055D6] group-hover:text-white flex items-center justify-center transition-colors duration-500'>
          <FaShieldAlt />
        </span>
      ),
      text: 'Independent audits & compliance (AML/KYC, regional licensing).',
      numberPosition: 'top',
    },
    {
      id: 4,
      icon: (
        <span className='text-8xl flex items-center justify-center text-[#0055D6] group-hover:text-white transition-colors duration-500'>
          <div className='w-24 h-24 bg-gradient-to-br from-[#0055D6] to-[#002C70] rounded-lg flex items-center justify-center font-bold text-white text-3xl'>
            RWA
          </div>
        </span>
      ),
      text: 'Backed by RWA Inc.',
      numberPosition: 'bottom',
    },
  ]

  return (
    <section className='py-20 px-16 w-full mx-auto bg-white' ref={ref}>
      <motion.h2
        className='text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#0055D6] to-[#002C70] bg-clip-text text-transparent'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Trust & Security
      </motion.h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {trustCards.map((card) => (
          <div
            key={card.id}
            className='relative rounded-[30px] px-3 py-8 min-h-[340px] transition-all duration-500 hover:scale-[1.02] shadow-lg bg-[#E8E8E852] hover:bg-gradient-to-b hover:from-[#0055D6] hover:to-[#020664] group'
          >
            <div
              className={`absolute w-7 h-7 rounded-full border border-gray-400 flex items-center justify-center font-bold text-xs transition-colors duration-500 ${
                card.numberPosition === 'top'
                  ? 'top-4 left-4'
                  : 'bottom-4 left-4'
              }`}
            >
              <span
                className={`transition-colors duration-500 text-black group-hover:text-white`}
              >
                {card.id}
              </span>
            </div>

            <div className='flex flex-col items-center justify-center h-full min-h-[200px]'>
              {card.id === 3 ? (
                <>
                  {card.numberPosition === 'top' && (
                    <div className='mb-4'>{card.icon}</div>
                  )}
                  <p
                    className={`font-semibold text-center text-xl md:text-2xl transition-colors duration-500 text-[#0055D6] group-hover:text-white mb-0`}
                  >
                    Independent audits & compliance
                  </p>
                  <span className='block text-center text-sm md:text-base text-[#0055D6] group-hover:text-white mt-1'>
                    (AML/KYC, regional licensing).
                  </span>
                  {card.numberPosition === 'bottom' && (
                    <div className='mt-4'>{card.icon}</div>
                  )}
                </>
              ) : card.numberPosition === 'top' ? (
                <>
                  <div className='mb-4'>{card.icon}</div>
                  <p
                    className={`font-semibold text-center text-xl md:text-2xl transition-colors duration-500 text-[#0055D6] group-hover:text-white`}
                  >
                    {card.text}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className={`font-semibold text-center mb-4 text-xl md:text-2xl transition-colors duration-500 text-[#0055D6] group-hover:text-white`}
                  >
                    {card.text}
                  </p>
                  <div>{card.icon}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustSecuritySection
