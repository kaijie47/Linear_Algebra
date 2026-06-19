import type { Matrix, EquationSolveResult } from '@/types';
import { isZero, cloneMatrix, createMatrix } from './matrix';

function toAugmentedMatrix(coeff: Matrix, constants: number[]): Matrix {
  return coeff.map((row, i) => [...row, constants[i]]);
}

function backSubstitute(rref: Matrix): number[] | null {
  const rows = rref.length;
  const cols = rref[0].length;
  const n = cols - 1;
  const solution: number[] = new Array(n).fill(0);
  const usedRows: boolean[] = new Array(rows).fill(false);

  for (let col = 0; col < n; col++) {
    for (let row = 0; row < rows; row++) {
      if (usedRows[row]) continue;
      if (!isZero(rref[row][col])) {
        usedRows[row] = true;
        solution[col] = rref[row][cols - 1];
        for (let c = col + 1; c < n; c++) {
          solution[col] -= rref[row][c] * solution[c];
        }
        break;
      }
    }
  }
  return solution;
}

function hasNoSolution(rref: Matrix): boolean {
  return rref.some(row => {
    const varPart = row.slice(0, -1);
    const rhs = row[row.length - 1];
    return varPart.every(v => isZero(v)) && !isZero(rhs);
  });
}

function countPivots(rref: Matrix): number {
  const rows = rref.length;
  const cols = rref[0].length - 1;
  let pivots = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!isZero(rref[row][col])) {
        pivots++;
        break;
      }
    }
  }
  return pivots;
}

function findFreeVariables(rref: Matrix): number[] {
  const rows = rref.length;
  const cols = rref[0].length - 1;
  const pivotCols: boolean[] = new Array(cols).fill(false);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!isZero(rref[row][col])) {
        pivotCols[col] = true;
        break;
      }
    }
  }
  const free: number[] = [];
  for (let j = 0; j < cols; j++) {
    if (!pivotCols[j]) free.push(j);
  }
  return free;
}

function findBasisSolutions(rref: Matrix): Matrix {
  const rows = rref.length;
  const cols = rref[0].length - 1;
  const pivotCols: number[] = [];
  const pivotRows: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!isZero(rref[row][col])) {
        pivotCols.push(col);
        pivotRows.push(row);
        break;
      }
    }
  }
  const freeVars = findFreeVariables(rref);
  const basis: Matrix = [];

  for (const freeIdx of freeVars) {
    const vec = new Array(cols).fill(0);
    vec[freeIdx] = 1;
    for (let p = 0; p < pivotCols.length; p++) {
      const pivCol = pivotCols[p];
      const pivRow = pivotRows[p];
      vec[pivCol] = -rref[pivRow][freeIdx];
    }
    basis.push(vec);
  }
  return basis;
}

function gaussianEliminateSimple(A: Matrix): Matrix {
  const m = cloneMatrix(A);
  const rows = m.length;
  const cols = m[0].length;
  let currentRow = 0;

  for (let col = 0; col < cols - 1 && currentRow < rows; col++) {
    let pivotRow = currentRow;
    let maxVal = Math.abs(m[currentRow][col]);
    for (let r = currentRow + 1; r < rows; r++) {
      if (Math.abs(m[r][col]) > maxVal) {
        maxVal = Math.abs(m[r][col]);
        pivotRow = r;
      }
    }
    if (isZero(m[pivotRow][col])) continue;

    if (pivotRow !== currentRow) {
      [m[currentRow], m[pivotRow]] = [m[pivotRow], m[currentRow]];
    }

    const pivot = m[currentRow][col];
    for (let j = col; j < cols; j++) {
      m[currentRow][j] /= pivot;
    }

    for (let r = 0; r < rows; r++) {
      if (r === currentRow) continue;
      const factor = m[r][col];
      if (isZero(factor)) continue;
      for (let j = col; j < cols; j++) {
        m[r][j] -= factor * m[currentRow][j];
      }
    }
    currentRow++;
  }
  return m;
}

export function solveEquations(
  coefficients: Matrix,
  constants: number[]
): EquationSolveResult {
  const steps: string[] = [];
  steps.push('构造增广矩阵');
  const augmented = toAugmentedMatrix(coefficients, constants);
  steps.push('进行高斯-若尔当消元');
  const rref = gaussianEliminateSimple(augmented);
  steps.push('消元完成，分析解的情况');

  if (hasNoSolution(rref)) {
    steps.push('出现矛盾行: 0 = k (k ≠ 0)，方程组无解');
    return { type: 'none', steps };
  }

  const n = coefficients[0].length;
  const pivotCount = countPivots(rref);

  if (pivotCount === n) {
    const solution = backSubstitute(rref)!;
    steps.push(`系数矩阵满秩，有唯一解: [${solution.map(v => v.toFixed(4)).join(', ')}]`);
    return { type: 'unique', solution, steps };
  }

  const basis = findBasisSolutions(rref);
  const freeCount = n - pivotCount;
  steps.push(`秩为 ${pivotCount}，自由变量 ${freeCount} 个，有无穷多解`);
  const basisStr = basis.map(v => `[${v.map(x => x.toFixed(4)).join(', ')}]ᵀ`).join(', ');
  steps.push(`基础解系: ${basisStr}`);

  return {
    type: 'infinite',
    basisSolutions: basis,
    generalSolution: `通解含 ${freeCount} 个自由参数`,
    steps,
  };
}

export function solveHomogeneous(A: Matrix): {
  basisSolutions: Matrix;
  steps: string[];
} {
  const steps: string[] = [];
  const m = A.length;
  const n = A[0].length;
  steps.push(`求解 ${m}×${n} 齐次线性方程组 Ax = 0`);

  const constants = new Array(m).fill(0);
  const augmented = toAugmentedMatrix(A, constants);
  const rref = gaussianEliminateSimple(augmented);

  const basis = findBasisSolutions(rref);
  if (basis.length === 0) {
    steps.push('只有零解');
  } else {
    steps.push(`基础解系含 ${basis.length} 个向量`);
  }
  return { basisSolutions: basis, steps };
}
