import type { Matrix, DiagonalizationResult } from '@/types';
import {
  isZero,
  cloneMatrix,
  createMatrix,
  identityMatrix,
  matrixMultiply,
  inverse,
  transpose,
} from './matrix';
import { eigen } from './eigen';

function algebraicMultiplicity(eigenvalues: number[], val: number): number {
  return eigenvalues.filter(v => Math.abs(v - val) < 1e-8).length;
}

function geometricMultiplicity(A: Matrix, lambda: number): number {
  const n = A.length;
  const B = cloneMatrix(A);
  for (let i = 0; i < n; i++) B[i][i] -= lambda;

  let rank = 0;
  const m = cloneMatrix(B);
  const rows = m.length;
  const cols = m[0].length;
  let currentRow = 0;

  for (let col = 0; col < cols && currentRow < rows; col++) {
    let pivotRow = currentRow;
    let maxVal = Math.abs(m[currentRow][col]);
    for (let r = currentRow + 1; r < rows; r++) {
      if (Math.abs(m[r][col]) > maxVal) {
        maxVal = Math.abs(m[r][col]);
        pivotRow = r;
      }
    }
    if (isZero(maxVal)) continue;
    if (pivotRow !== currentRow) {
      [m[currentRow], m[pivotRow]] = [m[pivotRow], m[currentRow]];
    }
    for (let r = currentRow + 1; r < rows; r++) {
      if (isZero(m[r][col])) continue;
      const factor = m[r][col] / m[currentRow][col];
      for (let j = col; j < cols; j++) m[r][j] -= factor * m[currentRow][j];
    }
    currentRow++;
  }

  for (let i = 0; i < rows; i++) {
    if (m[i].some(v => !isZero(v))) rank++;
  }

  return n - rank;
}

function isSymmetric(A: Matrix): boolean {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!isZero(A[i][j] - A[j][i])) return false;
    }
  }
  return true;
}

export function isDiagonalizable(A: Matrix): boolean {
  const n = A.length;
  if (n === 0 || A[0].length !== n) return false;
  if (n > 4) return isSymmetric(A);

  const { eigenvalues } = eigen(A);
  const uniqueEigenvals = Array.from(new Set(eigenvalues.map(v => Math.round(v * 1e8) / 1e8)));

  for (const val of uniqueEigenvals) {
    const algMult = algebraicMultiplicity(eigenvalues, val);
    const geoMult = geometricMultiplicity(A, val);
    if (geoMult < algMult) return false;
  }
  return true;
}

export function similarDiagonalize(A: Matrix): DiagonalizationResult {
  const n = A.length;
  const steps: string[] = [];
  if (n === 0 || A[0].length !== n) {
    return { diagonalizable: false, steps: ['矩阵不是方阵'] };
  }

  steps.push(`对 ${n}×${n} 矩阵进行相似对角化分析`);
  const { eigenvalues, eigenvectors } = eigen(A);

  if (!isDiagonalizable(A)) {
    steps.push('矩阵不可对角化（存在 λ 的几何重数 < 代数重数）');
    return { diagonalizable: false, steps };
  }

  steps.push(`特征值: ${eigenvalues.map(v => v.toFixed(4)).join(', ')}`);

  const P: Matrix = [];
  for (const colMat of eigenvectors) {
    P.push(colMat.map(row => row[0]));
  }
  const PT = transpose(P);

  const D = createMatrix(n, n, 0);
  for (let i = 0; i < eigenvalues.length; i++) {
    D[i][i] = eigenvalues[i];
  }

  steps.push('构造 P = [v₁ v₂ ... vₙ]（特征向量矩阵）');
  steps.push(`构造对角阵 D = diag(${eigenvalues.map(v => v.toFixed(4)).join(', ')})`);
  steps.push('满足 P⁻¹AP = D');

  return { diagonalizable: true, P: PT, D, steps };
}

function gramSchmidt(vectors: Matrix): Matrix {
  const result: Matrix = [];
  for (const v of vectors) {
    let w = [...v];
    for (const u of result) {
      let dot = 0;
      let norm2 = 0;
      for (let i = 0; i < u.length; i++) {
        dot += w[i] * u[i];
        norm2 += u[i] * u[i];
      }
      if (!isZero(norm2)) {
        for (let i = 0; i < w.length; i++) w[i] -= (dot / norm2) * u[i];
      }
    }
    let norm = 0;
    for (const x of w) norm += x * x;
    norm = Math.sqrt(norm);
    if (!isZero(norm)) result.push(w.map(x => x / norm));
  }
  return result;
}

export function contractDiagonalize(A: Matrix): DiagonalizationResult {
  const n = A.length;
  const steps: string[] = [];
  if (n === 0 || A[0].length !== n) {
    return { diagonalizable: false, steps: ['矩阵不是方阵'] };
  }

  if (!isSymmetric(A)) {
    steps.push('矩阵不是对称矩阵，无法进行合同对角化');
    return { diagonalizable: false, steps };
  }

  steps.push(`对 ${n}×${n} 实对称矩阵进行合同对角化`);
  const { eigenvalues, eigenvectors } = eigen(A);

  const flatVecs: number[][] = eigenvectors.map(colMat => colMat.map(row => row[0]));
  const orthoBasis = gramSchmidt(flatVecs);
  steps.push('对特征向量进行 Gram-Schmidt 正交化');

  const P: Matrix = [];
  for (const v of orthoBasis) {
    P.push([...v]);
  }
  const PT_T = transpose(P);

  const D = createMatrix(n, n, 0);
  for (let i = 0; i < eigenvalues.length; i++) {
    D[i][i] = eigenvalues[i];
  }

  steps.push('构造正交矩阵 Q（PᵀP = I）');
  steps.push(`对角阵: diag(${eigenvalues.map(v => v.toFixed(4)).join(', ')})`);
  steps.push('满足 PᵀAP = D');

  return { diagonalizable: true, P: PT_T, D, steps };
}
