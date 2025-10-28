'use client'

import BarcodeScannerModal from '@/components/BarcodeScannerModal'
import { motion } from 'framer-motion'
import { GiftCardBarcode } from '@/components/GiftCard/GiftCardBarcode'
import { GiftCardQr } from '@/components/GiftCard/GiftCardQr'
import { demoGiftCardCode, getCard } from '@/lib/giftcardStore'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function GiftCardSection() {
  const code = demoGiftCardCode
  const card = getCard(code)

  return (
    <main className='min-h-screen bg-white'>
      {/* Main content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
        {/* Introduction section */}
        <div className='text-center mb-12 sm:mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold text-blue-900 mb-4'>
            Redeem Your Demo $RWAINC Gift Card
          </h2>
          <p className='text-gray-600 max-w-2xl mx-auto text-base sm:text-lg'>
            Click on any card to flip and reveal the redemption code. Choose
            your preferred redemption method.
          </p>
        </div>

        {/* Gift cards grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12 max-w-4xl mx-auto'>
          {/* Barcode card */}
          <div className='flex flex-col items-center'>
            <div className='w-full mb-6'>
              <h3 className='text-lg font-semibold text-blue-900 text-center mb-2'>
                Barcode Redemption
              </h3>
              <p className='text-sm text-gray-600 text-center'>
                Scratch and reveal your code
              </p>
            </div>
            <GiftCardBarcode code={code} />
            <div className=' text-sm text-gray-400'>
              Demo Gift Card Code: {code}
            </div>
          </div>

          {/* QR code card */}
          <div className='flex flex-col items-center'>
            <div className='w-full mb-6'>
              <h3 className='text-lg font-semibold text-blue-900 text-center mb-2'>
                QR Code Redemption
              </h3>
              <p className='text-sm text-gray-600 text-center'>
                Scan with your mobile device
              </p>
            </div>
            <GiftCardQr amount={card?.balance ?? 0} code={code} />
            <div className=' text-sm text-gray-400'>
              Demo Gift Card Code: {code}
            </div>
          </div>
        </div>

        {/* How to Redeem Title */}
        <motion.div
          className='text-center mb-12'
          variants={itemVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <h3 className='text-3xl sm:text-4xl font-bold text-blue-900 mb-4'>
            How to Redeem
          </h3>
          <p className='text-gray-600 max-w-2xl mx-auto text-base sm:text-lg'>
            Follow these simple steps to redeem your gift card and receive your
            $RWAINC tokens
          </p>
        </motion.div>

        {/* How to Redeem Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-12'>
          {[
            {
              icon: (
                <svg
                  className='w-8 h-8'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
                    clipRule='evenodd'
                  />
                </svg>
              ),
              title: 'Visit Claim Portal',
              description:
                'Go to https://claim-portal-landing-page-rwa.vercel.app',
            },
            {
              icon: (
                <svg
                  className='w-8 h-8'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              ),
              title: 'Enter Your Code',
              description: 'Scan QR or enter barcode',
            },
            {
              icon: (
                <svg
                  className='w-8 h-8'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                  <path
                    fillRule='evenodd'
                    d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                    clipRule='evenodd'
                  />
                </svg>
              ),
              title: 'Receive Tokens',
              description: 'Get $RWAINC in your wallet',
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className='relative bg-gradient-to-br from-[#020664] to-[#040CCA] rounded-[25px] p-6 sm:p-8 border border-white/10 backdrop-blur-sm group hover:scale-105 transition-all duration-300'
              variants={itemVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Decorative elements */}
              <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#3EF2D0]/20 to-transparent rounded-full blur-xl' />
              <div className='absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#0055D6]/30 to-transparent rounded-full blur-lg' />

              <div className='relative z-10 flex flex-col items-center text-center gap-4'>
                <div className='flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#3EF2D0] to-[#00B894] text-[#020664] group-hover:scale-110 transition-transform duration-300'>
                  {step.icon}
                </div>
                <div>
                  <h4 className='font-bold bg-gradient-to-b from-white to-[#3EF2D0] bg-clip-text text-transparent mb-3 text-lg sm:text-xl'>
                    {step.title}
                  </h4>
                  <p className='text-gray-300 text-sm sm:text-base leading-relaxed'>
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scanner section with enhanced styling */}
        <motion.div
          className='relative bg-gradient-to-br from-[#020664] to-[#040CCA] rounded-[30px] p-8 sm:p-12 border border-white/10 backdrop-blur-sm mb-12'
          variants={itemVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {/* Decorative elements */}
          <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3EF2D0]/20 to-transparent rounded-full blur-2xl' />
          <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#0055D6]/30 to-transparent rounded-full blur-xl' />

          <div className='relative z-10 flex flex-col justify-center items-center gap-6'>
            <h3 className='text-2xl sm:text-3xl font-bold bg-gradient-to-b from-white to-[#3EF2D0] bg-clip-text text-transparent mb-2 text-center'>
              Scan Your Gift Card
            </h3>
            <BarcodeScannerModal />
            <p className='text-sm text-gray-300 text-center max-w-md leading-relaxed'>
              This demo scans QR or Code 128 barcodes and redeems the code
              instantly using advanced recognition technology.
            </p>
          </div>
        </motion.div>

        {/* Important notice with clean design */}
        <motion.div
          className='relative bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-200/50 rounded-[25px] p-6 sm:p-8 backdrop-blur-sm'
          variants={itemVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {/* Subtle decorative elements */}
          <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-xl' />
          <div className='absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-cyan-300/20 to-transparent rounded-full blur-lg' />

          <div className='relative z-10'>
            <h4 className='font-bold text-blue-900 mb-6 text-lg flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border border-blue-200/50 shadow-sm'>
                <svg
                  className='w-5 h-5 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              Important Notice
            </h4>
            <ul className='text-sm text-gray-700 space-y-4'>
              <li className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0' />
                <span className='leading-relaxed'>
                  This is a demonstration of the gift card redemption system
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0' />
                <span className='leading-relaxed'>
                  Your wallet address must be on Base Chain for $RWAINC tokens
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0' />
                <span className='leading-relaxed'>
                  No fees or taxes - tokens go directly to your wallet
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0' />
                <span className='leading-relaxed'>
                  For support, visit{' '}
                  <span className='text-blue-600 font-medium hover:text-blue-700 transition-colors'>
                    www.rwa.inc
                  </span>{' '}
                  or contact{' '}
                  <span className='text-blue-600 font-medium hover:text-blue-700 transition-colors'>
                    support@rwa.inc
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
