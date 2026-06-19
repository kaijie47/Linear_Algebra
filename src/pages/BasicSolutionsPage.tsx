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
import { isZero, cloneMatrix, roundMatrix } from '@/engine/matrix'

function findBasicSolutions(A: Matrix): {
  basisSolutions: Matrix
  rank: number
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const m = A.length
  const n = A[0]?.length ?? 0
  if (n === 0) return { basisSolutions: [], rank: 0, steps: [] }

  const mat = cloneMatrix(A)

  steps.push({
    title: '初始矩阵',
    math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `原始 ${m}×${n} 齐次方程组 Ax = 0`,
  })

  let row = 0
  const pivotCols: number[] = []

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
      ;[mat[row], mat[pivot]] = [mat[pivot], mat[row]]
    }

    const pivotVal = mat[row][col]
    for (let j = col; j < n; j++) {
      mat[row][j] /= pivotVal
    }

    for (let i = 0; i < m; i++) {
      if (i !== row && !isZero(mat[i][col])) {
        const factor = mat[i][col]
        for (let j = col; j < n; j++) {
          mat[i][j] -= factor * mat[row][j]
        }
      }
    }

    mat[row] = roundMatrix([mat[row]])[0]
    pivotCols.push(col)
    row++
  }

  steps.push({
    title: '化为简化行阶梯形',
    math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `主元列: ${pivotCols.map(c => c + 1).join(', ')}`,
  })

  const rank = pivotCols.length
  const freeCols: number[] = []
  for (let j = 0; j < n; j++) {
    if (!pivotCols.includes(j)) freeCols.push(j)
  }

  const basisSolutions: Matrix = []

  for (const freeCol of freeCols) {
    const vec: number[] = new Array(n).fill(0)
    vec[freeCol] = 1
    for (let i = 0; i < rank; i++) {
      vec[pivotCols[i]] = -mat[i][freeCol]
    }
    basisSolutions.push(vec)
  }

  steps.push({
    title: '基础解系',
    math: basisSolutions.map((v, i) =>
      `\\xi_{${i + 1}} = \\begin{pmatrix} ${v.map(x => x.toFixed(4)).join(' \\\\\\\\ ')} \\end{pmatrix}`
    ).join('\\quad'),
    description: `dim N(A) = ${n} - ${rank} = ${n - rank}，共 ${basisSolutions.length} 个基础解向量`,
  })

  return { basisSolutions, rank, steps }
}

export default function BasicSolutionsPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrix, setMatrix] = useState<Matrix>([
    [1, 1, -1, -1],
    [2, -5, 3, 2],
    [7, -7, 3, 1],
  ])
  const [result, setResult] = useState<{
    basisSolutions: Matrix
    rank: number
    steps: CalculationStep[]
  } | null>(null)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('basic-solutions')

  const handleCalculate = () => {
    setResult(findBasicSolutions(matrix))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#e2b04a]/20 text-[#e2b04a]">第5步</span>
          <h1 className="text-3xl font-bold text-gold">求基础解系</h1>
        </div>
        <p className="text-gray-400">求解齐次方程组的基础解系，理解解空间的结构</p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="basic-solutions" />

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
          <MatrixInput matrix={matrix} onChange={setMatrix} minSize={1} maxSize={6} label="系数矩阵 A (齐次方程组 Ax = 0)" />
          <button onClick={handleCalculate} className="w-full py-3 rounded-lg bg-[#e2b04a] text-[#1a1a2e] font-semibold hover:bg-[#e2b04a]/90 transition-colors active:scale-[0.98]">
            求基础解系
          </button>
        </div>

        <div className="space-y-6">
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl border border-[#4ecdc4]/40 p-6 space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-[#0f3460] rounded-lg px-4 py-2">
                  <span className="text-xs text-gray-400">秩</span>
                  <div className="text-lg font-bold text-[#e2b04a]">r(A) = {result.rank}</div>
                </div>
                <div className="bg-[#0f3460] rounded-lg px-4 py-2">
                  <span className="text-xs text-gray-400">解空间维数</span>
                  <div className="text-lg font-bold text-[#4ecdc4]">
                    {`dim N(A) = ${matrix[0]?.length ?? 0} - ${result.rank} = ${(matrix[0]?.length ?? 0) - result.rank}`}
                  </div>
                </div>
              </div>

              {result.basisSolutions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-400">基础解系</h3>
                  <div className="space-y-4">
                    {result.basisSolutions.map((vec, i) => (
                      <div key={i} className="bg-[#0f3460]/30 rounded-lg p-4">
                        <MathRenderer
                          math={`\\xi_{${i + 1}} = \\begin{pmatrix} ${vec.map(v => v.toFixed(4)).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                          displayMode
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    通解: x = {result.basisSolutions.map((_, i) => `k_{${i + 1}}\\xi_{${i + 1}}`).join(' + ')} ({result.basisSolutions.map((_, i) => `k_{${i + 1}}`).join(', ')} ∈ ℝ)
                  </p>
                </div>
              )}

              {result.basisSolutions.length === 0 && (
                <p className="text-sm text-gray-300">矩阵满秩，齐次方程组只有零解</p>
              )}
            </motion.div>
          )}

          {result && <StepDisplay steps={result.steps} />}
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="basic-solutions" />
      )}

      <KnowledgeBridge mode="next" stepId="basic-solutions" />

      <div className="flex justify-end">
        <button onClick={() => completeStep('basic-solutions')} className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all duration-300',
          completed ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] border border-[#4ecdc4]/40' : 'bg-[#e2b04a]/10 text-[#e2b04a] border border-[#e2b04a]/30 hover:bg-[#e2b04a]/20'
        )}>
          {completed ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </motion.div>
  )
}
