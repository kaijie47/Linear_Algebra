import type { Matrix, QuadraticFormResult } from '@/types';
import { isZero, cloneMatrix, createMatrix, matrixMultiply, transpose } from './matrix';
import { eigen } from './eigen';

function isSymmetric(A: Matrix): boolean {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!isZero(A[i][j] - A[j][i])) return false;
    }
  }
  return true;
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

export function standardizeByOrthogonal(A: Matrix): QuadraticFormResult {
  const n = A.length;
  const steps: string[] = [];

  if (!isSymmetric(A)) {
    steps.push('警告: 矩阵非对称，将使用正交变换于 (A + Aᵀ)/2');
  }

  const { eigenvalues, eigenvectors } = eigen(A);
  const flatVecs: number[][] = eigenvectors.map(colMat => colMat.map(row => row[0]));
  const orthoVecs = gramSchmidt(flatVecs);
  const P = transpose(orthoVecs);

  const coords: string[] = [];
  for (let i = 0; i < n; i++) {
    coords.push(`y${i + 1}`);
  }

  const terms: string[] = [];
  for (let i = 0; i < eigenvalues.length; i++) {
    const val = Math.round(eigenvalues[i] * 1e6) / 1e6;
    if (isZero(val)) continue;
    terms.push(`${val}${coords[i]}²`);
  }

  const standardForm = terms.join(' + ').replace(/\+ -/g, '- ') || '0';
  steps.push(`特征值: ${eigenvalues.map(v => v.toFixed(4)).join(', ')}`);
  steps.push(`标准型: ${standardForm}`);
  steps.push('通过正交变换 x = Qy 化为标准型');

  return {
    method: 'orthogonal',
    standardForm,
    orthogonalMatrix: P,
    eigenvalues,
    steps,
  };
}

export function standardizeByCompleting(A: Matrix): QuadraticFormResult {
  const n = A.length;
  const steps: string[] = [];
  const completingSteps: string[] = [];

  if (!isSymmetric(A)) {
    steps.push('矩阵非对称，配方法要求对称矩阵，使用 (A + Aᵀ)/2');
  }

  const vars = Array.from({ length: n }, (_, i) => `x${i + 1}`);
  const mc = cloneMatrix(A);
  const coords: string[] = [];

  for (let r = 0; r < n; r++) {
    if (!isZero(mc[r][r])) {
      const a = mc[r][r];
      let term = `${a}(${vars[r]}`;
      for (let j = r + 1; j < n; j++) {
        if (!isZero(mc[r][j])) {
          const coeff = mc[r][j] / a;
          term += ` + ${coeff}${vars[j]}`;
        }
      }
      term += ')²';
      completingSteps.push(`第${r + 1}步: 配方 ${term}`);
      coords.push(`(${vars[r]} + ...)`);

      for (let i = r + 1; i < n; i++) {
        for (let j = r + 1; j < n; j++) {
          mc[i][j] -= (mc[r][i] * mc[r][j]) / a;
        }
      }
      for (let j = r + 1; j < n; j++) mc[r][j] = 0;
    } else {
      let found = false;
      for (let c = r + 1; c < n; c++) {
        if (!isZero(mc[r][c])) {
          const b = mc[r][c];
          const term = `(${vars[r]} + ${vars[c]})² - (${vars[r]} - ${vars[c]})²`;
          completingSteps.push(
            `第${r + 1}步: 交叉项处理: ${b}${vars[r]}${vars[c]} = ${b / 2}${term}`
          );
          coords.push(`(${vars[r]} ± ${vars[c]})`);
          found = true;
          break;
        }
      }
      if (!found) break;
    }
  }

  const varMap: Record<string, string> = {};
  coords.forEach((_, i) => {
    varMap[`x${i + 1}`] = `y${i + 1}`;
  });

  steps.push(`配方法步骤: ${completingSteps.join('; ')}`);
  const standardForm = coords
    .map((c, i) => `d${i + 1}·y${i + 1}²`)
    .join(' + ') || '0';
  steps.push(`标准型: ${standardForm}`);

  return {
    method: 'completing-square',
    standardForm,
    steps,
    completingSteps,
  };
}

export function parseQuadraticForm(input: string): {
  matrix: Matrix;
  variables: string[];
} {
  const trimmed = input.replace(/\s+/g, '');
  const termRegex = /([+-]?\d*\.?\d*)(x\d+)\^2|([+-]?\d*\.?\d*)(x\d+)(x\d+)/g;
  const varSet = new Set<string>();

  const terms: { coeff: number; i: number; j: number }[] = [];
  let match;

  while ((match = termRegex.exec(trimmed)) !== null) {
    if (match[1] !== undefined && match[2]) {
      const coeffStr = match[1];
      let coeff = 0;
      if (coeffStr === '' || coeffStr === '+') coeff = 1;
      else if (coeffStr === '-') coeff = -1;
      else coeff = parseFloat(coeffStr);

      const varName = match[2];
      const idx = parseInt(varName.substring(1)) - 1;
      varSet.add(varName);
      terms.push({ coeff, i: idx, j: idx });
    } else if (match[3] !== undefined && match[4] && match[5]) {
      const coeffStr = match[3];
      let coeff = 0;
      if (coeffStr === '' || coeffStr === '+') coeff = 1;
      else if (coeffStr === '-') coeff = -1;
      else coeff = parseFloat(coeffStr);

      const v1 = match[4];
      const v2 = match[5];
      const idx1 = parseInt(v1.substring(1)) - 1;
      const idx2 = parseInt(v2.substring(1)) - 1;
      varSet.add(v1);
      varSet.add(v2);
      terms.push({ coeff: coeff / 2, i: idx1, j: idx2 });
    }
  }

  if (varSet.size === 0) {
    const simpleTermRegex = /([+-]?\d*)(x\d+)\^2/g;
    while ((match = simpleTermRegex.exec(trimmed)) !== null) {
      let coeff = 1;
      if (match[1] === '-') coeff = -1;
      else if (match[1] !== '' && match[1] !== '+') coeff = parseFloat(match[1]);
      const idx = parseInt(match[2].substring(1)) - 1;
      varSet.add(match[2]);
      terms.push({ coeff, i: idx, j: idx });
    }
  }

  const variables = Array.from(varSet).sort((a, b) => {
    const na = parseInt(a.substring(1));
    const nb = parseInt(b.substring(1));
    return na - nb;
  });

  const n = variables.length;
  if (n === 0) return { matrix: [[0]], variables: ['x1'] };

  const matrix = createMatrix(n, n, 0);
  for (const { coeff, i, j } of terms) {
    matrix[i][j] += coeff;
    if (i !== j) matrix[j][i] += coeff;
  }

  return { matrix, variables };
}
