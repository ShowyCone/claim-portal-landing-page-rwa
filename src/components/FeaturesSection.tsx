"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IoShieldCheckmarkOutline,
  IoCalculatorOutline,
  IoLanguageOutline,
  IoWalletOutline,
} from "react-icons/io5";

interface Feature {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      title: "Secure one-time codes",
      description:
        "Scratch, QR or NFC codes with anti-replay validation to prevent reuse or fraud.",
      image: "/images/features1.png",
      icon: <IoShieldCheckmarkOutline className="w-8 h-8" />,
    },
    {
      title: "Real-time USD-to-token calculation",
      description:
        "Convert your USD balance to $RWAINC instantly with live rates, no hidden fees.",
      image: "/images/features2.png",
      icon: <IoCalculatorOutline className="w-8 h-8" />,
    },
    {
      title: "Multi-language & mobile-first",
      description:
        "Optimized for mobile and kiosks, with flows in English, Spanish, and more.",
      image: "/images/features3.png",
      icon: <IoLanguageOutline className="w-8 h-8" />,
    },
    {
      title: "Wallet integration",
      description:
        "Connect via WalletConnect, MetaMask, or Web3 apps to receive tokens instantly.",
      image: "/images/features4.png",
      icon: <IoWalletOutline className="w-8 h-8" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="features"
      className="w-full py-20 px-6 relative"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="heading-xl gradient-text mb-8 text-shadow-glow"
            variants={cardVariants}
          >
            Powerful Features
          </motion.h2>
          <motion.p
            className="text-white/80 text-xl-readable max-w-3xl mx-auto"
            variants={cardVariants}
          >
            Experience seamless gift card redemption with our cutting-edge
            technology and security features designed for the modern digital
            world.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card feature-card p-6 text-center group"
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              {/* Icon */}
              <motion.div
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
                variants={iconVariants}
              >
                <div className="text-white">{feature.icon}</div>
              </motion.div>

              {/* Feature Image */}
              <div className="mb-6 relative overflow-hidden rounded-xl">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-xl mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                {feature.title}
              </h3>

              <p className="text-white/80 text-lg-readable">
                {feature.description}
              </p>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
