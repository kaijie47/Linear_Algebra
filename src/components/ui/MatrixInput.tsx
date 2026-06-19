import { useCallback, useRef, type KeyboardEvent } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Matrix } from '@/types'

interface MatrixInputProps {
  matrix: Matrix
  onChange: (matrix: Matrix) => void
  minSize?: number
  maxSize?: number
  label?: string
  readOnly?: boolean
  fixedSize?: boolean
}

export default function MatrixInput({
  matrix,
  onChange,
  minSize = 1,
  maxSize = 6,
  label,
  readOnly = false,
  fixedSize = false,
}: MatrixInputProps) {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 1
  const cellRefs = useRef<(HTMLInputElement | null)[][]>([])

  const handleCellChange = useCallback(
    (r: number, c: number, raw: string) => {
      const cleaned = raw.replace(/[^0-9.\-e]/g, '')
      const num = cleaned === '' || cleaned === '-' ? 0 : Number(cleaned)
      const next = matrix.map((row, ri) =>
        ri === r ? row.map((val, ci) => (ci === c ? (isNaN(num) ? 0 : num) : val)) : [...row],
      )
      onChange(next)
    },
    [matrix, onChange],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
      const moveFocus = (nr: number, nc: number) => {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          cellRefs.current[nr]?.[nc]?.focus()
        }
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        moveFocus(r, Math.min(c + 1, cols - 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        moveFocus(r, Math.max(c - 1, 0))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveFocus(Math.min(r + 1, rows - 1), c)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveFocus(Math.max(r - 1, 0), c)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) {
          if (c > 0) moveFocus(r, c - 1)
          else if (r > 0) moveFocus(r - 1, cols - 1)
        } else {
          if (c < cols - 1) moveFocus(r, c + 1)
          else if (r < rows - 1) moveFocus(r + 1, 0)
        }
      }
    },
    [rows, cols],
  )

  const addRow = () => {
    if (rows >= maxSize) return
    const newRow = Array(cols).fill(0)
    onChange([...matrix, newRow])
  }

  const removeRow = () => {
    if (rows <= minSize) return
    onChange(matrix.slice(0, -1))
  }

  const addCol = () => {
    if (cols >= maxSize) return
    onChange(matrix.map((row) => [...row, 0]))
  }

  const removeCol = () => {
    if (cols <= minSize) return
    onChange(matrix.map((row) => row.slice(0, -1)))
  }

  if (!cellRefs.current.length || cellRefs.current.length !== rows) {
    cellRefs.current = Array.from({ length: rows }, () => Array(cols).fill(null))
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <p className="text-sm font-medium text-[#e2b04a] font-['Crimson_Text']">{label}</p>
      )}

      {!readOnly && !fixedSize && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#e0d8c8]/50 mr-1">行</span>
            <button
              type="button"
              onClick={removeRow}
              disabled={rows <= minSize}
              className="p-1 rounded bg-[#16213e] border border-[#e2b04a]/20 text-[#e0d8c8]/60 hover:text-[#e2b04a] hover:border-[#e2b04a]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs text-[#e0d8c8] w-4 text-center">{rows}</span>
            <button
              type="button"
              onClick={addRow}
              disabled={rows >= maxSize}
              className="p-1 rounded bg-[#16213e] border border-[#e2b04a]/20 text-[#e0d8c8]/60 hover:text-[#e2b04a] hover:border-[#e2b04a]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#e0d8c8]/50 mr-1">列</span>
            <button
              type="button"
              onClick={removeCol}
              disabled={cols <= minSize}
              className="p-1 rounded bg-[#16213e] border border-[#e2b04a]/20 text-[#e0d8c8]/60 hover:text-[#e2b04a] hover:border-[#e2b04a]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs text-[#e0d8c8] w-4 text-center">{cols}</span>
            <button
              type="button"
              onClick={addCol}
              disabled={cols >= maxSize}
              className="p-1 rounded bg-[#16213e] border border-[#e2b04a]/20 text-[#e0d8c8]/60 hover:text-[#e2b04a] hover:border-[#e2b04a]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 text-3xl text-[#e2b04a]/40 font-['Crimson_Text']">
          (
        </div>
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 text-3xl text-[#e2b04a]/40 font-['Crimson_Text']">
          )
        </div>

        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => (
              <input
                key={`${r}-${c}`}
                ref={(el) => {
                  if (!cellRefs.current[r]) cellRefs.current[r] = []
                  cellRefs.current[r][c] = el
                }}
                type="text"
                inputMode="decimal"
                value={matrix[r]?.[c] ?? 0}
                onChange={(e) => handleCellChange(r, c, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                readOnly={readOnly}
                className={cn(
                  'w-16 h-10 rounded text-center text-sm',
                  'bg-[#16213e] border border-[#e2b04a]/30',
                  'text-[#e0d8c8] placeholder-[#e0d8c8]/20',
                  'focus:outline-none focus:border-[#e2b04a] focus:shadow-[0_0_8px_rgba(226,176,74,0.3)]',
                  'transition-all duration-150',
                  readOnly && 'cursor-default opacity-80',
                )}
              />
            )),
          )}
        </div>
      </div>
    </div>
  )
}
