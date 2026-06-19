import { useState } from 'react'
import { motion } from 'framer-motion'
import MatrixInput from '@/components/ui/MatrixInput'
import StepDisplay from '@/components/ui/StepDisplay'
import MathRenderer from '@/components/ui/MathRenderer'
import KnowledgeBridge from '@/components/ui/KnowledgeBridge'
import KnowledgeDetail from '@/components/ui/KnowledgeDetail'
import { useProgressStore } from '@/store/progressStore'
import { cn } from '@/lib/utils'
import type { Matrix, CalculationStep, EliminationStep } from '@/types'
import { isZero, cloneMatrix, roundMatrix } from '@/engine/matrix'

function calculateRank(A: Matrix): { rank: number; steps: CalculationStep[]; elimSteps: EliminationStep[] } {
  const steps: CalculationStep[] = []
  const m = A.length
  const n = A[0]?.length ?? 0
  const mat = cloneMatrix(A)

  if (n === 0) return { rank: 0, steps: [], elimSteps: [] }

  steps.push({
    title: '初始矩阵',
    math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`,
    description: `原始 ${m}×${n} 矩阵，开始高斯消元`,
  })

  let rank = 0
  let row = 0

  for (let col = 0; col < n && row < m; col++) {
    let pivot = -1
    for (let i = row; i < m; i++) {
      if (!isZero(mat[i][col])) {
        pivot = i
        break
      }
    }

    if (pivot === -1) continue

    if (pivot !== row) {
      const temp = mat[row]
      mat[row] = mat[pivot]
      mat[pivot] = temp
      steps.push({
        title: `交换第 ${row + 1} 行与第 ${pivot + 1} 行`,
        math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`,
        description: `交换行以获得非零主元`,
      })
    }

    const pivotVal = mat[row][col]
    for (let i = row + 1; i < m; i++) {
      if (!isZero(mat[i][col])) {
        const factor = mat[i][col] / pivotVal
        const prevRow = [...mat[i]]
        for (let j = col; j < n; j++) {
          mat[i][j] -= factor * mat[row][j]
        }
        mat[i] = roundMatrix([mat[i]])[0]
        steps.push({
          title: `消元：R${i + 1} → R${i + 1} - ${factor.toFixed(2)} × R${row + 1}`,
          math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`,
          description: `消除第 ${i + 1} 行第 ${col + 1} 列元素 (原值: ${prevRow[col]?.toFixed(2)})`,
        })
      }
    }

    rank++
    row++
  }

  steps.push({
    title: '消元完成',
    math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`,
    description: `矩阵已化为行阶梯形，非零行数为秩`,
  })

  return {
    rank,
    steps,
    elimSteps: [],
  }
}

export default function RankPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrix, setMatrix] = useState<Matrix>([
    [1, 2, 3],
    [2, 4, 6],
    [3, 6, 9],
  ])
  const [result, setResult] = useState<number | null>(null)
  const [steps, setSteps] = useState<CalculationStep[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('rank')

  const handleCalculate = () => {
    const { rank, steps: calcSteps } = calculateRank(matrix)
    setResult(rank)
    setSteps(calcSteps)
    setCurrentStep(-1)
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
            第2步
          </span>
          <h1 className="text-3xl font-bold text-gold">求秩</h1>
        </div>
        <p className="text-gray-400">
          通过高斯消元法将矩阵化为行阶梯形，计算矩阵的秩
        </p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="rank" />

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
            minSize={1}
            maxSize={6}
            label="输入矩阵"
          />

          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-lg bg-[#e2b04a] text-[#1a1a2e] font-semibold hover:bg-[#e2b04a]/90 transition-colors active:scale-[0.98]"
          >
            求秩
          </button>
        </div>

        <div className="space-y-6">
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-xl border border-[#4ecdc4]/40 p-6"
            >
              <h3 className="text-sm text-gray-400 mb-3">秩</h3>
              <div className="text-center py-4">
                <MathRenderer
                  math={`r(A) = ${result}`}
                  displayMode
                />
              </div>
              {result === matrix.length && result === (matrix[0]?.length ?? 0) && (
                <p className="text-sm text-[#4ecdc4] text-center">矩阵满秩</p>
              )}
              {result < Math.min(matrix.length, matrix[0]?.length ?? 0) && (
                <p className="text-sm text-gray-400 text-center">
                  矩阵秩亏损，不满秩
                </p>
              )}
            </motion.div>
          )}

          <StepDisplay steps={steps} currentStep={currentStep} />
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="rank" />
      )}

      <KnowledgeBridge mode="next" stepId="rank" />

      <div className="flex justify-end">
        <button
          onClick={() => completeStep('rank')}
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
