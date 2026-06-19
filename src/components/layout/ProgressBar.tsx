import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/store/progressStore'

export default function ProgressBar() {
  const progress = useProgressStore((s) => s.getProgress())
  const completedCount = useProgressStore((s) => s.completedSteps.length)
  const TOTAL_STEPS = 9

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-xs text-[#e0d8c8]/60 font-['Crimson_Text']">
          学习进度
        </span>
        <span className="text-xs text-[#e2b04a] font-['Crimson_Text']">
          第{completedCount}步 / 共{TOTAL_STEPS}步
        </span>
        <span className="text-xs text-[#e2b04a] font-mono">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#16213e] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #e2b04a, #f0c96b, #e2b04a)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            width: `${progress}%`,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            width: { duration: 0.6, ease: 'easeOut' },
            backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
          }}
        />
      </div>
    </div>
  )
}
