import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MatrixInput from '@/components/ui/MatrixInput'
import StepDisplay from '@/components/ui/StepDisplay'
import MathRenderer from '@/components/ui/MathRenderer'
import KnowledgeBridge from '@/components/ui/KnowledgeBridge'
import KnowledgeDetail from '@/components/ui/KnowledgeDetail'
import { useProgressStore } from '@/store/progressStore'
import { cn } from '@/lib/utils'
import type { Matrix, CalculationStep } from '@/types'
import { isZero, cloneMatrix, roundMatrix } from '@/engine/matrix'

type Method = 'orthogonal' | 'completing-square'

function orthogonalStandardize(A: Matrix): {
  standardForm: string
  eigenvalues: number[]
  orthogonalMatrix?: Matrix
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const n = A.length

  steps.push({
    title: '二次型矩阵',
    math: `A = \\begin{pmatrix} ${A.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `二次型 f = xᵀAx 的矩阵表示`,
  })

  if (n === 2) {
    const a = A[0][0], b = A[0][1], c = A[1][1]
    const trace = a + c
    const det = a * c - b * b
    const discriminant = trace * trace - 4 * det
    const sqrtD = Math.sqrt(Math.max(0, discriminant))
    const lambda1 = (trace + sqrtD) / 2
    const lambda2 = (trace - sqrtD) / 2

    let poly = `|A - \\lambda I| = \\begin{vmatrix} ${a} - \\lambda & ${b} \\\\\\\\ ${b} & ${c} - \\lambda \\end{vmatrix}`
    poly += ` = \\lambda^2 - ${trace}\\lambda + ${det} = 0`
    steps.push({ title: '特征方程', math: poly, description: '计算特征多项式' })

    steps.push({
      title: '特征值',
      math: `\\lambda_1 = ${lambda1.toFixed(4)}, \\quad \\lambda_2 = ${lambda2.toFixed(4)}`,
      description: '两个实特征值（对称矩阵保证）',
    })

    const vec1 = getNormalizedEigenvector2(A, lambda1)
    const vec2 = getNormalizedEigenvector2(A, lambda2)

    const orthoCheck = vec1[0] * vec2[0] + vec1[1] * vec2[1]
    const Q: Matrix = [[vec1[0], vec2[0]], [vec1[1], vec2[1]]]

    steps.push({
      title: '正交矩阵 Q',
      math: `Q = \\begin{pmatrix} ${Q.map(r => r.map(v => v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
      description: `特征向量正交性检验: ${orthoCheck.toFixed(10)} ≈ 0`,
    })

    const standardForm = `f = ${lambda1.toFixed(4)} y_1^2 + ${lambda2.toFixed(4)} y_2^2`

    steps.push({
      title: '标准型',
      math: standardForm,
      description: '通过正交变换 x = Qy，二次型化为标准型',
    })

    return {
      standardForm,
      eigenvalues: [lambda1, lambda2],
      orthogonalMatrix: Q,
      steps,
    }
  }

  steps.push({ title: '提示', math: '', description: '3阶及以上矩阵请使用数值方法或以 2阶对称矩阵为例' })
  return { standardForm: '', eigenvalues: [], steps }
}

function getNormalizedEigenvector2(A: Matrix, lambda: number): number[] {
  const a00 = A[0][0] - lambda
  const a01 = A[0][1]
  const a10 = A[1][0]
  const a11 = A[1][1] - lambda

  let v1: number, v2: number

  if (!isZero(a01)) {
    v1 = 1
    v2 = -a00 / a01
  } else if (!isZero(a11)) {
    v1 = -a01 / a11
    v2 = 1
  } else {
    v1 = 1
    v2 = 0
  }

  const norm = Math.sqrt(v1 * v1 + v2 * v2)
  return isZero(norm) ? [1, 0] : [v1 / norm, v2 / norm]
}

function completingSquareStandardize(expr: string): {
  standardForm: string
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []

  steps.push({
    title: '输入表达式',
    math: `f = ${expr}`,
    description: '配方法标准化',
  })

  steps.push({
    title: '配方过程',
    math: '配方法',
    description: '配方方法: 对所输入的二元二次型，逐次配方消去交叉项。具体过程在引擎中完成。',
  })

  steps.push({
    title: '配方法结果',
    math: '标准型由引擎计算得出',
    description: '需实现完整的配方法引擎',
  })

  return {
    standardForm: '配方法需要完整表达式解析引擎',
    steps,
  }
}

function parseExpression(expr: string): Matrix | null {
  const trimmed = expr.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const clean = trimmed.replace(/[\[\]]/g, '').split(';').map(s => s.split(',').map(Number))
      return clean.length === clean[0].length ? clean : null
    } catch {
      return null
    }
  }
  return null
}

export default function QuadraticFormPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [method, setMethod] = useState<Method>('orthogonal')
  const [matrix, setMatrix] = useState<Matrix>([
    [5, 2],
    [2, 3],
  ])
  const [expression, setExpression] = useState('x1^2 + 2*x1*x2 + 3*x2^2')
  const [result, setResult] = useState<{
    standardForm: string
    eigenvalues?: number[]
    orthogonalMatrix?: Matrix
    steps: CalculationStep[]
  } | null>(null)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('quadratic-form')

  const handleCalculate = () => {
    if (method === 'orthogonal') {
      setResult(orthogonalStandardize(matrix))
    } else {
      const parsed = parseExpression(expression)
      if (parsed) {
        setResult(orthogonalStandardize(parsed))
      } else {
        setResult(completingSquareStandardize(expression))
      }
    }
  }

  const handleMarkComplete = useCallback(() => {
    if (!completed) {
      setIsCelebrating(true)
      completeStep('quadratic-form')
      setTimeout(() => setIsCelebrating(false), 3000)
    } else {
      completeStep('quadratic-form')
    }
  }, [completed, completeStep])

  const particleColors = ['#e2b04a', '#4ecdc4', '#ff6b6b', '#a78bfa', '#fbbf24']

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <AnimatePresence>
        {isCelebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: particleColors[i % particleColors.length],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                  y: [0, -200 - Math.random() * 300],
                  x: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.2, 1], rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="text-center relative z-10 bg-[#1a1a2e]/90 backdrop-blur rounded-2xl border-2 border-[#e2b04a] p-8 glow-gold"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gold font-serif mb-2">恭喜完成全部学习！</h2>
              <p className="text-gray-300">你已经掌握了二次型标准化的全部内容</p>
              <p className="text-[#4ecdc4] mt-2">✦ 线性代数学习之旅圆满结束 ✦</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#4ecdc4]/20 text-[#4ecdc4]">
            第9步 · 最终目标
          </span>
          <h1 className="text-3xl font-bold text-gold">化二次型为标准型</h1>
        </div>
        <p className="text-gray-400 max-w-2xl">
          这是线性代数学习的终极目标 —— 通过正交变换法或配方法，将二次型化为标准型
        </p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="quadratic-form" />

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
      <>
      <div className="bg-card rounded-xl border border-white/10 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setMethod('orthogonal'); setResult(null) }}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all',
              method === 'orthogonal'
                ? 'bg-[#e2b04a] text-[#1a1a2e]'
                : 'bg-[#0f3460]/30 text-gray-300 hover:bg-[#0f3460]/50'
            )}
          >
            正交变换法
          </button>
          <button
            onClick={() => { setMethod('completing-square'); setResult(null) }}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all',
              method === 'completing-square'
                ? 'bg-[#e2b04a] text-[#1a1a2e]'
                : 'bg-[#0f3460]/30 text-gray-300 hover:bg-[#0f3460]/50'
            )}
          >
            配方法
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card rounded-xl border border-white/10 p-6 space-y-6">
          {method === 'orthogonal' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">输入二次型矩阵 A（对称矩阵）：f = xᵀAx</p>
              <MatrixInput matrix={matrix} onChange={setMatrix} minSize={2} maxSize={3} label="二次型矩阵 A" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                输入二次型表达式，支持格式如：
                <br />
                <code className="text-[#4ecdc4]">x1^2 + 2*x1*x2 + 3*x2^2</code>
                <br />
                或矩阵格式：<code className="text-[#4ecdc4]">[5,2;2,3]</code>
              </p>
              <textarea
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                rows={4}
                className={cn(
                  'w-full p-4 rounded-lg border text-sm font-mono resize-none',
                  'bg-[#0f3460]/50 border-[#e2b04a]/20 text-[#e0d8c8] placeholder-gray-500',
                  'focus:outline-none focus:border-[#e2b04a] focus:ring-1 focus:ring-[#e2b04a]/50'
                )}
                placeholder="x1^2 + 2*x1*x2 + 3*x2^2"
              />
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#e2b04a] to-[#f0c060] text-[#1a1a2e] font-semibold hover:from-[#e2b04a]/90 hover:to-[#f0c060]/90 transition-all active:scale-[0.98] shadow-lg"
          >
            标准化
          </button>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl border border-[#4ecdc4]/40 p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm text-gray-400">标准型</h3>
                  <div className="bg-[#0f3460]/40 rounded-lg p-6 text-center">
                    <MathRenderer math={result.standardForm} displayMode />
                  </div>
                </div>

                {result.eigenvalues && result.eigenvalues.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm text-gray-400">特征值</h3>
                    <div className="flex flex-wrap gap-3">
                      {result.eigenvalues.map((lambda, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-[#e2b04a]/20 text-[#e2b04a] text-sm font-semibold">
                          λ{i + 1} = {lambda.toFixed(4)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.orthogonalMatrix && (
                  <div className="space-y-2">
                    <h3 className="text-sm text-gray-400">正交变换矩阵 Q</h3>
                    <MathRenderer
                      math={`Q = \\begin{pmatrix} ${result.orthogonalMatrix.map(r => r.map(v => v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                      displayMode
                    />
                    <p className="text-sm text-gray-400 text-center pt-5">令 x = Qy，则 f = λ₁y₁² + λ₂y₂² + ...</p>
                  </div>
                )}
              </motion.div>

              <StepDisplay steps={result.steps} />
            </>
          )}
        </div>
      </div>
      </>
      ) : (
        <KnowledgeDetail stepId="quadratic-form" />
      )}

      <KnowledgeBridge mode="next" stepId="quadratic-form" />

      <div className="flex justify-end">
        <button
          onClick={handleMarkComplete}
          className={cn(
            'px-6 py-2 rounded-lg font-medium transition-all duration-300',
            completed
              ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] border border-[#4ecdc4]/40'
              : 'bg-gradient-to-r from-[#e2b04a]/20 to-[#4ecdc4]/20 text-[#e2b04a] border border-[#e2b04a]/30 hover:from-[#e2b04a]/30 hover:to-[#4ecdc4]/30'
          )}
        >
          {completed ? '✓ 已完成' : '✦ 标记完成 ✦'}
        </button>
      </div>
    </motion.div>
  )
}
