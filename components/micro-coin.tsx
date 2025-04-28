"use client"

import { motion } from "framer-motion"

interface MicroCoinProps {
  size?: number
}

export function MicroCoin({ size = 40 }: MicroCoinProps) {
  return (
    <motion.div className="relative" style={{ width: size, height: size }} whileHover={{ scale: 1.05 }}>
      <div
        className="w-full h-full rounded-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000cdcc61f8b3197620a468750a-XuXt1E4d6F99Kuiw4A1EovYdfhG6sT.png')`,
          width: size,
          height: size,
        }}
      />
    </motion.div>
  )
}
