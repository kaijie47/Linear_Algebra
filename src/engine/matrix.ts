import type { Matrix } from '@/types';

const EPSILON = 1e-10;

export function isZero(value: number): boolean {
  return Math.abs(value) < EPSILON;
}

export function cloneMatrix(A: Matrix): Matrix {
  return A.map(row => [...row]);
}

export function createMatrix(rows: number, cols: number, defaultValue: number = 0): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(defaultValue));
}

export function identityMatrix(n: number): Matrix {
  const I = createMatrix(n, n, 0);
  for (let i = 0; i < n; i++) {
    I[i][i] = 1;
  }
  return I;
}

export function isSquare(A: Matrix): boolean {
  if (A.length === 0) return false;
  return A.length === A[0].length;
}

export function roundMatrix(A: Matrix, decimals: number = 10): Matrix {
  const factor = Math.pow(10, decimals);
  return A.map(row => row.map(v => Math.round(v * factor) / factor));
}

export function transpose(A: Matrix): Matrix {
  if (A.length === 0) return [];
  const rows = A.length;
  const cols = A[0].length;
  const result = createMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = A[i][j];
    }
  }
  return result;
}

export function matrixMultiply(A: Matrix, B: Matrix): Matrix {
  if (A.length === 0 || B.length === 0) {
    throw new Error('Cannot multiply empty matrices');
  }
  const aRows = A.length;
  const aCols = A[0].length;
  const bRows = B.length;
  const bCols = B[0].length;
  if (aCols !== bRows) {
    throw new Error(
      `Matrix dimensions mismatch: (${aRows}×${aCols}) * (${bRows}×${bCols})`
    );
  }
  const result = createMatrix(aRows, bCols, 0);
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      let sum = 0;
      for (let k = 0; k < aCols; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function scalarMultiply(A: Matrix, scalar: number): Matrix {
  return A.map(row => row.map(v => v * scalar));
}

export function matrixAdd(A: Matrix, B: Matrix): Matrix {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error('Matrix dimensions must match for addition');
  }
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

export function matrixSubtract(A: Matrix, B: Matrix): Matrix {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error('Matrix dimensions must match for subtraction');
  }
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

export function inverse2x2(A: Matrix): Matrix {
  if (A.length !== 2 || A[0].length !== 2) {
    throw new Error('inverse2x2 requires a 2×2 matrix');
  }
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (isZero(det)) {
    throw new Error('Matrix is singular, cannot invert');
  }
  return [
    [A[1][1] / det, -A[0][1] / det],
    [-A[1][0] / det, A[0][0] / det],
  ];
}

export function inverse3x3(A: Matrix): Matrix {
  if (A.length !== 3 || A[0].length !== 3) {
    throw new Error('inverse3x3 requires a 3×3 matrix');
  }
  const det =
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
  if (isZero(det)) {
    throw new Error('Matrix is singular, cannot invert');
  }
  const cofactor: Matrix = [
    [
      (A[1][1] * A[2][2] - A[1][2] * A[2][1]),
      -(A[0][1] * A[2][2] - A[0][2] * A[2][1]),
      (A[0][1] * A[1][2] - A[0][2] * A[1][1]),
    ],
    [
      -(A[1][0] * A[2][2] - A[1][2] * A[2][0]),
      (A[0][0] * A[2][2] - A[0][2] * A[2][0]),
      -(A[0][0] * A[1][2] - A[0][2] * A[1][0]),
    ],
    [
      (A[1][0] * A[2][1] - A[1][1] * A[2][0]),
      -(A[0][0] * A[2][1] - A[0][1] * A[2][0]),
      (A[0][0] * A[1][1] - A[0][1] * A[1][0]),
    ],
  ];
  return scalarMultiply(cofactor, 1 / det);
}

export function inverse(A: Matrix): Matrix {
  if (!isSquare(A)) throw new Error('Cannot invert non-square matrix');
  const n = A.length;
  if (n === 2) return inverse2x2(A);
  if (n === 3) return inverse3x3(A);
  throw new Error('Inverse is only implemented for 2×2 and 3×3 matrices');
}
