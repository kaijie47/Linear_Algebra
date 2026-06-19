import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepInfo } from '@/types'

interface StepCardProps {
  stepInfo: StepInfo
  isActive: boolean
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
}

export default function StepCard({ stepInfo, isActive, isCompleted, isLocked, onClick }: StepCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      whileHover={!isLocked ? { scale: 1.03 } : undefined}
      whileTap={!isLocked ? { scale: 0.97 } : undefined}
      animate={
        isActive
          ? {
              scale: [1, 1.02, 1],
              borderColor: ['rgba(226,176,74,0.5)', 'rgba(226,176,74,1)', 'rgba(226,176,74,0.5)'],
            }
          : {}
      }
      transition={{ duration: isActive ? 2 : 0.2, repeat: isActive ? Infinity : 0 }}
      className={cn(
        'relative flex flex-col items-start gap-3 w-full p-5 rounded-xl border text-left transition-colors',
        'bg-[#16213e] border-[#e2b04a]/20',
        isActive && 'border-[#e2b04a] shadow-[0_0_20px_rgba(226,176,74,0.2)]',
        isCompleted && 'border-[#4ecdc4]/60',
        isLocked && 'opacity-50 cursor-not-allowed',
        !isLocked && 'cursor-pointer hover:border-[#e2b04a]/60',
      )}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#4ecdc4] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {isLocked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-5 h-5 text-[#e0d8c8]/40" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg text-lg font-bold font-["Crimson_Text"]',
            isActive && 'bg-[#e2b04a] text-[#1a1a2e]',
            isCompleted && 'bg-[#4ecdc4]/20 text-[#4ecdc4]',
            !isActive && !isCompleted && 'bg-[#e2b04a]/10 text-[#e2b04a]/60',
          )}
        >
          {stepInfo.order}
        </span>
        <div>
          <h3 className="font-['Crimson_Text'] text-lg font-semibold text-[#e0d8c8]">
            {stepInfo.title}
          </h3>
          <p className="text-sm text-[#e0d8c8]/60">{stepInfo.subtitle}</p>
        </div>
      </div>

      <p className="text-sm text-[#e0d8c8]/70 leading-relaxed">{stepInfo.description}</p>

      <span className="text-xs text-[#e2b04a]/50 font-mono">{stepInfo.icon}</span>
    </motion.button>
  )
}
