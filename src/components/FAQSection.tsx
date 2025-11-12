'use client'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTimes, FaCommentDots } from 'react-icons/fa'
import { IoArrowUpOutline } from 'react-icons/io5'
import Button from './Button'

interface FAQItem {
  id: string
  question: string
  answer: ReactNode
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is the Claim Portal?',
    answer: (
      <>
        <p>
          The Claim Portal is RWA Inc.’s secure online platform where customers
          can redeem both Bitcoin Gift Cards and RWA Inc. Gift Cards.
        </p>
        <p>
          It bridges the gap between physical cards and digital assets —
          allowing anyone to turn cash into real digital value in seconds.
        </p>
      </>
    ),
  },
  {
    id: '2',
    question: 'How do I redeem my card?',
    answer: (
      <>
        <ol className='list-decimal pl-5 space-y-1'>
          <li>
            Visit the Claim Portal website (
            <a
              className='text-[#3EF2D0] underline'
              href='https://claim.rwa.inc'
              target='_blank'
              rel='noreferrer'
            >
              claim.rwa.inc
            </a>
            ).
          </li>
          <li>Enter your 16-digit code or scan the QR code on your card.</li>
          <li>
            Connect your digital wallet (such as MetaMask or WalletConnect).
          </li>
        </ol>
        <p className='mt-3'>
          If you have a Bitcoin Gift Card, you’ll receive Bitcoin instantly.
        </p>
        <p>If you have an RWA Gift Card, you’ll receive $RWAINC tokens.</p>
        <p>No complex steps — it’s as simple as topping up a mobile card.</p>
      </>
    ),
  },
  {
    id: '3',
    question: 'What wallets are supported?',
    answer: (
      <>
        <p>You can use any major Web3 wallet:</p>
        <ul className='list-disc pl-5 space-y-1'>
          <li>MetaMask</li>
          <li>WalletConnect (for mobile wallets)</li>
          <li>Trust Wallet</li>
        </ul>
        <p className='mt-3'>
          For Bitcoin claims, standard Bitcoin addresses are supported through
          our integrated API.
        </p>
      </>
    ),
  },
  {
    id: '4',
    question: 'Is my redemption secure?',
    answer: (
      <>
        <p>Yes — security is built-in at every step:</p>
        <ul className='list-disc pl-5 space-y-1'>
          <li>
            <strong>Best-in-class encryption:</strong> All claim codes are
            protected using Argon2 hashing, and every redemption is verified
            on-chain.
          </li>
          <li>
            <strong>Fraud prevention:</strong> Once a code is redeemed, it
            cannot be reused.
          </li>
          <li>
            <strong>Data privacy:</strong> No sensitive personal information or
            banking details are required.
          </li>
          <li>
            <strong>Audit trail:</strong> Every redemption is logged securely
            for transparency.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: '5',
    question: 'Can I use it without a bank account?',
    answer: (
      <>
        <p>
          Absolutely. The Claim Portal is designed for financial inclusion — buy
          a card with cash at participating retailers and redeem it directly to
          your crypto wallet without needing a bank account or credit card.
        </p>
      </>
    ),
  },
  {
    id: '6',
    question:
      'What’s the difference between the Bitcoin Card and the RWA Inc. Card?',
    answer: (
      <>
        <ul className='list-disc pl-5 space-y-1'>
          <li>
            <strong>Bitcoin Gift Card:</strong> Connects users to the world’s
            most trusted digital currency — perfect for beginners who want
            instant, simple Bitcoin ownership.
          </li>
          <li>
            <strong>RWA Inc. Gift Card:</strong> Introduces users to tokenized
            real‑world assets ($RWAINC), representing tangible value and
            long‑term growth potential.
          </li>
        </ul>
        <p className='mt-3'>
          Both cards share the same redemption process through the Claim Portal,
          letting you choose how to enter the digital economy.
        </p>
      </>
    ),
  },
  {
    id: '7',
    question: 'Can retailers sell both cards?',
    answer: (
      <>
        <p>
          Yes. Most retail partners offer the Dual Gift Card Display, allowing
          customers to buy either Bitcoin or RWA cards from the same counter.
          This setup maximizes shelf visibility, drives cross‑sales, and helps
          retailers tap into both mainstream and emerging digital demand.
        </p>
      </>
    ),
  },
  {
    id: '8',
    question: 'How fast will I receive my tokens?',
    answer: (
      <>
        <p>
          Redemption is instant. Once your code is entered and your wallet is
          connected, your tokens (Bitcoin or $RWAINC) are transferred within
          seconds — no waiting, no approval process.
        </p>
      </>
    ),
  },
  {
    id: '9',
    question: 'What if I lose my card or my code doesn’t work?',
    answer: (
      <>
        <p>
          If your code hasn’t been redeemed, our support team can help reissue
          or verify it. However, once a code is successfully redeemed, it’s
          permanently locked for security.
        </p>
      </>
    ),
  },
  {
    id: '10',
    question: 'Where can I buy these cards?',
    answer: (
      <>
        <p>
          Our cards are available through authorized retailers, supermarkets,
          kiosks, and telco partners.
        </p>
      </>
    ),
  },
]

export default function FAQSection() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  }

  const answerVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  }

  return (
    <section className='w-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]'>
      <div className='max-w-7xl mx-auto px-8 md:px-16 py-24'>
        <div className='mb-12 md:mb-16'>
          <h2 className='text-4xl md:text-6xl font-bold leading-tight text-left gradient-text'>
            Frequently
            <br />
            asked questions
          </h2>
        </div>

        <div className='flex flex-col md:flex-row gap-8 md:gap-12'>
          <motion.div
            className='flex-1 flex flex-col gap-4'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-50px' }}
          >
            {faqData.map((faq) => (
              <motion.div
                key={faq.id}
                className='bg-gradient-to-r from-[#1a1a1a]/80 to-[#2a2a2a]/80 border border-white/10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden'
                variants={itemVariants}
                whileHover={{
                  y: -2,
                  transition: { duration: 0.2 },
                }}
              >
                <div
                  className='p-6 flex justify-between items-center'
                  onClick={() => toggleItem(faq.id)}
                >
                  <h3 className='font-semibold text-white text-lg pr-4'>
                    {faq.question}
                  </h3>
                  <motion.div
                    className='text-[#3EF2D0] text-lg flex-shrink-0'
                    animate={{
                      rotate: expandedItems.includes(faq.id) ? 45 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {expandedItems.includes(faq.id) ? <FaTimes /> : <FaPlus />}
                  </motion.div>
                </div>

                <AnimatePresence>
                  {expandedItems.includes(faq.id) && (
                    <motion.div
                      variants={answerVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      className='overflow-hidden'
                    >
                      <div className='px-6 pb-6 pt-0'>
                        <div className='border-t border-white/20 pt-4'>
                          <div className='text-white/70 leading-relaxed space-y-3'>
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className='flex-1 h-full'
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className='bg-gradient-to-r from-[#1a1a1a]/80 to-[#2a2a2a]/80 border border-white/10 rounded-2xl shadow-md flex flex-col items-center justify-center text-center p-8 h-full min-h-[400px]'
              whileHover={{
                y: -4,
                boxShadow: '0 20px 40px rgba(0, 85, 214, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className='text-6xl text-[#3EF2D0] mb-4'
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                  delay: 0.3,
                }}
              >
                <FaCommentDots />
              </motion.div>

              <h3 className='text-2xl font-semibold text-white mb-2'>
                Do you have more questions?
              </h3>

              <p className='text-white/70 text-sm leading-relaxed max-w-sm mx-auto mb-6'>
                Lorem ipsum dolor sit consectetur Molest ullamcorp elitnon diam
                pharetra integer non fringilla Non cras sapien rutrum.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  label='Contact Us'
                  icon={<IoArrowUpOutline className='w-3.5 h-3.5 rotate-45' />}
                  onClick={() => {
                    console.log('Contact us clicked')
                    // contact logic here
                  }}
                  variant='inverted'
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
