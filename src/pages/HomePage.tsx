import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, CheckCircle2, Lock, Sparkles, ChevronRight } from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'
import { LEARNING_STEPS } from '@/types'
import type { StepId } from '@/types'
import { cn } from '@/lib/utils'

const stepRoutes: Record<StepId, string> = {
  determinant: '/determinant',
  rank: '/rank',
  matrix: '/matrix',
  equations: '/equations',
  'basic-solutions': '/basic-solutions',
  eigen: '/eigen',
  'similar-diagonal': '/similar-diagonal',
  'contract-diagonal': '/contract-diagonal',
  'quadratic-form': '/quadratic-form',
}

const stepIcons: Record<StepId, string> = {
  determinant: '|A|',
  rank: 'r(A)',
  matrix: 'Aᵀ',
  equations: 'Ax=b',
  'basic-solutions': 'N(A)',
  eigen: 'Av=λv',
  'similar-diagonal': 'P⁻¹AP',
  'contract-diagonal': 'CᵀAC',
  'quadratic-form': 'xᵀAx',
}

const bridgeLabels: Record<number, string> = {
  1: 'det(A) = 0 ⟹ 行向量线性相关 ⟹ 秩 < n',
  2: '秩 = 信息量度量 ⟹ 矩阵基本运算',
  3: '矩阵运算 ⟹ Ax=b 紧凑表示 ⟹ 方程组',
  4: '秩的比较 ⟹ 解类型判定 ⟹ 解空间',
  5: 'dim N(A)=n−r(A) ⟹ 零空间 ⟹ 特征方程',
  6: '特征向量 ➝ P ⟹ P⁻¹AP=Λ 相似对角化',
  7: '相似 ➝ 合同：CᵀAC 对称矩阵对角化',
  8: '合同矩阵 = 二次型系数矩阵 ⟹ 标准化',
}

const flowChain = [
  { id: 'determinant', label: '行列式' },
  { id: 'rank', label: '求秩' },
  { id: 'matrix', label: '矩阵' },
  { id: 'equations', label: '方程组' },
  { id: 'basic-solutions', label: '基础解系' },
  { id: 'eigen', label: '特征值' },
  { id: 'similar-diagonal', label: '相似对角化' },
  { id: 'contract-diagonal', label: '合同对角化' },
  { id: 'quadratic-form', label: '二次型标准型' },
] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function HomePage() {
  const navigate = useNavigate()
  const { isStepCompleted, completedSteps } = useProgressStore()

  const lastCompleted = completedSteps.length
  const allCompleted = completedSteps.length === LEARNING_STEPS.length

  const getStepState = (order: number): 'completed' | 'current' | 'locked' => {
    if (order <= completedSteps.length) return 'completed'
    if (order === lastCompleted + 1) return 'current'
    return 'locked'
  }

  const handleCardClick = (stepId: StepId, state: string) => {
    if (state !== 'locked') navigate(stepRoutes[stepId])
  }

  return (
    <div className="space-y-10 pb-12">
      {/* ═══════════════ HERO ═══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-5 py-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2b04a] tracking-wide font-['Crimson_Text']">
          你应该怎样理解线代
        </h1>
        <p className="text-[#e0d8c8]/70 text-lg max-w-2xl mx-auto leading-relaxed">
          每一步建立在上一步之上，九步递进，从行列式出发，穿越矩阵运算、方程组求解、特征值理论，
          最终抵达二次型标准化的巅峰
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#e0d8c8]/50">
          <span className="text-[#4ecdc4] font-semibold">{completedSteps.length}</span>
          <span>/</span>
          <span>{LEARNING_STEPS.length}</span>
          <span>步已完成</span>
          {allCompleted && (
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="ml-3 inline-flex items-center gap-1 text-[#e2b04a] text-sm"
            >
              <Sparkles className="w-4 h-4" />
              全部完成
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* ═══════════════ KNOWLEDGE FLOW CHART ═══════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl border border-[#e2b04a]/10 bg-[#1a1a2e]/40 p-6 overflow-x-auto"
      >
        <div className="flex items-center gap-1.5 min-w-max mx-auto justify-center flex-wrap px-4">
          {flowChain.map((item, idx) => {
            const stepInfo = LEARNING_STEPS.find((s) => s.id === item.id)
            const state = stepInfo ? getStepState(stepInfo.order) : 'locked'
            return (
              <div key={item.id} className="flex items-center gap-1.5">
                <motion.button
                  whileHover={state !== 'locked' ? { scale: 1.08, y: -2 } : undefined}
                  whileTap={state !== 'locked' ? { scale: 0.95 } : undefined}
                  onClick={() => state !== 'locked' && navigate(stepRoutes[item.id as StepId])}
                  disabled={state === 'locked'}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                    'border',
                    state === 'completed' &&
                      'bg-[#4ecdc4]/15 text-[#4ecdc4] border-[#4ecdc4]/30',
                    state === 'current' &&
                      'bg-[#e2b04a]/15 text-[#e2b04a] border-[#e2b04a]/50 shadow-[0_0_12px_rgba(226,176,74,0.3)]',
                    state === 'locked' &&
                      'bg-transparent text-[#e0d8c8]/30 border-[#e0d8c8]/10 cursor-not-allowed',
                    state !== 'locked' && 'cursor-pointer hover:brightness-125'
                  )}
                >
                  {state === 'completed' ? (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.label}
                    </span>
                  ) : state === 'locked' ? (
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </motion.button>
                {idx < flowChain.length - 1 && (
                  <ArrowRight
                    className={cn(
                      'w-3.5 h-3.5 flex-shrink-0',
                      idx < completedSteps.length
                        ? 'text-[#4ecdc4]/50'
                        : 'text-[#e0d8c8]/15'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ═══════════════ STEP CARDS ═══════════════ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-3xl mx-auto"
      >
        {/* Vertical timeline backbone */}
        <div className="absolute left-9 top-6 bottom-6 w-px bg-[#e0d8c8]/8" />

        {LEARNING_STEPS.map((step, idx) => {
          const state = getStepState(step.order)
          const isLocked = state === 'locked'
          const isCurrent = state === 'current'
          const isDone = state === 'completed'

          const prereqIds = step.prerequisites
            .map((p) =>
              LEARNING_STEPS.find((s) => s.title === p || p.includes(s.title) || s.title.includes(p))
            )
            .filter(Boolean)

          const nextStepInfo =
            idx < LEARNING_STEPS.length - 1 ? LEARNING_STEPS[idx + 1] : null

          return (
            <motion.div key={step.id} variants={fadeInUp} className="relative mb-3">
              {/* Timeline node */}
              <div className="absolute left-9 top-7 -translate-x-1/2 z-10">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    isDone && 'bg-[#4ecdc4]/20 border-[#4ecdc4]',
                    isCurrent && 'bg-[#e2b04a]/20 border-[#e2b04a] ring-4 ring-[#e2b04a]/10',
                    isLocked && 'bg-transparent border-[#e0d8c8]/15'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-[#4ecdc4]" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-[#e2b04a]" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e0d8c8]/20" />
                  )}
                </div>
              </div>

              {/* Bridge label between this card and previous */}
              {idx > 0 && bridgeLabels[idx] && (
                <div className="ml-[4.5rem] mb-1 flex items-center gap-2">
                  <ArrowDown className="w-3 h-3 text-[#e0d8c8]/20" />
                  <span
                    className={cn(
                      'text-[10px] leading-relaxed',
                      completedSteps.length >= idx
                        ? 'text-[#4ecdc4]/40'
                        : 'text-[#e0d8c8]/20'
                    )}
                  >
                    {bridgeLabels[idx]}
                  </span>
                </div>
              )}

              {/* Card */}
              <div className="ml-[4.5rem]">
                <button
                  onClick={() => handleCardClick(step.id, state)}
                  disabled={isLocked}
                  className={cn(
                    'w-full text-left rounded-xl border p-5 transition-all duration-300',
                    'hover:translate-x-1',
                    isLocked && 'opacity-50 cursor-not-allowed hover:translate-x-0',
                    isCurrent &&
                      'border-[#e2b04a] bg-[#e2b04a]/5 shadow-[0_0_20px_rgba(226,176,74,0.1)]',
                    isDone && 'border-[#4ecdc4]/25 bg-[#4ecdc4]/5',
                    !isCurrent && !isDone && !isLocked && 'border-white/10 bg-[#16213e]/30'
                  )}
                >
                  {/* Top row: icon + title */}
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-xl font-serif font-bold transition-all',
                        isDone && 'bg-[#4ecdc4]/20 text-[#4ecdc4]',
                        isCurrent && 'bg-[#e2b04a]/20 text-[#e2b04a]',
                        isLocked && 'bg-white/5 text-[#e0d8c8]/30'
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <span>{stepIcons[step.id]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            isDone && 'bg-[#4ecdc4]/20 text-[#4ecdc4]',
                            isCurrent && 'bg-[#e2b04a]/20 text-[#e2b04a]',
                            isLocked && 'bg-white/5 text-[#e0d8c8]/30'
                          )}
                        >
                          {step.subtitle}
                        </span>
                        <h3
                          className={cn(
                            'text-lg font-bold font-["Crimson_Text"]',
                            isDone && 'text-[#4ecdc4]',
                            isCurrent && 'text-[#e2b04a]',
                            isLocked && 'text-[#e0d8c8]/40'
                          )}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-[#e0d8c8]/60 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {!isLocked && (
                      <ChevronRight
                        className={cn(
                          'flex-shrink-0 self-center w-5 h-5',
                          isDone ? 'text-[#4ecdc4]' : 'text-[#e2b04a]'
                        )}
                      />
                    )}
                  </div>

                  {/* Prerequisite tags */}
                  {prereqIds.length > 0 && !isLocked && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-[#e0d8c8]/30">前置</span>
                      {prereqIds.map((ps) => (
                        <span
                          key={ps!.id}
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-medium',
                            isStepCompleted(ps!.id)
                              ? 'bg-[#4ecdc4]/15 text-[#4ecdc4]'
                              : 'bg-[#e2b04a]/10 text-[#e2b04a]/60'
                          )}
                        >
                          {ps!.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* "通往" footer */}
                  {nextStepInfo && (isDone || isCurrent) && (
                    <div className="mt-3 pt-3 border-t border-[#e0d8c8]/5 flex items-center gap-2 text-xs">
                      <ArrowRight className="w-3 h-3 text-[#4ecdc4]/50" />
                      <span className="text-[#e0d8c8]/30">通往</span>
                      <span
                        className={cn(
                          'font-medium',
                          isDone ? 'text-[#4ecdc4]/70' : 'text-[#e2b04a]/60'
                        )}
                      >
                        {nextStepInfo.title}
                      </span>
                      {isDone && (
                        <span className="text-[10px] text-[#4ecdc4]/40">
                          解锁: {nextStepInfo.title}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ═══════════════ CELEBRATION BANNER ═══════════════ */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-xl mx-auto rounded-2xl border border-[#4ecdc4]/30 bg-gradient-to-br from-[#4ecdc4]/10 to-[#e2b04a]/5 p-8 text-center"
        >
          <Sparkles className="w-12 h-12 text-[#e2b04a] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#e0d8c8] font-['Crimson_Text'] mb-2">
            旅程完成
          </h3>
          <p className="text-sm text-[#e0d8c8]/60 leading-relaxed">
            恭喜！你已经完成了线性代数全部九个知识模块的学习。
            都是150分的苗子!
          </p>
        </motion.div>
      )}
    </div>
  )
}
