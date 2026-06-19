import { useState } from 'react'
import { motion } from 'framer-motion'
import MatrixInput from '@/components/ui/MatrixInput'
import KnowledgeBridge from '@/components/ui/KnowledgeBridge'
import KnowledgeDetail from '@/components/ui/KnowledgeDetail'
import { useProgressStore } from '@/store/progressStore'
import { cn } from '@/lib/utils'
import type { Matrix } from '@/types'
import {
  matrixAdd,
  matrixSubtract,
  matrixMultiply,
  transpose,
  inverse,
  cloneMatrix,
} from '@/engine/matrix'

type Operation = 'add' | 'subtract' | 'multiply' | 'transpose' | 'inverse'

const operations: { value: Operation; label: string }[] = [
  { value: 'add', label: '加法 A + B' },
  { value: 'subtract', label: '减法 A − B' },
  { value: 'multiply', label: '乘法 A × B' },
  { value: 'transpose', label: '转置 Aᵀ' },
  { value: 'inverse', label: '求逆 A⁻¹' },
]

function MatrixDisplay({ matrix, label }: { matrix: Matrix; label?: string }) {
  if (matrix.length === 0) return null
  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium text-gray-300">{label}</div>}
      <div className="inline-flex border-l-2 border-r-2 border-[#e2b04a]/60 px-4 py-3">
        <div className="flex flex-col gap-1">
          {matrix.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((val, j) => (
                <span
                  key={j}
                  className="w-16 text-center text-sm text-[#e0d8c8] font-mono"
                >
                  {Number.isInteger(val) ? val : val.toFixed(4)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MatrixPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'knowledge'>('calculator')
  const [matrixA, setMatrixA] = useState<Matrix>([
    [1, 2],
    [3, 4],
  ])
  const [matrixB, setMatrixB] = useState<Matrix>([
    [5, 6],
    [7, 8],
  ])
  const [operation, setOperation] = useState<Operation>('add')
  const [result, setResult] = useState<Matrix | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { isStepCompleted, completeStep } = useProgressStore()
  const completed = isStepCompleted('matrix')

  const showB = operation === 'add' || operation === 'subtract' || operation === 'multiply'

  const handleCalculate = () => {
    setError(null)
    try {
      switch (operation) {
        case 'add':
          setResult(matrixAdd(cloneMatrix(matrixA), cloneMatrix(matrixB)))
          break
        case 'subtract':
          setResult(matrixSubtract(cloneMatrix(matrixA), cloneMatrix(matrixB)))
          break
        case 'multiply':
          setResult(matrixMultiply(cloneMatrix(matrixA), cloneMatrix(matrixB)))
          break
        case 'transpose':
          setResult(transpose(cloneMatrix(matrixA)))
          break
        case 'inverse':
          setResult(inverse(cloneMatrix(matrixA)))
          break
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '计算出错')
      setResult(null)
    }
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
            第3步
          </span>
          <h1 className="text-3xl font-bold text-gold">认识矩阵</h1>
        </div>
        <p className="text-gray-400">
          掌握矩阵的加法、减法、乘法、转置和求逆运算
        </p>
      </div>

      <KnowledgeBridge mode="prerequisite" stepId="matrix" />

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
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-white/10 p-6 space-y-6">
            <MatrixInput
              matrix={matrixA}
              onChange={setMatrixA}
              minSize={1}
              maxSize={4}
              label="矩阵 A"
              fixedSize={operation === 'inverse'}
            />

            {showB && (
              <MatrixInput
                matrix={matrixB}
                onChange={setMatrixB}
                minSize={1}
                maxSize={4}
                label="矩阵 B"
              />
            )}
          </div>

          <div className="bg-card rounded-xl border border-white/10 p-4">
            <div className="text-sm text-gray-400 mb-3">选择运算</div>
            <div className="flex flex-wrap gap-2">
              {operations.map((op) => (
                <button
                  key={op.value}
                  onClick={() => {
                    setOperation(op.value)
                    setResult(null)
                    setError(null)
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    operation === op.value
                      ? 'bg-[#e2b04a] text-[#1a1a2e]'
                      : 'bg-[#0f3460]/30 text-gray-300 hover:bg-[#0f3460]/50'
                  )}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-lg bg-[#e2b04a] text-[#1a1a2e] font-semibold hover:bg-[#e2b04a]/90 transition-colors active:scale-[0.98]"
          >
            计算
          </button>
        </div>

        <div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-xl border border-[#4ecdc4]/40 p-6"
            >
              <h3 className="text-sm text-gray-400 mb-4">计算结果</h3>
              <MatrixDisplay matrix={result} />
              <p className="mt-3 text-xs text-gray-500">
                {result.length} × {result[0]?.length ?? 0} 矩阵
              </p>
            </motion.div>
          )}
        </div>
      </div>
      ) : (
        <KnowledgeDetail stepId="matrix" />
      )}

      <KnowledgeBridge mode="next" stepId="matrix" />

      <div className="flex justify-end">
        <button
          onClick={() => completeStep('matrix')}
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
