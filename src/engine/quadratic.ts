import type { Matrix, QuadraticFormResult, CalculationStep } from '@/types';
import { isZero, cloneMatrix, createMatrix, roundMatrix, transpose } from './matrix';
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

function fmt(n: number): string {
  const r = Math.round(n * 1e8) / 1e8;
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(4);
}

function makeSymmetric(A: Matrix): Matrix {
  const n = A.length;
  const result: Matrix = [];
  for (let i = 0; i < n; i++) {
    result.push([]);
    for (let j = 0; j < n; j++) {
      result[i][j] = (A[i][j] + A[j][i]) / 2;
    }
  }
  return result;
}

export function standardizeByOrthogonal(A: Matrix): QuadraticFormResult {
  const n = A.length;
  const steps: string[] = [];

  let workingA = A;
  if (!isSymmetric(A)) {
    steps.push('警告: 矩阵非对称，将使用正交变换于 (A + Aᵀ)/2');
    workingA = makeSymmetric(A);
  }

  const { eigenvalues, eigenvectors } = eigen(workingA);
  const flatVecs: number[][] = eigenvectors.map(colMat => colMat.map(row => row[0]));
  const orthoVecs = gramSchmidt(flatVecs);
  const P = transpose(orthoVecs);

  const coords: string[] = [];
  for (let i = 0; i < n; i++) {
    coords.push(`y_${i + 1}`);
  }

  const terms: string[] = [];
  for (let i = 0; i < eigenvalues.length; i++) {
    const val = Math.round(eigenvalues[i] * 1e6) / 1e6;
    if (isZero(val)) continue;
    terms.push(`${fmt(val)}${coords[i]}^2`);
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
  const calcSteps: CalculationStep[] = [];
  const rawStringSteps: string[] = [];
  const completingSteps: string[] = [];

  if (!isSymmetric(A)) {
    rawStringSteps.push('矩阵非对称，已自动对称化 (A + Aᵀ)/2');
  }

  const workingA = makeSymmetric(A);
  const mc = cloneMatrix(workingA);
  const vars = Array.from({ length: n }, (_, i) => `x_${i + 1}`);
  const yVars: string[] = [];
  const coefficients: number[] = [];

  calcSteps.push({
    title: '二次型矩阵',
    math: `A = \\begin{pmatrix} ${mc.map(r => r.map(v => fmt(v)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `对 ${n} 元二次型 f = xᵀAx 使用 Lagrange 配方法逐步化为标准型`,
  });

  for (let r = 0; r < n; r++) {
    if (!isZero(mc[r][r])) {
      const a = mc[r][r];
      const aFmt = fmt(a);

      const crossParts: string[] = [];
      const crossPartPlain: string[] = [];
      for (let j = r + 1; j < n; j++) {
        if (!isZero(mc[r][j])) {
          const c = mc[r][j] / a;
          const cFmt = fmt(c);
          const sign = c >= 0 ? '+' : '';
          crossParts.push(`${sign}${cFmt}${vars[j]}`);
          crossPartPlain.push(`${sign}${cFmt}${vars[j]}`);
        }
      }
      const crossStr = crossParts.join(' ');
      const innerExpr = crossStr ? `${vars[r]}${crossStr}` : vars[r];

      const stepTitle = `第 ${r + 1} 步：配方消去 ${vars[r]}`;
      const squareExpr = `${aFmt}(${innerExpr})^2`;

      let subtractTerms = '';
      const subtractList: string[] = [];
      for (let i = r + 1; i < n; i++) {
        for (let j = r + 1; j < n; j++) {
          const extra = (mc[r][i] * mc[r][j]) / a;
          if (!isZero(extra)) {
            const old = mc[i][j];
            mc[i][j] -= extra;
            if (i <= j) {
              mc[j][i] = mc[i][j];
            }
            if (!isZero(old)) {
              subtractList.push(`${fmt(old)}${vars[i + 1]}${vars[j + 1]}`);
            }
          }
        }
      }

      const subRows: string[] = [];
      for (let i = r + 1; i < n; i++) {
        const row: number[] = [];
        for (let j = r + 1; j < n; j++) {
          row.push(mc[i][j]);
        }
        if (row.length > 0) {
          subRows.push(row.map(v => fmt(v)).join(' & '));
        }
      }

      let desc = `提取含 ${vars[r]} 的项，配成完全平方：${squareExpr}`;
      if (subRows.length > 0) {
        desc += `\n剩余子矩阵：\\(\\begin{pmatrix}${subRows.join('\\\\')}\\end{pmatrix}\\)`;
      }

      calcSteps.push({
        title: stepTitle,
        math: squareExpr,
        description: desc,
      });

      completingSteps.push(squareExpr);
      yVars.push(`y_${yVars.length + 1}`);
      coefficients.push(a);

      for (let j = r + 1; j < n; j++) mc[r][j] = 0;
    } else {
      let found = false;
      for (let c = r + 1; c < n; c++) {
        if (!isZero(mc[r][c])) {
          const b = mc[r][c];
          const bFmt = fmt(b);

          const term = `${bFmt}${vars[r]}${vars[c]}`;
          const transform = `${vars[r]} = y_${r + 1} + y_${c + 1},\\ ${vars[c]} = y_${r + 1} - y_${c + 1}`;

          calcSteps.push({
            title: `第 ${r + 1} 步：处理零对角元`,
            math: `${term} = \\frac{${bFmt}}{4}[(y_${r + 1} + y_${c + 1})^2 - (y_${r + 1} - y_${c + 1})^2]`,
            description: `对角元为零，作变换 ${transform}，引入平方项`,
          });

          completingSteps.push(`处理交叉项: ${term}`);
          yVars.push(`y_${yVars.length + 1}`);
          yVars.push(`y_${yVars.length + 1}`);
          coefficients.push(b / 4);
          coefficients.push(-b / 4);

          mc[r][r] = b / 2;
          mc[c][c] = -b / 2;
          for (let j = 0; j < n; j++) {
            if (j !== r && j !== c) {
              mc[j][r] = (mc[j][r] + mc[j][c]) / 2;
              mc[j][c] = (mc[j][r] - mc[j][c]) / 2;
            }
          }
          found = true;
          break;
        }
      }
      if (!found) {
        calcSteps.push({
          title: `第 ${r + 1} 步：跳过`,
          math: '',
          description: `第 ${r + 1} 行全为零，无配方项`,
        });
        break;
      }
    }
  }

  const standardTerms: string[] = [];
  for (let i = 0; i < coefficients.length; i++) {
    const val = coefficients[i];
    if (isZero(val)) continue;
    const vFmt = fmt(val);
    standardTerms.push(`${vFmt}${yVars[i]}^2`);
  }
  const standardForm = standardTerms.join(' + ').replace(/\+ -/g, '- ') || '0';

  calcSteps.push({
    title: '标准型',
    math: `f = ${standardForm}`,
    description: yVars.length > 0
      ? `通过变换 ${yVars.map((y, i) => `${y} = ...`).join(', ')}，二次型化为标准型`
      : '配方法完成',
  });

  rawStringSteps.push(`配方法步骤: ${completingSteps.join('; ')}`);
  rawStringSteps.push(`标准型: ${standardForm}`);

  return {
    method: 'completing-square',
    standardForm,
    steps: rawStringSteps,
    completingSteps,
  };
}

export function standardizeByCompletingWithCalcSteps(A: Matrix): {
  standardForm: string
  calcSteps: CalculationStep[]
  completingSteps: string[]
} {
  const n = A.length;
  const calcSteps: CalculationStep[] = [];
  const completingSteps: string[] = [];

  const workingA = makeSymmetric(A);
  const mc = cloneMatrix(workingA);
  const vars = Array.from({ length: n }, (_, i) => `x_${i + 1}`);
  const yVars: string[] = [];
  const coefficients: number[] = [];

  calcSteps.push({
    title: '二次型矩阵',
    math: `A = \\begin{pmatrix} ${mc.map(r => r.map(v => fmt(v)).join(' & ')).join(' \\\\\\\\ ')} \\end{pmatrix}`,
    description: `对 ${n} 元二次型 f = xᵀAx 使用 Lagrange 配方法逐步化为标准型`,
  });

  for (let r = 0; r < n; r++) {
    if (!isZero(mc[r][r])) {
      const a = mc[r][r];
      const aFmt = fmt(a);

      const crossParts: string[] = [];
      for (let j = r + 1; j < n; j++) {
        if (!isZero(mc[r][j])) {
          const c = mc[r][j] / a;
          const cFmt = fmt(c);
          const sign = c >= 0 ? '+' : '';
          crossParts.push(`${sign}${cFmt}${vars[j]}`);
        }
      }
      const crossStr = crossParts.join(' ');

      const innerExpr = crossStr ? `${vars[r]}${crossStr}` : vars[r];
      const stepTitle = `第 ${r + 1} 步：配方消去 ${vars[r]}`;
      const squareExpr = `${aFmt}(${innerExpr})^2`;

      const subRows: string[] = [];
      for (let i = r + 1; i < n; i++) {
        for (let j = i; j < n; j++) {
          const extra = (mc[r][i] * mc[r][j]) / a;
          if (!isZero(extra)) {
            mc[i][j] -= extra;
            if (i !== j) mc[j][i] = mc[i][j];
          }
        }
        if (i < n) {
          const row: number[] = [];
          for (let j = r + 1; j < n; j++) {
            row.push(mc[i][j]);
          }
          if (row.length > 0) {
            subRows.push(row.map(v => fmt(v)).join(' & '));
          }
        }
      }

      const newVar = `y_${yVars.length + 1}`;
      const innerInY = innerExpr.replace(
        new RegExp(vars.map(v => v.replace('_', '\\_')).join('|'), 'g'),
        (_m) => {
          return _m === vars[r] ? newVar : _m;
        }
      );

      let desc = innerExpr.includes('x') ? `令 ${newVar} = ${innerExpr}` : '';
      if (subRows.length > 0 && subRows.some(r => !isZero(parseFloat(r.split('&')[0] || '0')))) {
        desc += desc ? '\n' : '';
        desc += `剩余子矩阵已自动更新`;
      }

      calcSteps.push({
        title: stepTitle,
        math: `${aFmt}(${innerExpr})^2`,
        description: desc || undefined,
      });

      completingSteps.push(squareExpr);
      yVars.push(newVar);
      coefficients.push(a);

      for (let j = r + 1; j < n; j++) mc[r][j] = 0;
    } else {
      let found = false;
      for (let c = r + 1; c < n; c++) {
        if (!isZero(mc[r][c])) {
          const b = mc[r][c];
          const bFmt = fmt(b);

          calcSteps.push({
            title: `第 ${r + 1} 步：处理零对角元`,
            math: `${bFmt}${vars[r]}${vars[c]} = \\frac{${bFmt}}{2}[(y_${r + 1})^2 - (y_${c + 1})^2]`,
            description: `对角元为零，令 ${vars[r]} = y_${r + 1} + y_${c + 1}, ${vars[c]} = y_${r + 1} - y_${c + 1}`,
          });

          completingSteps.push(`处理交叉项: ${bFmt}${vars[r]}${vars[c]}`);
          yVars.push(`y_${yVars.length + 1}`);
          yVars.push(`y_${yVars.length + 1}`);
          coefficients.push(b / 2);
          coefficients.push(-b / 2);
          found = true;
          break;
        }
      }
      if (!found) break;
    }
  }

  const standardTerms: string[] = [];
  for (let i = 0; i < coefficients.length; i++) {
    const val = coefficients[i];
    if (isZero(val)) continue;
    const vFmt = fmt(val);
    const sign = coefficients[i] >= 0 ? (standardTerms.length === 0 ? '' : '+ ') : '- ';
    standardTerms.push(`${sign}${Math.abs(coefficients[i]) < 1e-8 ? '' : fmt(Math.abs(coefficients[i]))}${yVars[i]}^2`);
  }

  let standardForm = standardTerms.join(' ').trim();
  if (!standardForm) standardForm = '0';
  standardForm = standardForm.replace(/\+\s*-/g, '- ');
  if (standardForm.startsWith('+ ')) standardForm = standardForm.slice(2);

  calcSteps.push({
    title: '标准型',
    math: `f = ${standardForm}`,
    description: '配方法完成，二次型已化为平方和形式',
  });

  return { standardForm, calcSteps, completingSteps };
}

export function parseQuadraticForm(input: string): {
  matrix: Matrix;
  variables: string[];
} {
  const trimmed = input.replace(/\s+/g, '');

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const clean = trimmed.replace(/[\[\]]/g, '').split(';').map(s => s.split(',').map(Number));
      return { matrix: clean, variables: [] };
    } catch {
      /* fall through to regex */
    }
  }

  const terms: { coeff: number; i: number; j: number }[] = [];
  const varSet = new Set<string>();

  let str = trimmed;
  if (str.startsWith('f=') || str.startsWith('xᵀAx=')) {
    str = str.replace(/^(f=|xᵀAx=)/, '');
  }

  const termRegex = /([+-]?\s*\d*\.?\d*\s*\*?\s*)(x\d+)\^2|([+-]?\s*\d*\.?\d*\s*\*?\s*)(x\d+)\s*\*\s*(x\d+)/g;
  let match;

  while ((match = termRegex.exec(str)) !== null) {
    if (match[1] !== undefined && match[2]) {
      const coeffStr = match[1].replace(/\s/g, '').replace(/\*$/, '');
      let coeff = 0;
      if (coeffStr === '' || coeffStr === '+') coeff = 1;
      else if (coeffStr === '-') coeff = -1;
      else coeff = parseFloat(coeffStr);

      const varName = match[2];
      const idx = parseInt(varName.substring(1)) - 1;
      varSet.add(varName);
      terms.push({ coeff, i: idx, j: idx });
    } else if (match[3] !== undefined && match[4] && match[5]) {
      const coeffStr = match[3].replace(/\s/g, '').replace(/\*$/, '');
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
    const simpleTermRegex = /([+-]?\s*\d*)\s*\*?\s*(x\d+)\^2/g;
    while ((match = simpleTermRegex.exec(str)) !== null) {
      let coeff = 1;
      const cs = match[1].replace(/\s/g, '');
      if (cs === '-') coeff = -1;
      else if (cs !== '' && cs !== '+') coeff = parseFloat(cs);
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
