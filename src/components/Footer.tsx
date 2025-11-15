'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaGithub,
} from 'react-icons/fa6'

export default function Footer() {
  return (
    <section className='w-full h-full p-6 mt-10'>
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='relative w-full text-white rounded-[30px] overflow-hidden'
      >
        {/* Fondo con gradientes combinados */}
        <div className='absolute inset-0 bg-[#020664]' />
        <div className='absolute inset-0 bg-gradient-to-b from-[#0810A8]/60 via-[#030B77]/80 to-[#02044A] opacity-90' />
        <div className='absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#79A7FF]/40 blur-[120px]' />
        <div className='absolute top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[#3EF2D0]/20 blur-[100px]' />

        {/* Contenido */}
        <div className='relative z-10 px-6 lg:px-20 py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-10 border-b border-white/10 pb-10'>
            {/* Logo & description */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Image src='/Logo.svg' alt='RWA Logo' width={90} height={40} />
              </div>
              <p className='text-sm text-gray-300 leading-relaxed max-w-xs'>
                RWA Global Inc. turns physical and digital gift cards into
                $RWAWARD on Base. Fast, secure, and borderless. Redeem in
                seconds with no hidden fees.
              </p>

              <div className='flex space-x-4 pt-3'>
                <Link href='#' className='hover:text-[#3EF2D0] transition'>
                  <FaGithub size={16} />
                </Link>
                <Link href='#' className='hover:text-[#3EF2D0] transition'>
                  <FaLinkedinIn size={16} />
                </Link>
                <Link href='#' className='hover:text-[#3EF2D0] transition'>
                  <FaInstagram size={16} />
                </Link>
                <Link href='#' className='hover:text-[#3EF2D0] transition'>
                  <FaXTwitter size={16} />
                </Link>
              </div>
            </div>

            {/* Utility pages */}
            <div>
              <h3 className='font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400'>
                Utility pages
              </h3>
              <ul className='space-y-2 text-sm'>
                {[
                  'Style guide',
                  'License',
                  'Changelog',
                  'Password Protected',
                  '404 Error',
                ].map((item) => (
                  <li key={item}>
                    <Link href='#' className='hover:text-[#3EF2D0] transition'>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div>
              <h3 className='font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400'>
                Quick links
              </h3>
              <ul className='space-y-2 text-sm'>
                {['Home', 'About', 'Pricing', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href='#' className='hover:text-[#3EF2D0] transition'>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className='font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400'>
                Address
              </h3>
              <p className='text-sm text-gray-300'>
                Sheikh Zayed Road, Paramount Tower
                <br /> Dubai, Trade Centre 1, UAE
              </p>

              <div className='mt-4'>
                <h4 className='text-sm font-semibold text-gray-400 uppercase'>
                  Contact
                </h4>
                <p className='text-sm text-gray-300'>(965) 456 7890</p>
                <p className='text-sm text-gray-300'>info@rwa.inc</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className='text-center text-xs text-gray-400 mt-6'>
            © 2025{' '}
            <Link href='#' className='text-[#3EF2D0] hover:underline'>
              RWA Inc.
            </Link>{' '}
            All rights reserved.
          </div>
        </div>
      </motion.footer>
    </section>
  )
}
