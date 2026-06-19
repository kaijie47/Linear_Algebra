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
import { isZero, cloneMatrix, identityMatrix } from '@/engine/matrix'

function calculateEigen(A: Matrix): {
  eigenvalues: number[]
  eigenvectors: Matrix[]
  characteristicPolynomial: string
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const n = A.length

  steps.push({
    title: '输入矩阵',
    math: `A = \\begin{pmatrix} ${A.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `${n}×${n} 方阵`,
  })

  if (n === 1) {
    steps.push({ title: '特征方程', math: `|A - \\lambda I| = ${A[0][0]} - \\lambda = 0`, description: '一阶矩阵特征值等于该元素' })
    return {
      eigenvalues: [A[0][0]],
      eigenvectors: [[[1]]],
      characteristicPolynomial: `${A[0][0]} - λ = 0`,
      steps,
    }
  }

  if (n === 2) {
    const a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1]
    const trace = a + d
    const det = a * d - b * c
    const discriminant = trace * trace - 4 * det

    let poly = `|A - \\lambda I| = \\begin{vmatrix} ${a} - \\lambda & ${b} \\\\\\\\ ${c} & ${d} - \\lambda \\end{vmatrix}`
    poly += ` = \\lambda^2 - ${trace}\\lambda + ${det} = 0`
    steps.push({ title: '特征多项式', math: poly, description: '计算 |A − λI| 得到特征多项式' })

    steps.push({ title: '求解特征方程', math: `\\lambda^2 - ${trace}\\lambda + ${det} = 0`, description: `判别式 Δ = ${discriminant.toFixed(4)}` })

    if (discriminant >= 0) {
      const sqrtD = Math.sqrt(Math.max(0, discriminant))
      const lambda1 = (trace + sqrtD) / 2
      const lambda2 = (trace - sqrtD) / 2

      const ev1 = getEigenvector(A, lambda1)
      const ev2 = getEigenvector(A, lambda2)

      steps.push({ title: '特征值', math: `\\lambda_1 = ${lambda1.toFixed(4)}, \\quad \\lambda_2 = ${lambda2.toFixed(4)}` })

      if (ev1.length > 0) {
        steps.push({ title: `特征向量 (λ₁ = ${lambda1.toFixed(4)})`, math: `v_1 = \\begin{pmatrix} ${ev1.join(' \\\\\\\\ ')} \\end{pmatrix}` })
      }
      if (ev2.length > 0 && Math.abs(lambda1 - lambda2) > 1e-6) {
        steps.push({ title: `特征向量 (λ₂ = ${lambda2.toFixed(4)})`, math: `v_2 = \\begin{pmatrix} ${ev2.join(' \\\\\\\\ ')} \\end{pmatrix}` })
      }

      return {
        eigenvalues: [lambda1, lambda2],
        eigenvectors: [ev1.map((v) => [v]), ev2.map((v) => [v])],
        characteristicPolynomial: poly,
        steps,
      }
    } else {
      steps.push({
        title: '特征值',
        math: `\\lambda_1 = \\frac{${trace} + i\\sqrt{${(-discriminant).toFixed(4)}}}{2}, \\quad \\lambda_2 = \\frac{${trace} - i\\sqrt{${(-discriminant).toFixed(4)}}}{2}`,
        description: '复特征值（共轭对）',
      })
      return { eigenvalues: [], eigenvectors: [], characteristicPolynomial: poly, steps }
    }
  }

  steps.push({ title: '提示', math: '', description: '3阶及以上矩阵的特征值计算请使用数值方法或以 2阶/1阶 方阵为例学习' })

  return { eigenvalues: [], eigenvectors: [], characteristicPolynomial: '', steps }
}

function getEigenvector(A: Matrix, lambda: number): number[] {
  const n = A.length
  if (n === 2) {
    const a00 = A[0][0] - lambda
    const a01 = A[0][1]
    const a10 = A[1][0]
    const a11 = A[1][1] - lambda

    if (!isZero(a01)) {
      return [1, -a00 / a01]
    } else if (!isZero(a11)) {
      return [-a01 / a11, 1]
    } else if (!isZero(a00) || !isZero(a10)) {
      return [1, 0]
    }
    return [1, 0]
  }
  return []
}

export default function EigenPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrix, setMatrix] = useState<Matrix>([
    [4, 1],
    [2, 3],
  ])
  const [result, setResult] = useState<{
    eigenvalues: number[]
    eigenvectors: Matrix[]
    characteristicPolynomial: string
    steps: CalculationStep[]
  } | null>(null)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('eigen')

  const handleCalculate = () => {
    setResult(calculateEigen(matrix))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#e2b04a]/20 text-[#e2b04a]">第6步</span>
          <h1 className="text-3xl font-bold text-gold">特征方程与特征向量</h1>
        </div>
        <p className="text-gray-400">计算特征值与特征向量，理解矩阵的本质特性</p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="eigen" />

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
            计算特征值
          </button>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              {result.characteristicPolynomial && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl border border-white/10 p-4">
                  <MathRenderer math={result.characteristicPolynomial} displayMode />
                </motion.div>
              )}

              {result.eigenvalues.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl border border-[#4ecdc4]/40 p-6 space-y-4">
                  <h3 className="text-sm text-gray-400">特征值</h3>
                  <div className="space-y-3">
                    {result.eigenvalues.map((lambda, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <MathRenderer math={`\\lambda_{${i + 1}} = ${lambda.toFixed(4)}`} displayMode />
                      </div>
                    ))}
                  </div>

                  {result.eigenvectors.length > 0 && (
                    <>
                      <h3 className="text-sm text-gray-400 pt-2">特征向量</h3>
                      {result.eigenvectors.map((vec, i) => (
                        vec.length > 0 && (
                          <div key={i} className="bg-[#0f3460]/30 rounded-lg p-4">
                            <div className="text-xs text-gray-500 mb-2">λ_{i + 1} = {result.eigenvalues[i]?.toFixed(4)}</div>
                            <MathRenderer
                              math={`v_{${i + 1}} = \\begin{pmatrix} ${vec.map(row => Number.isInteger(row[0]) ? row[0] : row[0].toFixed(4)).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                              displayMode
                            />
                          </div>
                        )
                      ))}
                    </>
                  )}
                </motion.div>
              )}

              <StepDisplay steps={result.steps} />
            </>
          )}
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="eigen" />
      )}

      <KnowledgeBridge mode="next" stepId="eigen" />

      <div className="flex justify-end">
        <button onClick={() => completeStep('eigen')} className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all duration-300',
          completed ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] border border-[#4ecdc4]/40' : 'bg-[#e2b04a]/10 text-[#e2b04a] border border-[#e2b04a]/30 hover:bg-[#e2b04a]/20'
        )}>
          {completed ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </motion.div>
  )
}
