"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  variant?: "default" | "inverted" | "gradient";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  label,
  icon,
  onClick,
  className = "",
  variant = "gradient",
  size = "lg",
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "gradient":
        return "btn-gradient";
      case "inverted":
        return "bg-[#0055D6] text-white hover:bg-[#0044BB]";
      default:
        return "bg-white text-[#020664] hover:bg-gray-50";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-white/20 text-white backdrop-blur-sm";
      case "inverted":
        return "bg-white text-[#0055D6]";
      default:
        return "bg-[#0055D6] text-white";
    }
  };

  return (
    <motion.button
      className={`${getButtonStyles()} ${sizeStyles[size]} rounded-full flex items-center space-x-3 font-semibold transition-all duration-300 relative overflow-hidden ${className}`}
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <span className="relative z-10">{label}</span>
      <motion.div
        className={`${getIconStyles()} p-2.5 rounded-full relative z-10`}
        whileHover={{ rotate: 15 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
}
