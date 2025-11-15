'use client'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  label: string
  icon: ReactNode
  onClick: () => void
  className?: string
  variant?: 'default' | 'inverted'
}

export default function Button({
  label,
  icon,
  onClick,
  className = '',
  variant = 'default',
}: ButtonProps) {
  const isInverted = variant === 'inverted'

  const buttonStyles = isInverted
    ? 'bg-[#0055D6] text-white'
    : 'bg-white text-[#020664]'

  const iconContainerStyles = isInverted
    ? 'bg-white text-[#0055D6]'
    : 'bg-[#0055D6] text-white'

  return (
    <motion.button
      className={`${buttonStyles} px-4 pr-1 py-1.5 rounded-full flex items-center space-x-1.5 font-medium hover:shadow-lg transition-shadow duration-300 text-xs ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className='font-bold'>{label}</span>
      <div className={`${iconContainerStyles} p-2 rounded-full text-xs`}>
        {icon}
      </div>
    </motion.button>
  )
}
