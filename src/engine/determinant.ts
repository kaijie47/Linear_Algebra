import type { Matrix } from '@/types';
import { isZero, cloneMatrix } from './matrix';

export function determinant2x2(A: Matrix): number {
  if (A.length !== 2 || A[0].length !== 2) {
    throw new Error('determinant2x2 requires a 2×2 matrix');
  }
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

export function determinant3x3(A: Matrix): number {
  if (A.length !== 3 || A[0].length !== 3) {
    throw new Error('determinant3x3 requires a 3×3 matrix');
  }
  return (
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
  );
}

function getMinor(A: Matrix, row: number, col: number): Matrix {
  const n = A.length;
  const minor: Matrix = [];
  for (let i = 0; i < n; i++) {
    if (i === row) continue;
    const minorRow: number[] = [];
    for (let j = 0; j < n; j++) {
      if (j === col) continue;
      minorRow.push(A[i][j]);
    }
    minor.push(minorRow);
  }
  return minor;
}

export function determinantLaplace(
  A: Matrix,
  recordSteps: boolean = false
): { value: number; steps: string[] } {
  const steps: string[] = [];
  const n = A.length;
  if (n === 0) return { value: 0, steps };
  if (n !== A[0].length) {
    throw new Error('determinant requires a square matrix');
  }

  function compute(B: Matrix, rowLabel: string): number {
    const size = B.length;
    if (size === 1) return B[0][0];
    if (size === 2) {
      const det = B[0][0] * B[1][1] - B[0][1] * B[1][0];
      if (recordSteps) {
        steps.push(
          `${rowLabel} = ${B[0][0]}·${B[1][1]} - ${B[0][1]}·${B[1][0]} = ${det}`
        );
      }
      return det;
    }
    let det = 0;
    const expansionRow = 0;
    for (let j = 0; j < size; j++) {
      if (isZero(B[expansionRow][j])) continue;
      const minor = getMinor(B, expansionRow, j);
      const sign = (expansionRow + j) % 2 === 0 ? 1 : -1;
      const subDet = compute(minor, `det(M_{${expansionRow + 1},${j + 1}})`);
      const term = sign * B[expansionRow][j] * subDet;
      if (recordSteps) {
        steps.push(
          `按第${expansionRow + 1}行第${j + 1}列展开: (${sign >= 0 ? '+' : ''}${sign})·${B[expansionRow][j]}·${subDet} = ${term}`
        );
      }
      det += term;
    }
    return det;
  }

  if (recordSteps) {
    steps.push(`计算 ${n}×${n} 行列式，使用 Laplace 展开`);
  }
  const value = compute(A, 'det(A)');
  if (recordSteps) {
    steps.push(`行列式值 = ${value}`);
  }
  return { value, steps };
}

export function determinant(A: Matrix): number {
  const n = A.length;
  if (n === 0) return 0;
  if (n === 1) return A[0][0];
  if (n === 2) return determinant2x2(A);
  if (n === 3) return determinant3x3(A);
  return determinantLaplace(A).value;
}
