import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

interface MotionSectionProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
}

const MotionSection: FC<MotionSectionProps> = ({
  children,
  className,
  duration = 0.5,
  delay = 0,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0.1, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'tween', duration, delay }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default MotionSection
