"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const TrustedBrandsSection = () => {
  const brandLogos = [
    "brand1.png",
    "brand2.png",
    "brand3.png",
    "brand4.png",
    "brand5.png",
    "brand6.png",
    "brand7.png",
  ];

  const duplicatedLogos = [...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-white/90 text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Trusted by 15,000+ founders & business owners
          </h3>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex items-center gap-8 sm:gap-12 lg:gap-16 whitespace-nowrap"
            animate={{
              x: [0, `-${100 / 3}%`],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="flex-shrink-0 w-24 h-12 sm:w-28 sm:h-14 lg:w-32 lg:h-16 relative"
              >
                <Image
                  src={`/images/${logo}`}
                  alt={`Brand ${(index % brandLogos.length) + 1}`}
                  fill
                  className="object-contain filter brightness-0 invert opacity-60 hover:opacity-90 transition-all duration-300"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                />
              </div>
            ))}
          </motion.div>

          <div className="absolute top-0 left-0 w-20 sm:w-24 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-20 sm:w-24 h-full bg-gradient-to-l from-[#1a1a1a] to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsSection;
