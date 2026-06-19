import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MathRenderer from '@/components/ui/MathRenderer'
import { cn } from '@/lib/utils'
import type { CalculationStep } from '@/types'

interface StepDisplayProps {
  steps: CalculationStep[]
  currentStep?: number
}

export default function StepDisplay({ steps, currentStep: _currentStep }: StepDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [steps.length])

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[#e0d8c8]/40 text-sm">
        计算步骤将在此显示
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative max-h-[500px] overflow-y-auto pr-2 space-y-4 scrollbar-thin"
    >
      <AnimatePresence initial={false}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="rounded-xl border border-[#e2b04a]/20 bg-[#16213e]/80 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#e2b04a]/20 text-[#e2b04a] text-xs font-bold">
                {index + 1}
              </span>
              <h4 className="font-['Crimson_Text'] text-base font-semibold text-[#e0d8c8]">
                {step.title}
              </h4>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg bg-[#1a1a2e]/60 font-mono',
                step.highlightRows || step.highlightCols
                  ? 'border border-[#e2b04a]/30'
                  : '',
              )}
            >
              <MathRenderer math={step.math} displayMode />
            </div>

            {step.description && (
              <p className="mt-2 text-sm text-[#e0d8c8]/70 leading-relaxed">
                {step.description}
              </p>
            )}

            {(step.highlightRows || step.highlightCols) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {step.highlightRows?.map((r) => (
                  <span
                    key={`row-${r}`}
                    className="px-2 py-0.5 text-xs rounded-full bg-[#e2b04a]/10 text-[#e2b04a] border border-[#e2b04a]/30"
                  >
                    第 {r + 1} 行
                  </span>
                ))}
                {step.highlightCols?.map((c) => (
                  <span
                    key={`col-${c}`}
                    className="px-2 py-0.5 text-xs rounded-full bg-[#4ecdc4]/10 text-[#4ecdc4] border border-[#4ecdc4]/30"
                  >
                    第 {c + 1} 列
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  )
}
