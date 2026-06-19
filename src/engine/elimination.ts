import type { Matrix, EliminationStep } from '@/types';
import { isZero, cloneMatrix } from './matrix';

function swapRows(A: Matrix, r1: number, r2: number): void {
  const temp = A[r1];
  A[r1] = A[r2];
  A[r2] = temp;
}

function findPivotRow(A: Matrix, col: number, startRow: number): number {
  let maxRow = startRow;
  let maxVal = Math.abs(A[startRow][col]);
  for (let r = startRow + 1; r < A.length; r++) {
    if (Math.abs(A[r][col]) > maxVal) {
      maxVal = Math.abs(A[r][col]);
      maxRow = r;
    }
  }
  return maxRow;
}

export function gaussianElimination(A: Matrix): {
  matrix: Matrix;
  steps: EliminationStep[];
} {
  const m = cloneMatrix(A);
  const rows = m.length;
  const cols = m[0].length;
  const steps: EliminationStep[] = [];
  let currentRow = 0;

  steps.push({
    matrix: cloneMatrix(m),
    operation: '初始矩阵',
    description: `初始 ${rows}×${cols} 矩阵`,
  });

  for (let col = 0; col < cols && currentRow < rows; col++) {
    const pivotRow = findPivotRow(m, col, currentRow);
    if (isZero(m[pivotRow][col])) continue;

    if (pivotRow !== currentRow) {
      swapRows(m, currentRow, pivotRow);
      steps.push({
        matrix: cloneMatrix(m),
        operation: '行交换',
        description: `交换第${currentRow + 1}行和第${pivotRow + 1}行`,
      });
    }

    const pivot = m[currentRow][col];
    for (let j = col; j < cols; j++) {
      m[currentRow][j] /= pivot;
    }
    steps.push({
      matrix: cloneMatrix(m),
      operation: '归一化',
      description: `第${currentRow + 1}行除以 ${pivot}`,
    });

    for (let r = 0; r < rows; r++) {
      if (r === currentRow) continue;
      const factor = m[r][col];
      if (isZero(factor)) continue;
      for (let j = col; j < cols; j++) {
        m[r][j] -= factor * m[currentRow][j];
      }
      steps.push({
        matrix: cloneMatrix(m),
        operation: '消元',
        description: `第${r + 1}行减去 ${factor} × 第${currentRow + 1}行`,
      });
    }
    currentRow++;
  }

  return { matrix: m, steps };
}

export function toRowEchelonForm(A: Matrix): {
  matrix: Matrix;
  steps: EliminationStep[];
} {
  const m = cloneMatrix(A);
  const rows = m.length;
  const cols = m[0].length;
  const steps: EliminationStep[] = [];
  let currentRow = 0;

  steps.push({
    matrix: cloneMatrix(m),
    operation: '初始矩阵',
    description: `初始 ${rows}×${cols} 矩阵`,
  });

  for (let col = 0; col < cols && currentRow < rows; col++) {
    const pivotRow = findPivotRow(m, col, currentRow);
    if (isZero(m[pivotRow][col])) continue;

    if (pivotRow !== currentRow) {
      swapRows(m, currentRow, pivotRow);
      steps.push({
        matrix: cloneMatrix(m),
        operation: '行交换',
        description: `交换第${currentRow + 1}行和第${pivotRow + 1}行`,
      });
    }

    const pivot = m[currentRow][col];
    for (let r = currentRow + 1; r < rows; r++) {
      if (isZero(m[r][col])) continue;
      const factor = m[r][col] / pivot;
      for (let j = col; j < cols; j++) {
        m[r][j] -= factor * m[currentRow][j];
      }
      steps.push({
        matrix: cloneMatrix(m),
        operation: '消元',
        description: `第${r + 1}行减去 ${factor} × 第${currentRow + 1}行`,
      });
    }
    currentRow++;
  }

  return { matrix: m, steps };
}

export function rank(A: Matrix): {
  rank: number;
  steps: EliminationStep[];
} {
  const { matrix: echelon, steps } = toRowEchelonForm(A);
  let r = 0;
  for (let i = 0; i < echelon.length; i++) {
    const hasNonZero = echelon[i].some(v => !isZero(v));
    if (hasNonZero) r++;
  }
  steps.push({
    matrix: echelon,
    operation: '结果',
    description: `矩阵的秩为 ${r}`,
  });
  return { rank: r, steps };
}
