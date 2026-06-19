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

function contractDiagonalize(A: Matrix): {
  C: Matrix
  D: Matrix
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const n = A.length

  steps.push({
    title: '输入对称矩阵',
    math: `A = \\begin{pmatrix} ${A.map(r => r.join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `${n}×${n} 对称矩阵，通过合同变换化为对角阵`,
  })

  const mat = cloneMatrix(A)
  const C: Matrix = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0) as number)
  )

  for (let k = 0; k < n; k++) {
    if (isZero(mat[k][k])) {
      let found = false
      for (let i = k + 1; i < n; i++) {
        if (!isZero(mat[i][i])) {
          ;[mat[k], mat[i]] = [mat[i], mat[k]]
          for (let j = 0; j < n; j++) {
            ;[mat[j][k], mat[j][i]] = [mat[j][i], mat[j][k]]
          }
          ;[C[k], C[i]] = [C[i], C[k]]
          for (let j = 0; j < n; j++) {
            ;[C[j][k], C[j][i]] = [C[j][i], C[j][k]]
          }
          found = true
          steps.push({ title: `交换第 ${k + 1} 行/列与第 ${i + 1} 行/列`, math: '', description: '寻找非零主元' })
          break
        }
      }
      if (!found) {
        if (k < n - 1) {
          mat[k][k] = 1
          mat[k][k + 1] = 1
          mat[k + 1][k] = 1
          mat[k + 1][k + 1] = 1
          C[k] = C[k].map((_, j) => (j === k ? 1 : j === k + 1 ? 1 : 0) as number)
          C[k + 1] = C[k + 1].map((_, j) => (j === k ? -1 : j === k + 1 ? 1 : 0) as number)
          steps.push({ title: `处理 ${k + 1} 列零主元`, math: '', description: '使用特殊变换处理对角元为零的情况' })
        }
        continue
      }
    }

    const pivotVal = mat[k][k]
    for (let i = k + 1; i < n; i++) {
      if (!isZero(mat[i][k])) {
        const factor = mat[i][k] / pivotVal
        for (let j = k; j < n; j++) {
          mat[i][j] -= factor * mat[k][j]
        }
        for (let j = 0; j < n; j++) {
          mat[j][i] -= factor * mat[j][k]
        }
        for (let j = 0; j < n; j++) {
          C[j][i] -= factor * C[j][k]
        }
        mat[i] = roundMatrix([mat[i]])[0]
        mat.forEach((_r, ri) => { mat[ri][i] = mat[i][ri] })
        steps.push({
          title: `消元: R${i + 1} → R${i + 1} - ${factor.toFixed(2)} × R${k + 1}`,
          math: `\\begin{pmatrix} ${mat.map(r => r.map(v => v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
          description: `合同变换保对称性`,
        })
      }
    }
  }

  steps.push({
    title: '合同对角化完成',
    math: `C = \\begin{pmatrix} ${C.map(r => r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}, \\quad D = \\begin{pmatrix} ${mat.map(r => r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: 'CᵀAC = D，其中 D 为对角阵',
  })

  return { C: roundMatrix(C), D: roundMatrix(mat), steps }
}

export default function ContractDiagonalPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrix, setMatrix] = useState<Matrix>([
    [2, 1],
    [1, 2],
  ])
  const [result, setResult] = useState<{
    C: Matrix
    D: Matrix
    steps: CalculationStep[]
  } | null>(null)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('contract-diagonal')

  const handleCalculate = () => {
    setResult(contractDiagonalize(matrix))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#e2b04a]/20 text-[#e2b04a]">第8步</span>
          <h1 className="text-3xl font-bold text-gold">合同对角化</h1>
        </div>
        <p className="text-gray-400">对实对称矩阵进行合同变换，化为合同对角阵 CᵀAC = D</p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="contract-diagonal" />

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
          <MatrixInput matrix={matrix} onChange={setMatrix} minSize={2} maxSize={4} label="输入对称矩阵 A" />
          <p className="text-xs text-gray-500">请确保输入对称矩阵（A = Aᵀ）</p>
          <button onClick={handleCalculate} className="w-full py-3 rounded-lg bg-[#e2b04a] text-[#1a1a2e] font-semibold hover:bg-[#e2b04a]/90 transition-colors active:scale-[0.98]">
            合同对角化
          </button>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl border border-[#4ecdc4]/40 p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-400">变换矩阵 C</h3>
                  <MathRenderer
                    math={`C = \\begin{pmatrix} ${result.C.map(r => r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                    displayMode
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-400">对角阵 D</h3>
                  <MathRenderer
                    math={`D = \\begin{pmatrix} ${result.D.map(r => r.map(v => Number.isInteger(v) ? v : v.toFixed(4)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`}
                    displayMode
                  />
                </div>
                <p className="text-sm text-gray-300 text-center">CᵀAC = D</p>
              </motion.div>

              <StepDisplay steps={result.steps} />
            </>
          )}
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="contract-diagonal" />
      )}

      <KnowledgeBridge mode="next" stepId="contract-diagonal" />

      <div className="flex justify-end">
        <button onClick={() => completeStep('contract-diagonal')} className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all duration-300',
          completed ? 'bg-[#4ecdc4]/20 text-[#4ecdc4] border border-[#4ecdc4]/40' : 'bg-[#e2b04a]/10 text-[#e2b04a] border border-[#e2b04a]/30 hover:bg-[#e2b04a]/20'
        )}>
          {completed ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </motion.div>
  )
}
