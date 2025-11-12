"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  IoArrowUpOutline,
  IoDownloadOutline,
  IoPersonOutline,
  IoAddOutline,
  IoStar,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import Button from "./Button";

export default function HeroSection() {
  const [isBlueFront, setIsBlueFront] = useState(true);
  const [zIndexSwapped, setZIndexSwapped] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlueFront((prev) => !prev);

      setTimeout(() => {
        setZIndexSwapped((prev) => !prev);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.section
      id="home"
      className="relative min-h-screen flex flex-col grid-pattern"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Background Elements */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          width: "1200px",
          height: "1200px",
          right: "-500px",
          bottom: "-600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 70% 80%, #8B5CF6 0%, rgba(139, 92, 246, 0.7) 25%, rgba(139, 92, 246, 0.4) 50%, rgba(139, 92, 246, 0.1) 75%, transparent 100%)",
          filter: "blur(80px)",
        }}
      />

      {/* Additional gradient orb */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          width: "800px",
          height: "800px",
          left: "-300px",
          top: "-200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 20%, #3B82F6 0%, rgba(59, 130, 246, 0.6) 30%, rgba(59, 130, 246, 0.3) 60%, transparent 100%)",
          filter: "blur(100px)",
        }}
      />

      <div className="pointer-events-none absolute bottom-0 right-0 z-[1] opacity-20">
        <Image
          src="/images/diamond.png"
          alt="Diamond decoration"
          width={400}
          height={420}
          className="object-contain"
          draggable="false"
        />
      </div>

      {/* Animated particles */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glass-nav flex items-center justify-between px-6 lg:px-20 py-4"
        variants={itemVariants}
      >
        <div className="w-48 flex justify-start">
          <Image
            src="/Logo.svg"
            alt="RWA Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {["Home", "About", "Features", "FAQ", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/90 hover:text-white transition-colors duration-300 font-medium text-sm relative group"
            >
              {link}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <Button
              label="Buy Gift Card"
              icon={<IoArrowUpOutline className="w-3.5 h-3.5 rotate-45" />}
              onClick={() => console.log("Buy Gift Card clicked!")}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            {isMobileMenuOpen ? (
              <IoCloseOutline className="w-6 h-6" />
            ) : (
              <IoMenuOutline className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 glass-nav border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            {["Home", "About", "Features", "FAQ", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block text-white/90 hover:text-white text-lg font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}

            <div className="pt-4 border-t border-white/10">
              <Button
                label="Buy Gift Card"
                icon={<IoArrowUpOutline className="w-3.5 h-3.5 rotate-45" />}
                onClick={() => {
                  console.log("Buy Gift Card clicked!");
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center px-6 lg:px-12 py-6 relative z-10 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-center">
          <motion.div
            className="lg:col-span-5 space-y-8 flex flex-col justify-center"
            variants={itemVariants}
          >
            <motion.h1
              className="heading-hero gradient-text-hero text-shadow-glow mb-6"
              variants={itemVariants}
            >
              Redeem Your RWA
              <br />
              Gift Card in Seconds
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg leading-relaxed max-w-md"
              variants={itemVariants}
            >
              Seamless, secure, and borderless redemption — turn physical or
              digital gift cards into real on-chain value.
            </motion.p>
            <motion.div className="space-y-6" variants={itemVariants}>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button
                  label="Redeem Now"
                  icon={<IoDownloadOutline className="w-4 h-4" />}
                  onClick={() => console.log("Hero button clicked!")}
                  size="md"
                />

                <motion.a
                  href="#features"
                  className="px-6 py-3 text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center rounded-lg font-medium text-base"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn How It Works
                </motion.a>
              </div>
            </motion.div>{" "}
            <motion.div
              className="flex items-center gap-8 pt-6 border-t border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20"
                    >
                      <IoPersonOutline className="w-4 h-4 text-white/70" />
                    </div>
                  ))}
                </div>
                <div className="text-white/80 text-sm">
                  <span className="font-semibold text-white">2K+</span> users
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IoStar key={star} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <div className="text-white/80 text-sm">
                  <span className="font-semibold text-white">4.9</span> (600+
                  reviews)
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-7 relative flex items-center justify-end h-96 lg:h-[500px] w-full z-10 mt-12 lg:mt-0 lg:pr-8"
            variants={itemVariants}
          >
            <motion.div
              className={`absolute ${zIndexSwapped ? "z-20" : "z-10"}`}
              variants={cardAnimation}
              initial="hidden"
              animate={{
                rotateZ: isBlueFront ? -8 : 8,
                x: isBlueFront ? -20 : 20,
                scale: isBlueFront ? 1 : 0.95,
                opacity: isBlueFront ? 1 : 0.7,
                transition: {
                  duration: 1.2,
                  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth animation
                },
              }}
              style={{
                filter: `${
                  zIndexSwapped
                    ? "drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))"
                    : "blur(3px) drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))"
                }`,
              }}
            >
              <Image
                src="/images/Blue-Gift-Card-50.png"
                alt="Blue Gift Card $50"
                width={320}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </motion.div>

            <motion.div
              className={`absolute ${zIndexSwapped ? "z-10" : "z-20"}`}
              variants={cardAnimation}
              initial="hidden"
              animate={{
                rotateZ: isBlueFront ? 8 : -8,
                x: isBlueFront ? 20 : -20,
                scale: isBlueFront ? 0.95 : 1,
                opacity: isBlueFront ? 0.7 : 1,
                transition: {
                  duration: 1.2,
                  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth animation
                },
              }}
              style={{
                filter: `${
                  zIndexSwapped
                    ? "blur(3px) drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))"
                    : "drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))"
                }`,
              }}
            >
              <Image
                src="/images/Gold-Gift-Card-1k.png"
                alt="Gold Gift Card $1000"
                width={320}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-full blur-3xl opacity-20"
              animate={{
                background: isBlueFront
                  ? "radial-gradient(circle at 40% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle at 60% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%)",
                transition: {
                  duration: 0.8,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
