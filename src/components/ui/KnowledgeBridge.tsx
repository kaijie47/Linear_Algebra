import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LEARNING_STEPS } from '@/types'
import type { StepId } from '@/types'
import { useProgressStore } from '@/store/progressStore'

interface KnowledgeBridgeProps {
  mode: 'prerequisite' | 'next'
  stepId: StepId
}

function matchPrerequisiteStepId(prereq: string): StepId | undefined {
  return LEARNING_STEPS.find(
    (s) => s.title === prereq || prereq.includes(s.title) || s.title.includes(prereq)
  )?.id
}

export default function KnowledgeBridge({ mode, stepId }: KnowledgeBridgeProps) {
  const navigate = useNavigate()
  const { isStepCompleted } = useProgressStore()
  const step = LEARNING_STEPS.find((s) => s.id === stepId)
  if (!step) return null

  if (mode === 'prerequisite') {
    const prereqIds = step.prerequisites
      .map(matchPrerequisiteStepId)
      .filter((id): id is StepId => id !== undefined)

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-[#e2b04a]/20 bg-[#1a1a2e]/60 p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-[#e2b04a]" />
          <h3 className="text-sm font-semibold text-[#e2b04a]">先备知识</h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {prereqIds.map((pid, i) => {
            const ps = LEARNING_STEPS.find((s) => s.id === pid)
            const isDone = isStepCompleted(pid)
            return (
              <div key={pid} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 transition-colors',
                    isDone
                      ? 'bg-[#4ecdc4]/15 text-[#4ecdc4]'
                      : 'bg-[#e2b04a]/10 text-[#e2b04a]/70'
                  )}
                >
                  {isDone && <CheckCircle2 className="w-3 h-3" />}
                  {ps?.title ?? pid}
                </span>
                <ArrowRight className="w-3 h-3 text-[#e2b04a]/40" />
              </div>
            )
          })}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e2b04a]/20 text-[#e2b04a] ring-1 ring-[#e2b04a]/30">
            {step.title}
          </span>
        </div>

        {step.bridges && (
          <p className="text-sm text-[#e0d8c8]/70 leading-relaxed">{step.bridges}</p>
        )}
      </motion.div>
    )
  }

  if (step.id === 'quadratic-form') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-[#4ecdc4]/30 bg-[#4ecdc4]/5 p-6 mt-8 text-center"
      >
        <Sparkles className="w-10 h-10 text-[#4ecdc4] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#4ecdc4] font-['Crimson_Text']">全部完成！</h3>
        <p className="text-sm text-[#e0d8c8]/60 mt-2 max-w-md mx-auto leading-relaxed">
          你已经完成了线性代数的整个学习旅程。从行列式到二次型标准化，每一个知识点都为你打开了新的视野。
        </p>
      </motion.div>
    )
  }

  const nextStep = LEARNING_STEPS.find((s) => s.order === step.order + 1)
  if (!nextStep) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-[#4ecdc4]/20 bg-[#4ecdc4]/5 p-5 mt-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-[#4ecdc4]" />
        <h3 className="text-sm font-semibold text-[#4ecdc4]">下一步</h3>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-[#e0d8c8]/40">{nextStep.subtitle}</span>
            <ArrowRight className="w-3 h-3 text-[#4ecdc4]/50" />
            <span className="text-base font-bold text-[#e0d8c8] font-['Crimson_Text']">
              {nextStep.title}
            </span>
          </div>
          <p className="text-sm text-[#e0d8c8]/60 leading-relaxed">{step.nextPreview}</p>
        </div>

        <button
          onClick={() => navigate(`/${nextStep.id}`)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            'bg-[#4ecdc4]/15 text-[#4ecdc4] border border-[#4ecdc4]/30',
            'hover:bg-[#4ecdc4]/25 hover:scale-105 active:scale-95'
          )}
        >
          开始下一步
        </button>
      </div>
    </motion.div>
  )
}
