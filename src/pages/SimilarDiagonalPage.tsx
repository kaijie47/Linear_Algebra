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
import { isZero, cloneMatrix, roundMatrix, identityMatrix, matrixMultiply, inverse } from '@/engine/matrix'

function diagonalize(A: Matrix): {
  diagonalizable: boolean
  P?: Matrix
  D?: Matrix
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const n = A.length

  steps.push({
    title: '输入矩阵',
    math: `A = \\begin{pmatrix} ${A.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `${n}×${n} 方阵，判断是否可对角化`,
  })

  if (n === 1) {
    steps.push({ title: '一阶矩阵', math: 'P = (1), D = A', description: '一阶矩阵天然可对角化' })
    return { diagonalizable: true, P: [[1]], D: cloneMatrix(A), steps }
  }

  if (n === 2) {
    const a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1]
    const trace = a + d
    const det = a * d - b * c
    const discriminant = trace * trace - 4 * det

    let lambdas: number[] = []
    let poly = `\\lambda^2 - ${trace}\\lambda + ${det} = 0`
    steps.push({ title: '特征多项式', math: poly, description: `判别式 Δ = ${discriminant.toFixed(4)}` })

    if (discriminant >= 0) {
      const sqrtD = Math.sqrt(Math.max(0, discriminant))
      lambdas = [(trace + sqrtD) / 2, (trace - sqrtD) / 2]
    } else {
      steps.push({ title: '不可对角化', math: '', description: '存在复特征值，实数域上不可对角化' })
      return { diagonalizable: false, steps }
    }

    steps.push({ title: '特征值', math: `\\lambda_1 = ${lambdas[0].toFixed(4)}, \\quad \\lambda_2 = ${lambdas[1].toFixed(4)}` })

    const ev1 = getEigenvector2(A, lambdas[0])
    const ev2 = getEigenvector2(A, lambdas[1])

    if (ev1.length === 0 || ev2.length === 0) {
      steps.push({ title: '不可对角化', math: '', description: '不能找到足够线性无关的特征向量' })
      return { diagonalizable: false, steps }
    }

    const areDiff = Math.abs(lambdas[0] - lambdas[1]) > 1e-6

    steps.push({ title: '特征向量', math: `v_1 = \\begin{pmatrix} ${ev1.join(' \\\\\\\\ ')} \\end{pmatrix}, \\quad v_2 = \\begin{pmatrix} ${ev2.join(' \\\\\\\\ ')} \\end{pmatrix}` })

    if (!areDiff && ev1[0] * ev2[1] - ev1[1] * ev2[0] < 1e-6) {
      steps.push({ title: '不可对角化', math: '', description: '特征向量线性相关' })
      return { diagonalizable: false, steps }
    }

    const P: Matrix = [[ev1[0], ev2[0]], [ev1[1], ev2[1]]]
    const D: Matrix = [[lambdas[0], 0], [0, lambdas[1]]]

    steps.push({
      title: '构造 P 和 D',
      math: `P = \\begin{pmatrix} ${P.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}, \\quad D = \\begin{pmatrix} ${D.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
      description: 'P⁻¹AP = D',
    })

    try {
      const Pinv = inverse(cloneMatrix(P))
      const verify = roundMatrix(matrixMultiply(matrixMultiply(Pinv, cloneMatrix(A)), P))
      steps.push({
        title: '验证',
        math: `P^{-1}AP = \\begin{pmatrix} ${verify.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
        description: '验证对角化结果',
      })
    } catch {
      steps.push({ title: '验证失败', math: '', description: 'P 不可逆' })
      return { diagonalizable: false, steps }
    }

    return { diagonalizable: true, P, D, steps }
  }

  steps.push({ title: '提示', math: '', description: '3阶及以上矩阵对角化请以2阶方阵为例学习' })
  return { diagonalizable: false, steps }
}

function getEigenvector2(A: Matrix, lambda: number): number[] {
  const a00 = A[0][0] - lambda
  const a01 = A[0][1]
  const a10 = A[1][0]
  const a11 = A[1][1] - lambda

  if (!isZero(a01)) return [1, -a00 / a01]
  if (!isZero(a11)) return [-a01 / a11, 1]
  if (!isZero(a00) || !isZero(a10)) return [1, 0]
  return []
}

export default function SimilarDiagonalPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrix, setMatrix] = useState<Matrix>([
    [1, 2],
    [3, 2],
  ])
  const [result, setResult] = useState<{
    diagonalizable: boolean
    P?: Matrix
    D?: Matrix
    steps: CalculationStep[]
  } | null>(null)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('similar-diagonal')

  const handleCalculate = () => {
    setResult(diagonalize(matrix))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#e2b04a]/20 text-[#e2b04a]">第7步</span>
          <h1 className="text-3xl font-bold text-gold">相似对角阵</h1>
        </div>
        <p className="text-gray-400">判断矩阵是否可对角化，构造相似对角矩阵 P⁻¹AP = D</p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="similar-diagonal" />

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
          <MatrixInput matrix={matrix} onChange={setMatrix} minSize={2} maxSize={4} label="输入方阵 A" />
          <button onClick={handleCalculate} className="w-full py-3 rounded-lg bg-[#e2b04a] text-[#1a1a2e] font-semibold hover:bg-[#e2b04a]/90 transition-colors active:scale-[0.98]">
            对角化
          </button>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn(
                'bg-card rounded-xl border p-6',
                result.diagonalizable ? 'border-[#4ecdc4]/40' : 'border-red-500/30'
              )}>
                <div className={cn(
                  'inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-4',
                  result.diagonalizable ? 'bg-[#4ecdc4]/20 text-[#4ecdc4]' : 'bg-red-500/20 text-red-400'
                )}>
                  {result.diagonalizable ? '可对角化' : '不可对角化'}
                </div>

                {result.diagonalizable && result.P && result.D && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">P 矩阵</div>
                      <MathRenderer
                        math={`P = \\begin{pmatrix} ${result.P.map(r => r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                        displayMode
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">D 矩阵 (对角阵)</div>
                      <MathRenderer
                        math={`D = \\begin{pmatrix} ${result.D.map(r => r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                        displayMode
                      />
                    </div>
                    <div className="text-sm text-gray-400 text-center">
                      P⁻¹AP = D
                    </div>
                  </div>
                )}
              </motion.div>

              <StepDisplay steps={result.steps} />
            </>
          )}
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="similar-diagonal" />
      )}

      <KnowledgeBridge mode="next" stepId="similar-diagonal" />

      <div className="flex justify-end">
        <button onClick={() => completeStep('similar-diagonal')} className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all duration-300',
          completed ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] border border-[#4ecdc4]/40' : 'bg-[#e2b04a]/10 text-[#e2b04a] border border-[#e2b04a]/30 hover:bg-[#e2b04a]/20'
        )}>
          {completed ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </motion.div>
  )
}
