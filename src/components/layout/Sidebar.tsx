import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sigma, Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LEARNING_STEPS } from '@/types'
import { useProgressStore } from '@/store/progressStore'

const sidebarSteps = LEARNING_STEPS

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isStepCompleted, isStepUnlocked, currentStep } = useProgressStore()

  const handleStepClick = (stepId: string) => {
    if (isStepUnlocked(stepId as any)) {
      navigate(`/${stepId}`)
    }
  }

  const isStepActive = (stepId: string) => {
    return location.pathname === `/${stepId}` || (currentStep && currentStep === stepId)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#1a1a2e] border-r border-[#e2b04a]/10 flex flex-col z-40">
      <div
        className="flex items-center gap-3 px-6 py-5 border-b border-[#e2b04a]/10 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e2b04a]/10">
          <Sigma className="w-6 h-6 text-[#e2b04a]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#e0d8c8] font-['Crimson_Text']">
            线性代数
          </h1>
          <p className="text-xs text-[#e0d8c8]/40">学习之旅</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {sidebarSteps.map((step, index) => {
          const completed = isStepCompleted(step.id)
          const unlocked = isStepUnlocked(step.id)
          const active = isStepActive(step.id)
          const locked = !unlocked

          return (
            <motion.button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={locked}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                active && 'bg-[#e2b04a]/10 border border-[#e2b04a]/40',
                !active && !locked && 'hover:bg-[#e2b04a]/5',
                locked && 'cursor-not-allowed opacity-40',
                !locked && 'cursor-pointer',
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold flex-shrink-0',
                  active && 'bg-[#e2b04a] text-[#1a1a2e]',
                  completed && !active && 'bg-[#4ecdc4]/20 text-[#4ecdc4]',
                  locked && 'bg-[#e0d8c8]/5 text-[#e0d8c8]/30',
                  !active && !completed && !locked && 'bg-[#e2b04a]/10 text-[#e2b04a]/60',
                )}
              >
                {completed ? (
                  <Check className="w-3.5 h-3.5" />
                ) : locked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  step.order
                )}
              </span>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm truncate font-["Crimson_Text"]',
                    active && 'text-[#e2b04a] font-semibold',
                    !active && 'text-[#e0d8c8]/70',
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-[#e0d8c8]/30 truncate">{step.subtitle}</p>
              </div>

              {active && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-lg bg-[#e2b04a]/5 shadow-[0_0_15px_rgba(226,176,74,0.1)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="px-4 py-3 border-t border-[#e2b04a]/10">
        <p className="text-[10px] text-[#e0d8c8]/20 text-center">
          线性代数 · 学习平台
        </p>
      </div>
    </aside>
  )
}
