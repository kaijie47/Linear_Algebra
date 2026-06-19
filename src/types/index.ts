export type Matrix = number[][];

export interface Fraction {
  num: number;
  den: number;
}

export type StepId =
  | 'determinant'
  | 'rank'
  | 'matrix'
  | 'equations'
  | 'basic-solutions'
  | 'eigen'
  | 'similar-diagonal'
  | 'contract-diagonal'
  | 'quadratic-form';

export interface StepInfo {
  id: StepId;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  icon: string;
  prerequisites: string[];
  bridges: string;
  nextPreview: string;
}

export interface EliminationStep {
  matrix: Matrix;
  operation: string;
  description: string;
}

export interface EigenResult {
  eigenvalues: number[];
  eigenvectors: Matrix[];
  characteristicPolynomial: string;
  steps: string[];
}

export interface DiagonalizationResult {
  diagonalizable: boolean;
  P?: Matrix;
  D?: Matrix;
  steps: string[];
}

export interface QuadraticFormResult {
  method: 'orthogonal' | 'completing-square';
  standardForm: string;
  orthogonalMatrix?: Matrix;
  eigenvalues?: number[];
  steps: string[];
  completingSteps?: string[];
}

export interface EquationSolveResult {
  type: 'unique' | 'infinite' | 'none';
  solution?: number[];
  basisSolutions?: Matrix;
  generalSolution?: string;
  steps: string[];
}

export interface CalculationStep {
  title: string;
  math: string;
  description?: string;
  highlightRows?: number[];
  highlightCols?: number[];
}

export const LEARNING_STEPS: StepInfo[] = [
  {
    id: 'determinant',
    title: '行列式',
    subtitle: '第1步',
    description: '掌握行列式的定义与计算，从二阶到高阶逐步展开',
    order: 1,
    icon: '|A|',
    prerequisites: [],
    bridges: '行列式是线性代数中最基础的标量工具。它的值为零与否，将贯穿后续所有内容——秩的判断、方程组的解、特征值的计算、对角化条件，都离不开行列式。',
    nextPreview: '行列式的值为零 ⟹ 矩阵行向量线性相关 ⟹ 秩小于行数。下一步将学习如何通过行变换精确求秩。',
  },
  {
    id: 'rank',
    title: '求秩',
    subtitle: '第2步',
    description: '通过高斯消元法将矩阵化为行阶梯形，理解秩的概念',
    order: 2,
    icon: 'r(A)',
    prerequisites: ['行列式的基本概念'],
    bridges: '秩是刻画矩阵信息量的核心数字。前一步的行列式只能判断"是否满秩"，而高斯消元能精确得出秩的值，为后续矩阵运算、方程组解的判定铺路。',
    nextPreview: '理解了秩，接下来学习矩阵的基本运算——加减乘、转置与求逆，这些都是方程组求解和特征值计算的基础操作。',
  },
  {
    id: 'matrix',
    title: '认识矩阵',
    subtitle: '第3步',
    description: '掌握矩阵的加减乘、转置、逆等基本运算',
    order: 3,
    icon: 'Aᵀ',
    prerequisites: ['行列式','秩'],
    bridges: '矩阵运算是"代数语言"的语法规则。前面学到的行列式和秩都是矩阵的性质，而加减乘、转置、求逆则是操作矩阵的工具——方程组 Ax=b 中的每一个符号都蕴含这些运算。',
    nextPreview: '掌握了矩阵运算后，就能用紧凑的 Ax=b 来表示整个线性方程组了。根据秩的关系判断解的类型，正是下一章的核心。',
  },
  {
    id: 'equations',
    title: '刻画方程组',
    subtitle: '第4步',
    description: '用矩阵语言描述线性方程组，判断解的类型',
    order: 4,
    icon: 'Ax=b',
    prerequisites: ['秩','矩阵乘法'],
    bridges: '方程组是线性代数的核心应用场景。行列式告诉我们何时有唯一解（det≠0），秩的对比精确区分唯一解/无穷解/无解，增广矩阵的构造要用到矩阵运算。',
    nextPreview: '对于有无穷多解的情况，解空间的结构是什么样的？基础解系给出了标准答案——下一步为齐次方程组找到独立的解向量基底。',
  },
  {
    id: 'basic-solutions',
    title: '求基础解系',
    subtitle: '第5步',
    description: '求解齐次方程组的基础解系，理解解空间结构',
    order: 5,
    icon: 'N(A)',
    prerequisites: ['高斯消元','方程组解的类型'],
    bridges: '基础解系揭示了解空间的线性结构：dim N(A)=n−r(A)。秩 r(A) 决定了有多少约束，剩下的自由度就是解空间的维数。这个 n−r 也预示了矩阵零空间的维数。',
    nextPreview: '解空间的研究引出一个核心问题：矩阵乘以向量，哪些向量的方向不变？这就通向特征值与特征向量——矩阵的"固有属性"。',
  },
  {
    id: 'eigen',
    title: '特征方程与特征向量',
    subtitle: '第6步',
    description: '计算特征值与特征向量，理解矩阵的本质特性',
    order: 6,
    icon: 'Av=λv',
    prerequisites: ['行列式','矩阵运算','方程组'],
    bridges: '特征值方程 det(A−λI)=0 本身就是行列式的应用！解出的 λ 是特征值，对每个 λ 解齐次方程 (A−λI)v=0 得到特征向量——这正好是前面基础解系的方法。',
    nextPreview: '把特征向量拼成矩阵 P，就能实现 P⁻¹AP=Λ 的相似对角化。矩阵被"拆解"成对角形式，这是整个线性代数最优雅的结论之一。',
  },
  {
    id: 'similar-diagonal',
    title: '相似对角阵',
    subtitle: '第7步',
    description: '判断矩阵是否可对角化，构造相似对角矩阵',
    order: 7,
    icon: 'P⁻¹AP',
    prerequisites: ['特征值与特征向量','矩阵求逆'],
    bridges: '相似对角化是特征值理论的直接延续：把线性无关的特征向量组成 P，矩阵乘法 P⁻¹AP 就得到对角阵。如果不能用相似变换对角化，合同对角化提供了另一条路。',
    nextPreview: '相似对角化要求 P⁻¹，而实对称矩阵可以用更简单的合同变换 CᵀAC 对角化，无需求逆。合同对角化是通向二次型标准化的关键桥梁。',
  },
  {
    id: 'contract-diagonal',
    title: '合同对角化',
    subtitle: '第8步',
    description: '对实对称矩阵进行合同变换，化为合同对角阵',
    order: 8,
    icon: 'CᵀAC',
    prerequisites: ['对称矩阵','相似对角化','高斯消元'],
    bridges: '合同对角化专为对称矩阵设计。CᵀAC 与 P⁻¹AP 的殊途同归在于：对称矩阵的特征向量正交。这就直接引向最终目标——用正交变换化二次型为标准型。',
    nextPreview: '合同对角化的矩阵正是二次型的系数矩阵！下一步将综合所有知识：特征值 → 正交变换 → 标准型。这是我们整个学习旅程的终点。',
  },
  {
    id: 'quadratic-form',
    title: '化二次型为标准型',
    subtitle: '第9步 · 最终目标',
    description: '掌握正交变换法与配方法，完成二次型标准化',
    order: 9,
    icon: 'xᵀAx',
    prerequisites: ['特征值','特征向量','正交化','合同对角化'],
    bridges: '至此，所有铺垫汇聚于此：行列式→秩→矩阵运算→方程组→解空间→特征值→对角化→合同变换。二次型标准化是整个线性代数知识体系的最强应用。',
    nextPreview: '',
  },
];
