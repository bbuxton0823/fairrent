'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  centered?: boolean;
}

export default function Logo({ 
  className = '', 
  width = 240,
  height = 80,
  centered = false 
}: LogoProps) {
  return (
    <motion.div
      className={`
        ${centered ? 'mx-auto mb-8' : 'fixed top-4 right-4'} 
        z-50 ${className}
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src="/logo.jpg"
        alt="FairRent Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </motion.div>
  );
} 