import { useState } from 'react'
import { motion } from 'framer-motion'
import MatrixInput from '@/components/ui/MatrixInput'
import StepDisplay from '@/components/ui/StepDisplay'
import MathRenderer from '@/components/ui/MathRenderer'
import KnowledgeBridge from '@/components/ui/KnowledgeBridge'
import KnowledgeDetail from '@/components/ui/KnowledgeDetail'
import { useProgressStore } from '@/store/progressStore'
import { cn } from '@/lib/utils'
import type { Matrix, CalculationStep } from '@/types'

function calculateDeterminant(A: Matrix): { value: number; steps: CalculationStep[] } {
  const steps: CalculationStep[] = []
  const n = A.length

  if (n === 1) {
    steps.push({
      title: '1×1 行列式',
      math: `|A| = ${A[0][0]}`,
      description: '一阶行列式即为该元素本身',
    })
    return { value: A[0][0], steps }
  }

  if (n === 2) {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]
    steps.push({
      title: '二阶行列式公式',
      math: `\\begin{vmatrix} ${A[0][0]} & ${A[0][1]} \\\\ ${A[1][0]} & ${A[1][1]} \\end{vmatrix} = ${A[0][0]} \\times ${A[1][1]} - ${A[0][1]} \\times ${A[1][0]} = ${det}`,
      description: '主对角线乘积减副对角线乘积',
    })
    return { value: det, steps }
  }

  steps.push({
    title: `按第1行展开 (Laplace)`,
    math: `\\begin{vmatrix} ${A[0].join(' & ')} \\\\ ${A[1].join(' & ')} \\\\ ${A[2]?.join(' & ') ?? ''} \\end{vmatrix}`,
    description: '使用Laplace展开定理，按第一行展开计算行列式',
  })

  let det = 0
  for (let j = 0; j < n; j++) {
    const sign = (j % 2 === 0) ? 1 : -1
    const minor = getMinor(A, 0, j)
    const subDet = calculateDeterminant(minor).value
    const term = sign * A[0][j] * subDet
    det += term

    steps.push({
      title: `元素 a_{1,${j + 1}} = ${A[0][j]}`,
      math: `${sign > 0 ? '+' : '-'}${Math.abs(A[0][j])} \\times \\begin{vmatrix} ${minor.map(r => r.join(' & ')).join(' \\\\ ')} \\end{vmatrix} = ${sign > 0 ? '+' : '-'}${Math.abs(A[0][j])} \\times ${subDet} = ${term}`,
      description: sign > 0 ? '余子式展开项' : '余子式展开项（带符号）',
    })
  }

  steps.push({
    title: '计算结果',
    math: `|A| = ${det}`,
    description: '将所有展开项相加得到最终行列式值',
  })

  return { value: det, steps }
}

function getMinor(A: Matrix, row: number, col: number): Matrix {
  return A
    .filter((_, i) => i !== row)
    .map((r) => r.filter((_, j) => j !== col))
}

export default function DeterminantPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrix, setMatrix] = useState<Matrix>([
    [1, 2],
    [3, 4],
  ])
  const [result, setResult] = useState<number | null>(null)
  const [steps, setSteps] = useState<CalculationStep[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('determinant')

  const handleCalculate = () => {
    const { value, steps: calcSteps } = calculateDeterminant(matrix)
    setResult(value)
    setSteps(calcSteps)
    setCurrentStep(-1)
  }

  const handleMarkComplete = () => {
    completeStep('determinant')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#e2b04a]/20 text-[#e2b04a]">
            第1步
          </span>
          <h1 className="text-3xl font-bold text-gold">行列式计算器</h1>
        </div>
        <p className="text-gray-400">
          输入方阵，使用 Laplace 展开定理计算行列式，支持2阶到4阶方阵
        </p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="determinant" />

      <div className="bg-card rounded-xl border border-white/10 p-1.5 inline-flex gap-1">
        <button
          onClick={() => setActiveTab('calculator')}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'calculator'
              ? 'bg-[#e2b04a] text-[#1a1a2e]'
              : 'text-gray-400 hover:text-gray-200'
          )}
        >
          交互计算
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'knowledge'
              ? 'bg-[#e2b04a] text-[#1a1a2e]'
              : 'text-gray-400 hover:text-gray-200'
          )}
        >
          知识点详解
        </button>
      </div>

      {activeTab === 'calculator' ? (
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card rounded-xl border border-white/10 p-6 space-y-6">
          <MatrixInput
            matrix={matrix}
            onChange={setMatrix}
            minSize={2}
            maxSize={4}
            label="输入矩阵"
          />

          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-lg bg-[#e2b04a] text-[#1a1a2e] font-semibold hover:bg-[#e2b04a]/90 transition-colors active:scale-[0.98]"
          >
            计算行列式
          </button>
        </div>

        <div className="space-y-6">
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-xl border border-[#e2b04a]/40 p-6"
            >
              <h3 className="text-sm text-gray-400 mb-3">计算结果</h3>
              <div className="text-center py-4">
                <MathRenderer
                  math={`|A| = ${result}`}
                  displayMode
                />
              </div>
            </motion.div>
          )}

          <StepDisplay steps={steps} currentStep={currentStep} />
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="determinant" />
      )}

      <KnowledgeBridge mode="next" stepId="determinant" />

      <div className="flex justify-end">
        <button
          onClick={handleMarkComplete}
          className={cn(
            'px-6 py-2 rounded-lg font-medium transition-all duration-300',
            completed
              ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] border border-[#4ecdc4]/40'
              : 'bg-[#e2b04a]/10 text-[#e2b04a] border border-[#e2b04a]/30 hover:bg-[#e2b04a]/20'
          )}
        >
          {completed ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </motion.div>
  )
}
