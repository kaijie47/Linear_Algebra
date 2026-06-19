import type { Matrix, EigenResult } from '@/types';
import {
  isZero,
  cloneMatrix,
  createMatrix,
  identityMatrix,
  matrixSubtract,
  matrixMultiply,
  scalarMultiply,
  roundMatrix,
} from './matrix';

function normalizeVec(v: number[]): number[] {
  let norm = 0;
  for (const x of v) norm += x * x;
  norm = Math.sqrt(norm);
  if (isZero(norm)) return v.map(() => 0);
  return v.map(x => x / norm);
}

function powerIteration(
  A: Matrix,
  maxIter: number = 200
): { eigenvalue: number; eigenvector: number[] } | null {
  const n = A.length;
  let v = new Array(n).fill(1);
  v = normalizeVec(v);
  let lambda = 0;
  for (let iter = 0; iter < maxIter; iter++) {
    const w = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        w[i] += A[i][j] * v[j];
      }
    }
    const newLambda = Math.abs(w[0]);
    for (let i = 1; i < n; i++) {
      if (Math.abs(w[i]) > Math.abs(newLambda)) break;
    }
    let dot = 0;
    for (let i = 0; i < n; i++) dot += v[i] * w[i];
    const newV = normalizeVec(w);
    if (Math.abs(dot - lambda) < 1e-8) {
      return { eigenvalue: dot, eigenvector: newV };
    }
    lambda = dot;
    v = newV;
  }
  return { eigenvalue: lambda, eigenvector: v };
}

function shiftInvertIteration(
  A: Matrix,
  shift: number,
  tol: number = 1e-8,
  maxIter: number = 100
): { eigenvalue: number; eigenvector: number[] } | null {
  const n = A.length;
  const B = cloneMatrix(A);
  for (let i = 0; i < n; i++) B[i][i] -= shift;

  let v = new Array(n).fill(1);
  v = normalizeVec(v);
  for (let iter = 0; iter < maxIter; iter++) {
    const w = solveLinear(B, v);
    if (!w) return null;
    v = normalizeVec(w);
  }

  const w = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      w[i] += A[i][j] * v[j];
    }
  }
  let rq = 0;
  for (let i = 0; i < n; i++) rq += v[i] * w[i];
  return { eigenvalue: rq, eigenvector: v };
}

function solveLinear(A: Matrix, b: number[]): number[] | null {
  const n = A.length;
  const aug = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    let maxVal = Math.abs(aug[col][col]);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r][col]) > maxVal) {
        maxVal = Math.abs(aug[r][col]);
        pivotRow = r;
      }
    }
    if (isZero(maxVal)) return null;
    if (pivotRow !== col) {
      [aug[col], aug[pivotRow]] = [aug[pivotRow], aug[col]];
    }
    const pivot = aug[col][col];
    for (let j = col; j <= n; j++) aug[col][j] /= pivot;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r][col];
      for (let j = col; j <= n; j++) aug[r][j] -= factor * aug[col][j];
    }
  }
  return aug.map(row => row[n]);
}

function solveQuadratic(a: number, b: number, c: number): number[] {
  if (isZero(a)) {
    if (isZero(b)) return [];
    return [-c / b];
  }
  const disc = b * b - 4 * a * c;
  if (disc < -1e-10) return [];
  if (isZero(disc)) return [-b / (2 * a)];
  const sqrtDisc = Math.sqrt(disc);
  return [(-b + sqrtDisc) / (2 * a), (-b - sqrtDisc) / (2 * a)];
}

function solveCubic(coeffs: number[]): number[] {
  const [a3, a2, a1, a0] = coeffs;
  if (isZero(a3)) return solveQuadratic(a2, a1, a0);
  const b = a2 / a3;
  const c = a1 / a3;
  const d = a0 / a3;
  const p = c - b * b / 3;
  const q = d - b * c / 3 + (2 * b * b * b) / 27;
  const disc = (q * q) / 4 + (p * p * p) / 27;
  const results: number[] = [];

  if (isZero(disc)) {
    const u = Math.cbrt(-q / 2);
    results.push(2 * u - b / 3, -u - b / 3);
    return results;
  }
  if (disc > 0) {
    const sqrtD = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);
    results.push(u + v - b / 3);
    return results;
  }
  const r = Math.sqrt(-(p * p * p) / 27);
  const phi = Math.acos(-q / (2 * r));
  for (let k = 0; k < 3; k++) {
    results.push(
      2 * Math.cbrt(r) * Math.cos((phi + 2 * Math.PI * k) / 3) - b / 3
    );
  }
  return results.sort((x, y) => y - x);
}

function triangularize2x2(A: Matrix): Matrix {
  const x = A[0][0];
  const y = A[1][0];
  if (isZero(y)) return cloneMatrix(A);
  let c = 0, s = 0;
  if (isZero(x)) {
    c = 0; s = 1;
  } else {
    const r = Math.sqrt(x * x + y * y);
    c = x / r;
    s = y / r;
  }
  const n = A.length;
  const R = cloneMatrix(A);
  const cols = A[0].length;
  for (let j = 0; j < cols; j++) {
    const a0j = R[0][j];
    const a1j = R[1][j];
    R[0][j] = c * a0j + s * a1j;
    R[1][j] = -s * a0j + c * a1j;
  }
  return R;
}

function qrDecomposition(A: Matrix): { Q: Matrix; R: Matrix } {
  const n = A.length;
  const Q = cloneMatrix(A);
  const R = createMatrix(n, n, 0);

  for (let k = 0; k < n - 1; k++) {
    for (let i = k + 1; i < n; i++) {
      if (isZero(Q[i][k])) continue;
      const x = Q[k][k];
      const y = Q[i][k];
      const r = Math.sqrt(x * x + y * y);
      const c = x / r;
      const sn = y / r;
      for (let j = 0; j < n; j++) {
        const qkj = Q[k][j];
        const qij = Q[i][j];
        Q[k][j] = c * qkj + sn * qij;
        Q[i][j] = -sn * qkj + c * qij;
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += Q[k][i] * Q[k][j];
      }
      R[i][j] = i === j ? Math.sqrt(Math.max(0, sum)) : sum;
    }
  }

  for (let i = 0; i < n; i++) {
    if (!isZero(R[i][i])) {
      for (let k = 0; k < n; k++) Q[k][i] /= R[i][i];
    }
  }

  return { Q, R };
}

function qrEigen(A: Matrix, maxIter: number = 200): number[] {
  const n = A.length;
  let Ak = cloneMatrix(A);
  for (let iter = 0; iter < maxIter; iter++) {
    const { Q, R } = qrDecomposition(Ak);
    Ak = createMatrix(n, n, 0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          Ak[i][j] += R[i][k] * Q[k][j];
        }
      }
    }

    let offDiag = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        offDiag += Ak[i][j] * Ak[i][j] + Ak[j][i] * Ak[j][i];
      }
    }
    if (Math.sqrt(offDiag) < 1e-10) break;
  }

  const eigenvals: number[] = [];
  for (let i = 0; i < n; i++) eigenvals.push(Ak[i][i]);
  return eigenvals.sort((a, b) => b - a);
}

export function characteristicPolynomial(A: Matrix): string {
  const n = A.length;
  if (n > 3) {
    return `λ^${n} + ... (仅支持 2×2 和 3×3 的解析表示)`;
  }
  if (n === 1) return `λ - ${A[0][0]}`;

  if (n === 2) {
    const trace = A[0][0] + A[1][1];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const parts: string[] = ['λ²'];
    if (!isZero(trace)) parts.push(`${trace >= 0 ? '-' : '+'} ${Math.abs(trace)}λ`);
    if (!isZero(det)) parts.push(`${det >= 0 ? '+' : '-'} ${Math.abs(det)}`);
    else parts.push('');
    return parts.filter(Boolean).join(' ');
  }

  if (n === 3) {
    const a = A[0][0];
    const b = A[0][1];
    const c = A[0][2];
    const d = A[1][0];
    const e = A[1][1];
    const f = A[1][2];
    const g = A[2][0];
    const h = A[2][1];
    const i = A[2][2];

    const t1 = -(a + e + i);
    const t2 = a * e + a * i + e * i - b * d - c * g - f * h;
    const t3 = -(
      a * e * i + b * f * g + c * d * h -
      c * e * g - b * d * i - a * f * h
    );

    const parts: string[] = ['λ³'];
    if (!isZero(t1)) {
      parts.push(`${t1 >= 0 ? '+' : '-'} ${Math.abs(t1)}λ²`);
    }
    if (!isZero(t2)) {
      parts.push(`${t2 >= 0 ? '+' : '-'} ${Math.abs(t2)}λ`);
    }
    if (!isZero(t3)) {
      parts.push(`${t3 >= 0 ? '+' : '-'} ${Math.abs(t3)}`);
    }
    return parts.join(' ');
  }
  return '';
}

export function eigen(A: Matrix): EigenResult {
  const n = A.length;
  if (n === 0 || n !== A[0].length) {
    throw new Error('eigen requires a non-empty square matrix');
  }
  const steps: string[] = [];
  let eigenvalues: number[] = [];
  const eigenvectors: Matrix[] = [];

  if (n === 1) {
    eigenvalues = [A[0][0]];
    eigenvectors.push([[1]]);
    steps.push('1×1 矩阵: 特征值 = 矩阵本身的值');
    return {
      eigenvalues,
      eigenvectors,
      characteristicPolynomial: `λ - ${A[0][0]}`,
      steps,
    };
  }

  if (n === 2) {
    steps.push('计算 2×2 特征方程 det(A - λI) = 0');
    const trace = A[0][0] + A[1][1];
    const det2 = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    steps.push(`特征方程: λ² - ${trace}λ + ${det2} = 0`);
    eigenvalues = solveQuadratic(1, -trace, det2);
    steps.push(
      eigenvalues.length === 2
        ? `解得: λ₁ = ${eigenvalues[0]}, λ₂ = ${eigenvalues[1]}`
        : eigenvalues.length === 1
          ? `重根: λ = ${eigenvalues[0]}`
          : '无实特征值'
    );

    for (const lambda of eigenvalues) {
      const ev = findEigenvector2x2(A, lambda);
      if (ev) eigenvectors.push(ev.map(v => [v]));
      steps.push(`λ = ${lambda} 的特征向量: [${ev?.join(', ')}]`);
    }
  } else if (n === 3) {
    steps.push('计算 3×3 特征多项式 det(A - λI) = 0');
    const coeffs = getCharacteristicCoeffs3x3(A);
    steps.push(`特征方程: λ³ + ${coeffs[1]}λ² + ${coeffs[2]}λ + ${coeffs[3]} = 0`);
    const roots = solveCubic([1, coeffs[1], coeffs[2], coeffs[3]]);
    eigenvalues = roots.filter(r => !isNaN(r));
    steps.push(
      eigenvalues.length > 0
        ? `特征值: ${eigenvalues.map(v => v.toFixed(6)).join(', ')}`
        : '无实特征值'
    );

    for (const lambda of eigenvalues) {
      const ev = findEigenvector(A, lambda);
      if (ev) eigenvectors.push(ev.map(v => [v]));
    }
  } else {
    steps.push(`使用 QR 迭代法计算 ${n}×${n} 矩阵的特征值`);
    eigenvalues = qrEigen(A);
    steps.push(`特征值: ${eigenvalues.map(v => v.toFixed(6)).join(', ')}`);
    for (const lambda of eigenvalues) {
      const ev = findEigenvector(A, lambda);
      if (ev) eigenvectors.push(ev.map(v => [v]));
    }
  }

  return {
    eigenvalues,
    eigenvectors,
    characteristicPolynomial: characteristicPolynomial(A),
    steps,
  };
}

function findEigenvector2x2(A: Matrix, lambda: number): number[] | null {
  const a = A[0][0] - lambda;
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1] - lambda;

  if (!isZero(b)) return [1, -a / b];
  if (!isZero(d)) return [-b, a].map(v => (isZero(v) ? 0 : 1));
  if (!isZero(c)) return [-d / c, 1];
  if (!isZero(a)) return [1, -c / a];
  return [1, 0];
}

function getCharacteristicCoeffs3x3(A: Matrix): number[] {
  const a = A[0][0]; const b = A[0][1]; const c = A[0][2];
  const d = A[1][0]; const e = A[1][1]; const f = A[1][2];
  const g = A[2][0]; const h = A[2][1]; const i_ = A[2][2];

  return [
    1,
    -(a + e + i_),
    a * e + a * i_ + e * i_ - b * d - c * g - f * h,
    -(a * e * i_ + b * f * g + c * d * h - c * e * g - b * d * i_ - a * f * h),
  ];
}

export function findEigenvector(A: Matrix, lambda: number): number[] | null {
  const n = A.length;
  const B = cloneMatrix(A);
  for (let i = 0; i < n; i++) B[i][i] -= lambda;

  const aug = B.map(row => [...row, 0]);
  const rows = n;
  const cols = n + 1;

  for (let c = 0; c < n; c++) {
    let pivotRow = c;
    let maxVal = Math.abs(aug[c][c]);
    for (let r = c + 1; r < rows; r++) {
      if (Math.abs(aug[r][c]) > maxVal) {
        maxVal = Math.abs(aug[r][c]);
        pivotRow = r;
      }
    }
    if (isZero(maxVal)) continue;
    if (pivotRow !== c) [aug[c], aug[pivotRow]] = [aug[pivotRow], aug[c]];
    const pivot = aug[c][c];
    for (let j = c; j < cols; j++) aug[c][j] /= pivot;
    for (let r = c + 1; r < rows; r++) {
      if (isZero(aug[r][c])) continue;
      const factor = aug[r][c];
      for (let j = c; j < cols; j++) aug[r][j] -= factor * aug[c][j];
    }
  }

  const pivotCols: number[] = [];
  let row = 0;
  for (let c = 0; c < n && row < rows; c++) {
    if (!isZero(aug[row][c])) {
      pivotCols.push(c);
      row++;
    }
  }

  const freeVars: number[] = [];
  for (let j = 0; j < n; j++) {
    if (!pivotCols.includes(j)) freeVars.push(j);
  }

  if (freeVars.length === 0) return null;

  const vec: number[] = new Array(n).fill(0);
  vec[freeVars[0]] = 1;
  const pivotRowMap: Record<number, number> = {};
  let r = 0;
  for (let c = 0; c < n && r < rows; c++) {
    if (!isZero(aug[r][c])) {
      pivotRowMap[c] = r;
      r++;
    }
  }
  for (const pCol of pivotCols) {
    const pRow = pivotRowMap[pCol];
    let val = 0;
    for (const fCol of freeVars) {
      val -= aug[pRow][fCol] * vec[fCol];
    }
    vec[pCol] = val;
  }

  return normalizeVec(vec);
}
