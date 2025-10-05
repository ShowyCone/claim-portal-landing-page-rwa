'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTimes, FaCommentDots } from 'react-icons/fa'
import { IoArrowUpOutline } from 'react-icons/io5'
import Button from './Button'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is the Claim Portal?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed justo in nulla tincidunt iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
  },
  {
    id: '2',
    question: 'How do I redeem my card?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed justo in nulla tincidunt iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
  },
  {
    id: '3',
    question: 'What wallets are supported?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed justo in nulla tincidunt iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
  },
  {
    id: '4',
    question: 'Is my redemption secure?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed justo in nulla tincidunt iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
  },
  {
    id: '5',
    question: 'Can I use it without a bank account?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed justo in nulla tincidunt iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
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
    <section className='w-full bg-white'>
      <div className='max-w-7xl mx-auto px-8 md:px-16 py-24'>
        <div className='mb-12 md:mb-16'>
          <h2 className='text-4xl md:text-6xl font-bold leading-tight text-left bg-gradient-to-r from-[#0055D6] to-[#002C70] bg-clip-text text-transparent'>
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
                className='bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden'
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
                  <h3 className='font-semibold text-[#020664] text-lg pr-4'>
                    {faq.question}
                  </h3>
                  <motion.div
                    className='text-[#0055D6] text-lg flex-shrink-0'
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
                        <div className='border-t border-gray-100 pt-4'>
                          <p className='text-gray-600 leading-relaxed'>
                            {faq.answer}
                          </p>
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
              className='bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center p-8 h-full min-h-[400px]'
              whileHover={{
                y: -4,
                boxShadow: '0 20px 40px rgba(0, 85, 214, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className='text-6xl text-[#0055D6] mb-4'
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

              <h3 className='text-2xl font-semibold text-[#020664] mb-2'>
                Do you have more questions?
              </h3>

              <p className='text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-6'>
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
