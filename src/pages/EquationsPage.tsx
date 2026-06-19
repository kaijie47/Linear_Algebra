import { useState } from 'react'
import { motion } from 'framer-motion'
import MatrixInput from '@/components/ui/MatrixInput'
import MathRenderer from '@/components/ui/MathRenderer'
import StepDisplay from '@/components/ui/StepDisplay'
import KnowledgeBridge from '@/components/ui/KnowledgeBridge'
import KnowledgeDetail from '@/components/ui/KnowledgeDetail'
import { useProgressStore } from '@/store/progressStore'
import { cn } from '@/lib/utils'
import type { Matrix, CalculationStep } from '@/types'
import { isZero, cloneMatrix, roundMatrix } from '@/engine/matrix'

function solveEquations(A: Matrix, b: number[]): {
  type: 'unique' | 'infinite' | 'none'
  solution?: number[]
  steps: CalculationStep[]
  generalSolution?: string
} {
  const steps: CalculationStep[] = []
  const n = A[0]?.length ?? 0
  const m = A.length
  const augMat = A.map((row, i) => [...row, b[i] ?? 0])

  steps.push({
    title: '增广矩阵 (A|b)',
    math: `\\begin{pmatrix} ${augMat.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: '将系数矩阵和常数项合并为增广矩阵',
  })

  const mat = cloneMatrix(augMat)
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
      ;[mat[row], mat[pivot]] = [mat[pivot], mat[row]]
      steps.push({
        title: `交换第 ${row + 1} 行与第 ${pivot + 1} 行`,
        math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
      })
    }

    const pivotVal = mat[row][col]
    for (let i = row + 1; i < m; i++) {
      if (!isZero(mat[i][col])) {
        const factor = mat[i][col] / pivotVal
        for (let j = col; j <= n; j++) {
          mat[i][j] -= factor * mat[row][j]
        }
        mat[i] = roundMatrix([mat[i]])[0]
      }
    }
    row++
  }

  steps.push({
    title: '化为行阶梯形',
    math: `\\begin{pmatrix} ${mat.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: '矩阵已化为行阶梯形',
  })

  const rankA = mat.filter(r => r.slice(0, n).some(v => !isZero(v))).length
  const rankAug = mat.filter(r => r.some(v => !isZero(v))).length

  if (rankA < rankAug) {
    steps.push({ title: '判断解类型', math: `r(A) = ${rankA} < r(A|b) = ${rankAug}`, description: '秩不相等，方程组无解' })
    return { type: 'none', steps }
  }

  if (rankA < n) {
    steps.push({ title: '判断解类型', math: `r(A) = r(A|b) = ${rankA} < n = ${n}`, description: '秩相等但小于未知数个数，有无穷多解' })
    return {
      type: 'infinite',
      steps,
      generalSolution: `方程组有无穷多解，自由变量个数: ${n - rankA}`,
    }
  }

  if (rankA === n && rankA === m) {
    const solution = backSubstitution(mat, n)
    steps.push({
      title: '回代求解',
      math: `x = \\begin{pmatrix} ${solution.map(v => v.toFixed(4)).join(' \\\\\\\\ ')} \\end{pmatrix}`,
      description: '方阵满秩，存在唯一解',
    })
    return { type: 'unique', solution, steps }
  }

  steps.push({ title: '判断解类型', math: `r(A) = r(A|b) = ${rankA} = n = ${n}`, description: '存在唯一解' })
  return { type: 'unique', solution: backSubstitution(mat, n), steps }
}

function backSubstitution(mat: Matrix, n: number): number[] {
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0
    for (let j = i + 1; j < n; j++) {
      sum += mat[i][j] * x[j]
    }
    x[i] = isZero(mat[i][i]) ? 0 : (mat[i][n] - sum) / mat[i][i]
  }
  return x
}

export default function EquationsPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrix, setMatrix] = useState<Matrix>([
    [2, 1, -1],
    [1, -1, 1],
    [3, 0, 0],
  ])
  const [vector, setVector] = useState<number[]>([8, -1, 9])
  const [result, setResult] = useState<{
    type: 'unique' | 'infinite' | 'none'
    solution?: number[]
    steps: CalculationStep[]
    generalSolution?: string
  } | null>(null)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('equations')

  const handleCalculate = () => {
    setResult(solveEquations(matrix, vector))
  }

  const handleVectorChange = (idx: number, value: string) => {
    const newVec = [...vector]
    newVec[idx] = parseFloat(value) || 0
    setVector(newVec)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#e2b04a]/20 text-[#e2b04a]">第4步</span>
          <h1 className="text-3xl font-bold text-gold">刻画方程组</h1>
        </div>
        <p className="text-gray-400">用矩阵语言描述线性方程组 Ax = b，判断解的类型并求解</p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="equations" />

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
          <MatrixInput matrix={matrix} onChange={setMatrix} minSize={1} maxSize={5} label="系数矩阵 A" />

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-300">常数向量 b</div>
            <div className="flex gap-2">
              {vector.map((val, i) => (
                <input
                  key={i}
                  type="number"
                  value={val}
                  onChange={(e) => handleVectorChange(i, e.target.value)}
                  className={cn(
                    'w-20 h-10 text-center text-sm rounded border bg-[#0f3460]/50 border-[#e2b04a]/20 text-[#e0d8c8]',
                    'focus:outline-none focus:border-[#e2b04a] focus:ring-1 focus:ring-[#e2b04a]/50',
                    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  )}
                />
              ))}
              {vector.length < matrix.length && (
                <button
                  onClick={() => setVector([...vector, 0])}
                  className="w-10 h-10 rounded bg-[#0f3460]/50 text-[#4ecdc4] text-sm hover:bg-[#0f3460]"
                >
                  +
                </button>
              )}
              {vector.length > 1 && vector.length > matrix.length && (
                <button
                  onClick={() => setVector(vector.slice(0, -1))}
                  className="w-10 h-10 rounded bg-[#0f3460]/50 text-[#e2b04a] text-sm hover:bg-[#0f3460]"
                >
                  −
                </button>
              )}
            </div>
          </div>

          <button onClick={handleCalculate} className="w-full py-3 rounded-lg bg-[#e2b04a] text-[#1a1a2e] font-semibold hover:bg-[#e2b04a]/90 transition-colors active:scale-[0.98]">
            求解
          </button>
        </div>

        <div className="space-y-6">
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl border border-[#4ecdc4]/40 p-6 space-y-4">
              <h3 className="text-sm text-gray-400">解的类型</h3>
              <div className={cn(
                'inline-flex px-4 py-2 rounded-full text-sm font-semibold',
                result.type === 'unique' && 'bg-[#4ecdc4]/20 text-[#4ecdc4]',
                result.type === 'infinite' && 'bg-[#e2b04a]/20 text-[#e2b04a]',
                result.type === 'none' && 'bg-red-500/20 text-red-400'
              )}>
                {result.type === 'unique' ? '唯一解' : result.type === 'infinite' ? '无穷多解' : '无解'}
              </div>

              {result.type === 'unique' && result.solution && (
                <div className="py-2">
                  <MathRenderer
                    math={`x = \\begin{pmatrix} ${result.solution.map((v, i) => `x_{${i + 1}} = ${v.toFixed(4)}`).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                    displayMode
                  />
                </div>
              )}

              {result.type === 'infinite' && result.generalSolution && (
                <p className="text-sm text-gray-300">{result.generalSolution}</p>
              )}

              {result.type === 'none' && (
                <p className="text-sm text-gray-300">增广矩阵的秩大于系数矩阵的秩，方程组无解。</p>
              )}
            </motion.div>
          )}

          {result && <StepDisplay steps={result.steps} />}
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="equations" />
      )}

      <KnowledgeBridge mode="next" stepId="equations" />

      <div className="flex justify-end">
        <button onClick={() => completeStep('equations')} className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all duration-300',
          completed ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] border border-[#4ecdc4]/40' : 'bg-[#e2b04a]/10 text-[#e2b04a] border border-[#e2b04a]/30 hover:bg-[#e2b04a]/20'
        )}>
          {completed ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </motion.div>
  )
}
