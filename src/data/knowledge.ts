import type { StepId } from '@/types';

export interface KnowledgeBlock {
  type: 'heading' | 'math' | 'text' | 'formula' | 'example';
  text?: string;
  formula?: string;
  caption?: string;
}

export interface KnowledgeSection {
  title: string;
  content: KnowledgeBlock[];
}

export const KNOWLEDGE_CONTENT: Record<StepId, { sections: KnowledgeSection[] }> = {
  determinant: {
    sections: [
      {
        title: '定义与几何意义',
        content: [
          {
            type: 'heading',
            text: '什么是行列式',
          },
          {
            type: 'text',
            text: '行列式（determinant）是定义在方阵上的一个标量函数。给定一个 n 阶方阵 A，它的行列式记作 |A| 或 det(A)。行列式的计算规则由 n 维空间中平行四边形（或平行六面体）的有向体积推广而来。对于二阶矩阵，行列式就是对应平行四边形在平面中的有向面积。',
          },
          {
            type: 'formula',
            formula: '|A| = \\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}',
            caption: '二阶行列式公式——平行四边形的有向面积',
          },
          {
            type: 'text',
            text: '对三阶矩阵，行列式表示三个列向量张成的平行六面体的有向体积。几何上，行列式的绝对值就是该几何体的测度（面积或体积），而行列式的符号则反映了向量的定向（右手系为正，左手系为负）。行列式为零意味着向量组线性相关，几何上表现为"体积坍塌"——体积退化为零，向量共面或共线。',
          },
          {
            type: 'formula',
            formula: '\\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix} = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{12}a_{21}a_{33} - a_{11}a_{23}a_{32}',
            caption: '三阶行列式的展开（Sarrus法则）',
          },
          {
            type: 'text',
            text: '从几何视角出发，行列式可以看作线性变换对空间体积的缩放因子。如果 T: Rⁿ→Rⁿ 是用矩阵 A 表示的线性变换，则对任意区域 Ω，有 vol(T(Ω)) = |det(A)|·vol(Ω)。这一性质深刻地揭示：行列式的绝对值就是"变换后体积 / 变换前体积"的比值。',
          },
        ],
      },
      {
        title: '基本性质',
        content: [
          {
            type: 'heading',
            text: '行列式的五大基本性质',
          },
          {
            type: 'text',
            text: '行列式具有一系列优美的代数性质，这些性质是计算和论证行列式相关问题的基础。如下性质是行列式理论的基本公理特征，任何行列式的性质都可以从行交替线性性导出。',
          },
          {
            type: 'formula',
            formula: '|A^T| = |A|',
            caption: '性质一：转置不变性。行列式的值在转置下不变，这意味着"行"和"列"在行列式中地位完全对称。',
          },
          {
            type: 'formula',
            formula: '\\text{交换两行（列），行列式变号：}\\quad |E_{ij}A| = -|A|',
            caption: '性质二：交换两行（列）变号。连续交换两次回到原值，说明行列式是"反对称"的。',
          },
          {
            type: 'formula',
            formula: '\\begin{vmatrix} k a_{i1} & \\cdots & k a_{in} \\\\ \\vdots & \\ddots & \\vdots \\end{vmatrix}_{\\text{第i行}} = k\\cdot|A|',
            caption: '性质三：数乘可提取。某行（列）有公因子 k，可将 k 提取到行列式外面。',
          },
          {
            type: 'formula',
            formula: '\\text{两行（列）成比例 }\\Longrightarrow\\ |A| = 0',
            caption: '性质四：两行（列）成比例则行列式为零。特别地，若矩阵有两行完全相同，行列式必为零。',
          },
          {
            type: 'formula',
            formula: '\\text{某行加上另一行的 } k \\text{ 倍，行列式不变：}\\quad R_i \\rightarrow R_i + kR_j \\Longrightarrow |A|\\ \\text{不变}',
            caption: '性质五：倍加不变性。这是高斯消元法计算行列式的核心依据。',
          },
          {
            type: 'text',
            text: '以上五大性质可相互导出。特别地，性质五表明初等行变换"某行加另一行的倍数"不改变行列式的值，这使得我们可以通过高斯消元将矩阵化为上三角阵，进而快速计算行列式——只需将对角元相乘即可。',
          },
        ],
      },
      {
        title: 'Laplace 展开定理',
        content: [
          {
            type: 'heading',
            text: '按行（列）展开行列式',
          },
          {
            type: 'text',
            text: 'Laplace 展开定理将 n 阶行列式的计算转化为 n−1 阶行列式的计算，实现了递归降阶。首先定义代数余子式的概念：划去矩阵 A 的第 i 行和第 j 列后，剩余元素构成的 n−1 阶行列式称为余子式 Mᵢⱼ，再添上符号 (−1)ⁱ⁺ʲ 后称为代数余子式 Aᵢⱼ。',
          },
          {
            type: 'formula',
            formula: 'A_{ij} = (-1)^{i+j} M_{ij}',
            caption: '代数余子式的定义。Mᵢⱼ 是划去第 i 行第 j 列后的余子式（n−1 阶行列式）。',
          },
          {
            type: 'formula',
            formula: '|A| = \\sum_{j=1}^{n} a_{ij} A_{ij} \\quad (\\text{按第 } i \\text{ 行展开})',
            caption: 'Laplace 按行展开定理。选择零元素较多的行（列）展开可大幅简化计算。',
          },
          {
            type: 'text',
            text: 'Laplace 展开的优点在于灵活性——可以选取包含最多零元素的那一行（列）展开以简化计算。对于特殊行列式（如稀疏矩阵），这种方法比 Sarrus 法则效率更高。此外，展开公式在理论分析中也很重要：例如可用来证明 |AB|=|A|·|B|、推导伴随矩阵的逆矩阵公式等。',
          },
          {
            type: 'formula',
            formula: '\\sum_{j=1}^{n} a_{ij} A_{kj} = \\begin{cases} |A|, & i = k \\\\ 0, & i \\neq k \\end{cases}',
            caption: '一行元素与另一行对应代数余子式乘积之和为零。这是伴随矩阵求逆的理论基础。',
          },
        ],
      },
      {
        title: '特殊行列式',
        content: [
          {
            type: 'heading',
            text: '三角矩阵与 Vandermonde 行列式',
          },
          {
            type: 'text',
            text: '某些特殊结构的矩阵，其行列式有极其简单的计算公式。最常见的是三角矩阵：上三角阵的对角元下方全为零，下三角阵的对角元上方全为零，对角阵则非对角线元素全部为零。',
          },
          {
            type: 'formula',
            formula: '\\begin{vmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ 0 & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & a_{nn} \\end{vmatrix} = a_{11}a_{22}\\cdots a_{nn}',
            caption: '上三角行列式 = 主对角线元素之积。下三角同理。',
          },
          {
            type: 'formula',
            formula: '\\begin{vmatrix} 1 & x_1 & x_1^2 & \\cdots & x_1^{n-1} \\\\ 1 & x_2 & x_2^2 & \\cdots & x_2^{n-1} \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 1 & x_n & x_n^2 & \\cdots & x_n^{n-1} \\end{vmatrix} = \\prod_{1 \\leq i < j \\leq n} (x_j - x_i)',
            caption: 'Vandermonde 行列式。其值为所有 (xⱼ−xᵢ) (j>i) 的乘积；当且仅当存在两数相等时行列式为零。',
          },
          {
            type: 'text',
            text: 'Vandermonde 行列式在插值理论、数值分析和系统辨识中极为重要。其简洁的乘积形式使得我们能够快速判定：在 Lagrange 插值中，插值节点互异 ⇔ Vandermonde 行列式非零 ⇔ 插值多项式唯一存在。',
          },
          {
            type: 'text',
            text: '另一个重要的特殊行列式是三对角行列式（在计算 Fibonacci 数列和常微分方程边界值问题中频繁出现），其递推关系为 Dₙ = a·Dₙ₋₁ − bc·Dₙ₋₂，可通过特征方程求解闭式表达式。',
          },
        ],
      },
      {
        title: '行列式的应用',
        content: [
          {
            type: 'heading',
            text: 'Cramer 法则与矩阵可逆判定',
          },
          {
            type: 'text',
            text: '行列式最经典的应用是 Cramer 法则：当系数矩阵 A 的行列式不为零时，n 元线性方程组 Ax=b 有唯一解，且每个未知数可写为行列式的比值。虽然在大规模计算中 Cramer 法则效率不如 Gauss 消元，但它给出了解的闭式表达式，在理论分析中非常有价值。',
          },
          {
            type: 'formula',
            formula: 'x_i = \\frac{|A_i|}{|A|},\\quad A_i \\text{ 是将 } A \\text{ 的第 } i \\text{ 列替换为 } b \\text{ 后得到的矩阵}',
            caption: 'Cramer 法则：用行列式之比表示方程组的唯一解。',
          },
          {
            type: 'text',
            text: '行列式还是判断矩阵可逆的充要条件：方阵 A 可逆当且仅当 det(A) ≠ 0。此时逆矩阵可通过伴随矩阵求得：A⁻¹ = adj(A) / |A|，其中 adj(A) 是由代数余子式构成的伴随矩阵的转置。另一方面，det(A−λI)=0 就是求特征值的特征方程，行列式为零 ⇔ λ 是特征值。',
          },
          {
            type: 'formula',
            formula: 'A^{-1} = \\frac{A^{*}}{|A|} = \\frac{1}{|A|} \\begin{bmatrix} A_{11} & A_{21} & \\cdots & A_{n1} \\\\ A_{12} & A_{22} & \\cdots & A_{n2} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ A_{1n} & A_{2n} & \\cdots & A_{nn} \\end{bmatrix}',
            caption: '由伴随矩阵（代数余子式转置）和行列式构造逆矩阵。注意伴随矩阵中下标的转置。',
          },
          {
            type: 'text',
            text: '在特征值理论中，|A−λI| = (−λ)ⁿ + tr(A)(−λ)ⁿ⁻¹ + … + |A| 被称为特征多项式。这个多项式将行列式和迹（trace）联系在了一起，特征值恰是特征多项式的根。行列式的值等于全体特征值之积，这也是行列式的深刻本质之一。',
          },
        ],
      },
    ],
  },

  rank: {
    sections: [
      {
        title: '秩的定义',
        content: [
          {
            type: 'heading',
            text: '矩阵的秩——有效信息量的度量',
          },
          {
            type: 'text',
            text: '矩阵的秩（rank）是矩阵中最高阶非零子式的阶数。换句话说，在矩阵 A 的所有子方阵中，非零行列式的最高阶数就是 A 的秩，记作 r(A) 或 rank(A)。秩刻画了矩阵中包含的线性无关信息量——秩越大，矩阵携带的有效信息越多。',
          },
          {
            type: 'formula',
            formula: 'r(A) \\;\\leq\\; \\min(m, n)',
            caption: '秩的上界。m×n 矩阵的秩不超过行数和列数的最小值。',
          },
          {
            type: 'text',
            text: '线性代数中有一组重要定理：行秩等于列秩。即矩阵行向量的极大线性无关组所含向量个数，等于列向量极大线性无关组所含向量个数。这个"一致的值"就是我们所定义的秩。证明思路是基于这样一个事实——任何矩阵经过初等变换化为行阶梯形后，非零行的行数既等于行秩也等于列秩。',
          },
          {
            type: 'formula',
            formula: 'r(A) = \\min(m,n) \\;\\Longrightarrow\\; A \\text{ 为满秩矩阵}',
            caption: '满秩矩阵的定义。行满秩：r(A)=m；列满秩：r(A)=n；方阵满秩 ⇔ 可逆 ⇔ det(A)≠0。',
          },
          {
            type: 'text',
            text: '秩是一个"相对粗糙"但极其重要的整数指标。它与解空间维数（n−r）、特征值的零根个数（代数重数）、矩阵分解的低秩近似（奇异值分解）等都有深刻的联系。秩的直观理解是：将矩阵看作一组向量的集合，秩就是这组向量所能张成的子空间的维数。',
          },
        ],
      },
      {
        title: '初等行变换',
        content: [
          {
            type: 'heading',
            text: '三类初等行变换——秩不变量',
          },
          {
            type: 'text',
            text: '初等行变换是矩阵计算中最基本的操作工具。其核心性质是：三类初等行变换均不改变矩阵的秩。这确保了我们可以对矩阵自由地进行行变换化简，而不会丢失任何关于秩的信息。',
          },
          {
            type: 'formula',
            formula: '\\text{类型一：}\\; R_i \\leftrightarrow R_j \\quad \\text{（交换两行）}',
            caption: '交换第 i 行与第 j 行。对应的初等矩阵 E(i,j) 满足 E(i,j)⁻¹ = E(i,j)。',
          },
          {
            type: 'formula',
            formula: '\\text{类型二：}\\; R_i \\rightarrow k R_i \\;\\; (k \\neq 0) \\quad \\text{（某行乘以非零常数）}',
            caption: '将第 i 行所有元素乘以非零常数 k。对应的初等矩阵 E(i(k))。',
          },
          {
            type: 'formula',
            formula: '\\text{类型三：}\\; R_i \\rightarrow R_i + k R_j \\;\\; (i \\neq j) \\quad \\text{（某行加上另一行的倍数）}',
            caption: '将第 j 行的 k 倍加到第 i 行。这是实现消元的核心操作。',
          },
          {
            type: 'text',
            text: '三类初等行变换各自对应一个初等矩阵：左乘初等矩阵等价于进行一次初等行变换。所有初等矩阵均可逆，其逆矩阵也是同类初等矩阵。这一观察说明：每个可逆矩阵都可以分解为有限个初等矩阵的乘积。这也是用初等变换法求逆矩阵（构造增广矩阵 [A|I]）的理论根据。',
          },
        ],
      },
      {
        title: '行阶梯形',
        content: [
          {
            type: 'heading',
            text: '行阶梯形矩阵与简化行阶梯形',
          },
          {
            type: 'text',
            text: '行阶梯形（Row Echelon Form）是高斯消元的目标形态。一个矩阵在行阶梯形下满足两个条件：①非零行都在零行的上方；②每一行的第一个非零元素（称为主元，pivot）在上一行主元的右侧。',
          },
          {
            type: 'formula',
            formula: '\\begin{bmatrix} \\boxed{2} & 3 & 1 & 4 \\\\ 0 & \\boxed{5} & 2 & 1 \\\\ 0 & 0 & 0 & \\boxed{3} \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}',
            caption: '行阶梯形示例（方框标记为主元）。阶梯形状逐行向右移动。非零行数 = 秩 = 3。',
          },
          {
            type: 'text',
            text: '进一步简化为简化行阶梯形（Reduced Row Echelon Form / RREF），在所有非零行中：①每个主元为 1；②每个主元所在列的所有其他元素都为零。也就是说，主元列中只有主元这一个非零元素。RREF 是唯一的（在行变换等价意义下），因此可以当作矩阵的"标准形"。',
          },
          {
            type: 'formula',
            formula: '\\begin{bmatrix} \\boxed{1} & 0 & 2 & 0 \\\\ 0 & \\boxed{1} & 1 & 0 \\\\ 0 & 0 & 0 & \\boxed{1} \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}',
            caption: '简化行阶梯形（RREF）。三个主元为 1，所在列其余元素均为 0。',
          },
          {
            type: 'text',
            text: '在 RREF 中，主元的个数就是秩。基础解系可直接从 RREF 读出：将主元变量用自由变量表示，依次令一个自由变量为 1、其余自由变量为 0，回代即得基础解向量。这也是机器计算线性方程组的标准方法。',
          },
        ],
      },
      {
        title: '高斯消元法',
        content: [
          {
            type: 'heading',
            text: '高斯消元——矩阵化阶的标准流程',
          },
          {
            type: 'text',
            text: '高斯消元法（Gaussian Elimination）是将矩阵化为行阶梯形的标准算法。其基本思想是逐列处理：对于第 k 列，在剩余行中选择绝对值最大的元素作为主元（列主元消元法），通过行交换将其换到第 k 行，然后用该行消去下方所有行中的第 k 列元素。',
          },
          {
            type: 'text',
            text: '以 3×3 矩阵为例，消元过程分为三步：第 1 步——选第 1 列的列主元（假定为 a₁₁），将第 1 行的倍数加到第 2、3 行，消去 a₂₁ 和 a₃₁；第 2 步——在剩余两行的子矩阵中选第 2 列的列主元，将第 2 行的倍数加到第 3 行，消去 a₃₂；第 3 步——矩阵已呈上三角形态，消元完成。',
          },
          {
            type: 'formula',
            formula: '\\begin{bmatrix} 2 & 1 & -1 \\\\ -3 & -1 & 2 \\\\ -2 & 1 & 2 \\end{bmatrix} \\xrightarrow{R_2+\\frac{3}{2}R_1} \\begin{bmatrix} 2 & 1 & -1 \\\\ 0 & \\frac{1}{2} & \\frac{1}{2} \\\\ -2 & 1 & 2 \\end{bmatrix} \\xrightarrow{R_3+R_1} \\begin{bmatrix} 2 & 1 & -1 \\\\ 0 & \\frac{1}{2} & \\frac{1}{2} \\\\ 0 & 2 & 1 \\end{bmatrix}',
            caption: '高斯消元第 1 步：用第 1 行消去第 2、3 行的第 1 列元素。',
          },
          {
            type: 'formula',
            formula: '\\xrightarrow{R_3-4R_2} \\begin{bmatrix} 2 & 1 & -1 \\\\ 0 & \\frac{1}{2} & \\frac{1}{2} \\\\ 0 & 0 & -1 \\end{bmatrix}',
            caption: '高斯消元第 2 步：用第 2 行消去第 3 行的第 2 列元素，得行阶梯形。矩阵的秩 = 3。',
          },
          {
            type: 'text',
            text: '列主元消元（选每列绝对值最大的元素作主元）可以有效抑制数值计算中的舍入误差，是数值线性代数中最常用的策略。最终化简得到的行阶梯形中，非零行的行数即为矩阵的秩。',
          },
        ],
      },
      {
        title: '秩与线性相关性',
        content: [
          {
            type: 'heading',
            text: '秩 = 极大线性无关组的向量个数',
          },
          {
            type: 'text',
            text: '矩阵的行向量组（或列向量组）中，极大线性无关组所含向量的个数恰好等于该矩阵的秩。因此秩直观地回答了"这组向量里最多可以挑出多少个互相线性无关的向量"。行秩 = 列秩 = 矩阵的秩，这个结论连接了行空间和列空间，是线性代数中最优美的对称定理之一。',
          },
          {
            type: 'formula',
            formula: 'r(A) = \\dim(\\text{Col}(A)) = \\dim(\\text{Row}(A)) = \\text{极大线性无关行（列）向量的个数}',
            caption: '秩等于列空间维数和行空间维数。',
          },
          {
            type: 'text',
            text: '秩还揭示了矩阵的许多核心性质：对于方阵 A(n×n)，r(A)=n ⇔ A 可逆 ⇔ A 的行（列）向量线性无关 ⇔ det(A)≠0 ⇔ Ax=b 对任意 b 有唯一解。秩的大小就是矩阵"有用维数"的度量——消除零行后剩下的独立信息量。',
          },
          {
            type: 'text',
            text: '秩在矩阵分解中也举足轻重：秩为 r 的 m×n 矩阵可以分解为 m×r 和 r×n 两个矩阵的乘积（满秩分解）；奇异值分解中非零奇异值的个数就是秩；在矩阵近似中，低秩逼近（如 PCA）正是利用秩来降维。',
          },
        ],
      },
    ],
  },

  matrix: {
    sections: [
      {
        title: '矩阵基本概念',
        content: [
          {
            type: 'heading',
            text: '矩阵——数表与线性变换的双重面貌',
          },
          {
            type: 'text',
            text: '矩阵（matrix）是由 m×n 个数按矩形排列而成的数表。记为 A=(aᵢⱼ)ₘₓₙ，其中 aᵢⱼ 表示第 i 行第 j 列的元素。矩阵既是数据的组织方式，也是线性变换的具体表示——Ax 将向量 x 映射为 A 的列向量的线性组合。',
          },
          {
            type: 'formula',
            formula: 'A = \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{bmatrix}_{m \\times n}',
            caption: 'm 行 n 列矩阵的一般形式。两个矩阵相等 ⇔ 同型（行数列数相同）且对应位置元素全部相等。',
          },
          {
            type: 'text',
            text: '几种特殊的矩阵在理论和应用中经常出现：方阵（m=n）是行列式、特征值讨论的前提；单位阵 I（对角线全 1，其余全 0）是乘法单位元，AI=IA=A；零矩阵（所有元素为 0）是加法零元；对角阵 diag(d₁,…,dₙ) 只有对角元非零，乘法特别简单——缩放每行或每列。',
          },
          {
            type: 'formula',
            formula: 'I_n = \\begin{bmatrix} 1 & 0 & \\cdots & 0 \\\\ 0 & 1 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & 1 \\end{bmatrix}_{n \\times n}',
            caption: 'n 阶单位矩阵 Iₙ。在矩阵乘法中起"数字 1"的作用。',
          },
          {
            type: 'text',
            text: '对称矩阵（Aᵀ=A）、反对称矩阵（Aᵀ=−A）、正交矩阵（AᵀA=I）是三类有特殊结构的方阵。对称矩阵在二次型和谱理论中处于核心地位，其所有特征值都是实数，且可被正交对角化。',
          },
        ],
      },
      {
        title: '矩阵加法与数乘',
        content: [
          {
            type: 'heading',
            text: '加法和数乘——矩阵的线性运算',
          },
          {
            type: 'text',
            text: '矩阵加法与数乘是按元素逐一进行的线性运算。给定两个同型（维数相同）的矩阵 A 和 B，它们的和 C=A+B 定义为对应元素相加：cᵢⱼ = aᵢⱼ + bᵢⱼ。加法要求 A 和 B 具有相同的行数和列数，否则操作无定义。',
          },
          {
            type: 'formula',
            formula: '(A + B)_{ij} = a_{ij} + b_{ij},\\qquad (kA)_{ij} = k \\cdot a_{ij}',
            caption: '矩阵加法与数乘的定义。运算结果仍然是同型矩阵。',
          },
          {
            type: 'text',
            text: '矩阵加法和数乘满足良好的代数性质：加法交换律 A+B=B+A、结合律 (A+B)+C=A+(B+C)、存在零元 0 和负元 −A；数乘满足 1·A=A、(kl)·A=k·(l·A)；两者之间满足分配律 k(A+B)=kA+kB 和 (k+l)A=kA+lA。这使得所有 m×n 矩阵在加法和数乘下构成一个向量空间，记为 Mₘₓₙ(R) 或 R^{m×n}。',
          },
        ],
      },
      {
        title: '矩阵乘法',
        content: [
          {
            type: 'heading',
            text: '乘法——线性变换的复合',
          },
          {
            type: 'text',
            text: '矩阵乘法是线性代数中最核心也最容易出错的操作。给定 A(m×p) 和 B(p×n)，乘积 C=AB 定义为 C 的第 (i,j) 元素是 A 的第 i 行与 B 的第 j 列的逐元素乘积之和。这个定义确保 (AB)x = A(Bx)，即矩阵乘法对应线性变换的复合。',
          },
          {
            type: 'formula',
            formula: '(AB)_{ij} = \\sum_{k=1}^{p} a_{ik} \\; b_{kj}',
            caption: '矩阵乘法的元素定义：A 的第 i 行与 B 的第 j 列的内积。要求 A 的列数 = B 的行数。',
          },
          {
            type: 'text',
            text: '矩阵乘法有四个关键性质值得牢记：①一般不满足交换律 AB≠BA（顺序敏感，仅当 A、B 为可交换的方阵时才可能相等）；②满足结合律 (AB)C=A(BC)（这意味着 Aⁿ 的记号是良定义的）；③满足左、右分配律 A(B+C)=AB+AC 和 (A+B)C=AC+BC；④单位阵是乘法单位元 AI=A, IB=B。',
          },
          {
            type: 'formula',
            formula: 'A_{m \\times p} \\cdot B_{p \\times n} = C_{m \\times n}',
            caption: '矩阵乘法的维数规则：m×p 乘以 p×n 得到 m×n 矩阵。内部列数 p 必须一致。',
          },
          {
            type: 'text',
            text: '矩阵乘法的四种理解视角非常重要：①按元素——行列内积；②按列——AB=A·[b₁|…|bₙ] = [Ab₁|…|Abₙ]，即 B 的列被 A 变换；③按行——AB 的第 i 行是 A 的第 i 行乘 B；④按秩 1 和——AB = ∑ₖ (A 的第 k 列)(B 的第 k 行)ᵀ。灵活切换这四种视点可以极大简化分析和证明。',
          },
        ],
      },
      {
        title: '转置',
        content: [
          {
            type: 'heading',
            text: '转置运算及其代数性质',
          },
          {
            type: 'text',
            text: '矩阵的转置（transpose）是将矩阵的行列互换得到的矩阵。设 A=(aᵢⱼ)ₘₓₙ，则其转置 Aᵀ 定义为 (Aᵀ)ⱼᵢ = aᵢⱼ，即 A 的第 i 行成为 Aᵀ 的第 i 列。转置操作不改变矩阵的大小"总量"，但交换了 m 和 n。',
          },
          {
            type: 'formula',
            formula: '(A^T)_{ij} = a_{ji}',
            caption: '转置定义。原矩阵的元素 aⱼᵢ 变为转置矩阵中第 i 行第 j 列的元素。',
          },
          {
            type: 'formula',
            formula: '(A^T)^T = A, \\quad (A + B)^T = A^T + B^T, \\quad (kA)^T = k A^T, \\quad (AB)^T = B^T A^T',
            caption: '转置的四大运算法则。其中 (AB)ᵀ = BᵀAᵀ 是最重要的公式——注意顺序反转。',
          },
          {
            type: 'text',
            text: '(AB)ᵀ = BᵀAᵀ 被称为"逆序法则"。这一性质的几何解释是：复合线性变换的转置等于各自转置的逆序复合，类似逆矩阵的 (AB)⁻¹ = B⁻¹A⁻¹。对称矩阵 A=Aᵀ 和反对称矩阵 A=−Aᵀ 在后续二次型、特征值的学习中会反复出现。',
          },
        ],
      },
      {
        title: '逆矩阵',
        content: [
          {
            type: 'heading',
            text: '逆矩阵——矩阵的"倒数"',
          },
          {
            type: 'text',
            text: '对于 n 阶方阵 A，若存在方阵 B 使得 AB=BA=I，则称 B 为 A 的逆矩阵，记作 A⁻¹。A 可逆的充要条件是 det(A)≠0。可逆矩阵也称为非奇异矩阵（nonsingular），不可逆则称奇异矩阵（singular）。',
          },
          {
            type: 'formula',
            formula: 'AA^{-1} = A^{-1}A = I_n',
            caption: '逆矩阵的定义等式。注意左右乘同时成立——逆矩阵与 A 可交换。',
          },
          {
            type: 'text',
            text: '求逆矩阵有两种主要方法。伴随矩阵法：A⁻¹ = adj(A) / |A|，其中 adj(A) 是代数余子式矩阵的转置。初等变换法：构造增广矩阵 [A|I]，进行初等行变换，当左边变为 I 时，右边恰好为 A⁻¹。初等变换法更实用，因为不需要计算 n² 个 n−1 阶行列式。',
          },
          {
            type: 'formula',
            formula: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^{-1} = \\frac{1}{ad-bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
            caption: '二阶可逆矩阵的求逆公式。只需交换对角线元素、b 和 c 取反号，再除以行列式 ad−bc。',
          },
          {
            type: 'text',
            text: '逆矩阵的运算法则包括：(A⁻¹)⁻¹=A、(kA)⁻¹=A⁻¹/k、(AB)⁻¹=B⁻¹A⁻¹、(Aᵀ)⁻¹=(A⁻¹)ᵀ。注意 (AB)⁻¹=B⁻¹A⁻¹ 也是逆序法则，与 (AB)ᵀ=BᵀAᵀ 如出一辙。可逆矩阵从线性变换的角度看就是可逆变换（双射、同构），它建立了 Rⁿ 到自身的同构。',
          },
        ],
      },
    ],
  },

  equations: {
    sections: [
      {
        title: '线性方程组的矩阵表示',
        content: [
          {
            type: 'heading',
            text: 'Ax=b —— 线性代数的核心方程',
          },
          {
            type: 'text',
            text: '线性方程组是线性代数最直接的应用形式。含有 m 个方程、n 个未知数的线性方程组可以用矩阵简洁地表示为 Ax=b。其中 A(m×n) 是系数矩阵，x 是 n 维未知向量，b 是 m 维常数向量。将 A 与 b 并排写在一起构成的矩阵 (A|b) 称为增广矩阵，它完整包含了方程组的全部信息。',
          },
          {
            type: 'formula',
            formula: 'A_{m \\times n} \\; x_{n \\times 1} = b_{m \\times 1}',
            caption: '线性方程组的矩阵-向量形式。A 的每一行对应一个方程，x 的每个分量对应一个未知数。',
          },
          {
            type: 'formula',
            formula: '(A|b) = \\left[ \\begin{array}{cccc|c} a_{11} & a_{12} & \\cdots & a_{1n} & b_1 \\\\ a_{21} & a_{22} & \\cdots & a_{2n} & b_2 \\\\ \\vdots & \\vdots & \\ddots & \\vdots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} & b_m \\end{array} \\right]',
            caption: '增广矩阵的构造方法：在系数矩阵右边添加常数向量列，中间用竖线分隔。',
          },
          {
            type: 'text',
            text: '矩阵表示的妙处在于将方程组转化为矩阵语言：Ax=b 可以理解为"b 是否在 A 的列空间 Col(A) 中"。若 b 可以由 A 的列向量线性表出，则方程组有解；否则无解。这一几何视角深刻地统一了方程组的各种解法与理论。',
          },
        ],
      },
      {
        title: '解的判定定理',
        content: [
          {
            type: 'heading',
            text: '秩决定一切——有解性判定',
          },
          {
            type: 'text',
            text: '对于线性方程组 Ax=b，解的存在性和唯一性完全由系数矩阵 A 的秩和增广矩阵 (A|b) 的秩之间的关系决定。这个判定定理被称为"线性方程组的相容性定理"，它用两个简单的整数清楚地划分了三种解的类型。',
          },
          {
            type: 'formula',
            formula: '\\begin{aligned} &\\text{有解 } \\Longleftrightarrow\\; r(A) = r(A|b) \\\\ &\\text{无解 } \\Longleftrightarrow\\; r(A) < r(A|b) \\end{aligned}',
            caption: '有解性条件：当增广矩阵的秩等于系数矩阵的秩时，方程组有解（相容）。',
          },
          {
            type: 'formula',
            formula: '\\begin{aligned} &\\text{唯一解 } \\Longleftrightarrow\\; r(A) = r(A|b) = n \\;\\text{（未知数个数）} \\\\ &\\text{无穷多解 } \\Longleftrightarrow\\; r(A) = r(A|b) < n \\end{aligned}',
            caption: '唯一性条件。秩等于未知数个数时，方程组的"约束"刚好确定每个变量。',
          },
          {
            type: 'text',
            text: '这个判定定理给出了解答"三个问题"的标准流程：①方程组有没有解？——比较 r(A) 与 r(A|b)；②如果有解，是唯一解还是无穷多解？——比较 r(A) 与 n；③如果有解，具体解是什么？——需要高斯消元回代。秩的表现完美地在抽象层面刻画了方程组的内在结构。',
          },
          {
            type: 'text',
            text: '直觉上，r(A) 代表系数矩阵提供的"有效约束"数量。当 r(A)=r(A|b) 时，b 没有引入与 A 冲突的信息——常数向量落在列空间里。而 r(A)<n 意味着约束数量少于未知数个数，系统有 n−r 个自由度等待指定，因此产生无穷多解。',
          },
        ],
      },
      {
        title: '齐次方程组 Ax=0',
        content: [
          {
            type: 'heading',
            text: '齐次方程组——解空间的基石',
          },
          {
            type: 'text',
            text: '当常数向量 b=0 时，方程组 Ax=0 称为齐次线性方程组。齐次方程组有一个永远存在的解——全零向量（零解）。是否有非零解取决于 r(A) 是否小于 n：若 r(A)=n（A 列满秩），只有零解；若 r(A)<n，则存在 n−r(A) 维的非零解空间（零空间 N(A)）。',
          },
          {
            type: 'formula',
            formula: '\\text{有非零解 } \\Longleftrightarrow\\; r(A) < n \\;\\Longleftrightarrow\\; \\text{方阵情形：} |A| = 0',
            caption: '齐次方程组有非零解的充要条件。方阵时等价于行列式为零。',
          },
          {
            type: 'text',
            text: '齐次方程组的解空间是一个过原点的子空间（因为零向量总是解，且解的和与数乘仍是解）。这个子空间就是 A 的零空间 N(A)={x: Ax=0}。基础解系正是这个子空间的一组基。齐次方程组的重要性在于：非齐次方程组 Ax=b 的通解 = 一个特解 + N(A) 中的所有向量。',
          },
          {
            type: 'formula',
            formula: '\\dim N(A) = n - r(A)',
            caption: '秩-零化度定理。零空间的维数等于未知数个数减去矩阵的秩。这是线性代数中的基本维数公式。',
          },
        ],
      },
      {
        title: '解的结构',
        content: [
          {
            type: 'heading',
            text: '非齐次方程组——特解 + 齐次通解',
          },
          {
            type: 'text',
            text: '非齐次方程组 Ax=b 的解具有优美的叠加结构。设 x* 是 Ax=b 的任意一个特解（即满足 Ax*=b 的某个具体解），η 是齐次方程组 Ax=0 的通解（即零空间中的任意向量），则 Ax=b 的通解就是 x*+η。这意味着非齐次方程组的解集是齐次解空间经过平移得到的"仿射子空间"。',
          },
          {
            type: 'formula',
            formula: 'x = x^{*} + c_1\\xi_1 + c_2\\xi_2 + \\cdots + c_{n-r}\\xi_{n-r}',
            caption: '非齐次方程组的通解公式。cᵢ 为任意常数，ξᵢ 为基础解向量，r 为 r(A)。',
          },
          {
            type: 'text',
            text: '几何上说，如果 A 是 m×n 矩阵把 Rⁿ 映射到 Rᵐ，则每一个 b 的原像（preimage）要么为空集，要么是 N(A) 的一个陪集。N(A) 决定了"解的自由度"，而特解 x* 决定了这个仿射子空间"在 Rⁿ 中的位置"。',
          },
        ],
      },
      {
        title: 'Gauss 消元法求解',
        content: [
          {
            type: 'heading',
            text: '从增广矩阵到最终答案——完整求解',
          },
          {
            type: 'text',
            text: '使用 Gauss 消元法求解 Ax=b 的标准流程分为三个阶段：①构造增广矩阵 (A|b)；②对增广矩阵进行初等行变换，化为行阶梯形（或简化行阶梯形）；③根据行阶梯形判断解的类型，然后回代（或从 RREF 直接读出解）。',
          },
          {
            type: 'text',
            text: '以方程组 2x₁+x₂−x₃=8, x₁−x₂+x₃=−1, 3x₁=9 为例。首先写出增广矩阵，然后通过行变换逐步消元。注意先写增广矩阵时系数矩阵和常数列要同时参与行变换，这保证了变换后的矩阵与原方程组等价。',
          },
          {
            type: 'formula',
            formula: '(A|b) = \\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ 1 & -1 & 1 & -1 \\\\ 3 & 0 & 0 & 9 \\end{array}\\right] \\xrightarrow{R_1 \\leftrightarrow R_2} \\left[\\begin{array}{ccc|c} 1 & -1 & 1 & -1 \\\\ 2 & 1 & -1 & 8 \\\\ 3 & 0 & 0 & 9 \\end{array}\\right]',
            caption: '先交换第 1 行和第 2 行（前 3 列是系数矩阵，最后一列是常数向量；第一行归一化后消第2行和第3行）。',
          },
          {
            type: 'formula',
            formula: '\\xrightarrow{R_2-2R_1,\\; R_3-3R_1} \\left[\\begin{array}{ccc|c} 1 & -1 & 1 & -1 \\\\ 0 & 3 & -3 & 10 \\\\ 0 & 3 & -3 & 12 \\end{array}\\right] \\xrightarrow{R_3-R_2} \\left[\\begin{array}{ccc|c} 1 & -1 & 1 & -1 \\\\ 0 & 3 & -3 & 10 \\\\ 0 & 0 & 0 & 2 \\end{array}\\right]',
          },
          {
            type: 'formula',
            formula: '\\Longrightarrow\\; r(A)=2,\\; r(A|b)=3 \\;\\Longrightarrow\\; r(A) < r(A|b) \\;\\Longrightarrow\\; \\text{无解}',
            caption: '最后一行对应方程 0·x₁+0·x₂+0·x₃=2，矛盾！因此原方程组无解。注意：换一个b时可能有解或其他类型。',
          },
          {
            type: 'text',
            text: '若换一组常数项 b 使 r(A)=r(A|b)=3=n，则可将行阶梯形进一步化为简化行阶梯形（RREF），直接读出唯一解。若 r(A)=r(A|b)<n，则从 RREF 中读出基础解系和特解，构造成通解形式。',
          },
        ],
      },
    ],
  },

  'basic-solutions': {
    sections: [
      {
        title: '齐次方程组与解空间',
        content: [
          {
            type: 'heading',
            text: '零空间 N(A)——Ax=0 的解子空间',
          },
          {
            type: 'text',
            text: '齐次线性方程组 Ax=0 的全部解构成 Rⁿ 的子空间，称为 A 的零空间（null space），记作 N(A) 或 Null(A)。这个空间是"闭环"——任意两个解的和仍是解，任意解的标量倍仍是解（向量空间的两条基本公理）。零向量永远属于 N(A)，因此这是一个过原点的子空间。',
          },
          {
            type: 'formula',
            formula: 'N(A) = \\{ x \\in \\mathbb{R}^n \\;|\\; Ax = 0 \\}',
            caption: '零空间 N(A) 的定义。它是齐次方程组 Ax=0 的所有解向量的集合。',
          },
          {
            type: 'text',
            text: '秩-零化度定理（Rank-Nullity Theorem）揭示了零空间维数与秩之间的互补关系：dim N(A) = n − r(A)。其中 n 是未知数个数（A 的列数），r(A) 是 A 的秩。直观理解：A 的 r 行线性无关约束占用了 r 个自由度，剩余 n−r 个自由度构成解空间。',
          },
          {
            type: 'formula',
            formula: '\\dim N(A) = n - r(A)',
            caption: '秩-零化度定理。零空间维数 = 未知数个数 − 系数矩阵的秩。',
          },
          {
            type: 'text',
            text: 'N(A) 的维数恰好等于方程组中"自由变量"的个数。在高斯消元化为 RREF 后，对应主元列的变量称为主元变量（被约束），其余变量称为自由变量（可任取）。自由变量的个数就是 n−r(A)，它们决定了零空间的维数。',
          },
        ],
      },
      {
        title: '基础解系定义',
        content: [
          {
            type: 'heading',
            text: '基础解系——解空间的一组基底',
          },
          {
            type: 'text',
            text: '零空间 N(A) 的一组基称为齐次方程组的基础解系。基础解系中的向量是线性无关的，且它们的线性组合能表示出所有解。基础解系的作用类似欧氏空间中的标准正交基——只是此处的"空间"是零空间 N(A)。',
          },
          {
            type: 'formula',
            formula: '\\text{通解} = c_1\\xi_1 + c_2\\xi_2 + \\cdots + c_{n-r}\\xi_{n-r}, \\quad c_i \\in \\mathbb{R}',
            caption: '由基础解系 ξ₁, ξ₂, …, ξₙ₋ᵣ 表示的通解形式。每个 cᵢ 都可自由取任意实数。',
          },
          {
            type: 'text',
            text: '基础解系中向量的个数必定等于 n−r(A)，这既是秩-零化度定理的结论也是基础解系的定义要求。每个基础解向量对应一个自由变量依次取 1、其余自由变量取 0 时的解向量。这样构造出的 n−r(A) 个向量自动互为线性无关，且恰好张成整个 N(A)。',
          },
          {
            type: 'formula',
            formula: '\\{\\xi_1, \\xi_2, \\dots, \\xi_{n-r}\\} \\;\\text{是 N(A) 的极大线性无关组}',
            caption: '基础解系 = 零空间的极大线性无关组。它含 n−r(A) 个向量。',
          },
        ],
      },
      {
        title: '求解步骤',
        content: [
          {
            type: 'heading',
            text: '从矩阵到基础解系——五步法',
          },
          {
            type: 'text',
            text: '求基础解系是解齐次方程组的核心技能。以 A(3×4) 为例，完整步骤为：步骤一，将 A 通过初等行变换化为简化行阶梯形（RREF）；步骤二，确定主元列和自由变量对应的列；步骤三，将自由变量移到等式右边；步骤四，依次令一个自由变量为 1、其余自由变量为 0；步骤五，对每组赋值回代求出主元变量的值，得到基础解向量。',
          },
          {
            type: 'formula',
            formula: 'A = \\begin{bmatrix} 1 & 2 & 2 & -1 \\\\ 2 & 4 & 4 & -2 \\\\ 3 & 6 & 6 & -3 \\end{bmatrix} \\xrightarrow{\\text{行变换}} \\begin{bmatrix} 1 & 2 & 2 & -1 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix} \\quad (\\text{RREF})',
            caption: '3×4 矩阵化为简化行阶梯形。秩为 1，自由变量有 3 个（x₂, x₃, x₄），基础解系含 3 个向量。',
          },
          {
            type: 'formula',
            formula: '\\begin{aligned} x_1 &= -2x_2 - 2x_3 + x_4 \\\\ \\xi_1 &= \\begin{bmatrix} -2 \\\\ 1 \\\\ 0 \\\\ 0 \\end{bmatrix},\\; \\xi_2 = \\begin{bmatrix} -2 \\\\ 0 \\\\ 1 \\\\ 0 \\end{bmatrix},\\; \\xi_3 = \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 1 \\end{bmatrix} \\end{aligned}',
            caption: '由 RREF 读出 x₁ = −2x₂−2x₃+x₄。分别令 (x₂,x₃,x₄) 为 (1,0,0)、(0,1,0)、(0,0,1)，回代得三个基础解向量。通解为 x=c₁ξ₁+c₂ξ₂+c₃ξ₃。',
          },
          {
            type: 'text',
            text: '需注意：当某一行变为全零时，说明该方程是冗余的（可以由其他方程线性组合得出），它不对未知数施加独立约束。非零行的行数 = r(A)，决定了约束的数量。若 A 本身是方阵且 r(A)=n，则 N(A)={0}，齐次方程组只有零解，基础解系为空。',
          },
        ],
      },
      {
        title: '解的几何意义',
        content: [
          {
            type: 'heading',
            text: '低维空间中的几何直观',
          },
          {
            type: 'text',
            text: '当 n=3 时，解空间的几何形态十分直观。N(A) 的维数决定了它是 R³ 中的一个点、一条直线、一个平面，还是整个 R³。维数越高，解空间越大，"约束"越弱。',
          },
          {
            type: 'text',
            text: 'r(A)=3（满秩）时，N(A)={0}，解空间是原点——零向量孤立，所有变量被约束住；r(A)=2 时，dim N(A)=1，解空间是过原点的一条直线——有一个自由度，所有解向量共线；r(A)=1 时，dim N(A)=2，解空间是过原点的一个平面——有两个自由度，解向量充满整个二维平面；r(A)=0（A 是零矩阵）时，dim N(A)=3，解空间是整个 R³——没有约束，任意向量都是解。',
          },
          {
            type: 'formula',
            formula: '\\begin{aligned} r(A)=3 &: \\; N(A) = \\{\\mathbf{0}\\} \\;\\text{（原点）} \\\\ r(A)=2 &: \\; N(A) \\text{ 是一条过原点的直线} \\\\ r(A)=1 &: \\; N(A) \\text{ 是一个过原点的平面} \\\\ r(A)=0 &: \\; N(A) = \\mathbb{R}^3 \\;\\text{（全空间）} \\end{aligned}',
            caption: 'n=3 时零空间的四种可能形态。秩越大，约束越强，解空间越小。',
          },
        ],
      },
    ],
  },

  eigen: {
    sections: [
      {
        title: '特征值与特征向量的定义',
        content: [
          {
            type: 'heading',
            text: 'Av=λv —— 方向不变的变换',
          },
          {
            type: 'text',
            text: '给定 n 阶方阵 A，若存在非零向量 v 和标量 λ 满足 Av=λv，则称 λ 为 A 的一个特征值（eigenvalue），v 为属于 λ 的特征向量（eigenvector）。几何语言说：经过矩阵 A 表示的线性变换后，特征向量 v 的方向保持不变，仅仅长度被缩放了 λ 倍。',
          },
          {
            type: 'formula',
            formula: 'A v = \\lambda v, \\qquad v \\neq \\mathbf{0}',
            caption: '特征方程的定义。Av 是 A 作用于 v 的结果，λv 是将 v 缩放 λ 倍。两者相等说明 λ 是"方向不变的缩放因子"。',
          },
          {
            type: 'text',
            text: '如果 λ>0，特征向量的方向不变（正缩放）；λ<0，特征向量反向（负缩放）；λ=0，特征向量被压缩到零向量（降维）。复杂情形：λ 为复数表示该特征方向伴随着旋转。特征值和特征向量像是矩阵的"DNA"——它们揭示了这个线性变换在最本质方向上的行为。',
          },
          {
            type: 'formula',
            formula: '\\text{若 } Av = \\lambda v \\text{，则 } A^k v = \\lambda^k v',
            caption: '特征向量的一个重要推论：矩阵的幂作用在特征向量上就是特征值的幂。这让矩阵幂的计算在大规模问题中变得简单。',
          },
        ],
      },
      {
        title: '特征多项式',
        content: [
          {
            type: 'heading',
            text: '|A−λI|=0 —— 寻找特征值',
          },
          {
            type: 'text',
            text: '将特征方程 Av=λv 改写为 (A−λI)v=0，因为 v≠0，齐次方程组有非零解意味着 det(A−λI)=0。展开此行列式得到关于 λ 的 n 次多项式，称为特征多项式。特征值 λ 就是这个 n 次方程的根。',
          },
          {
            type: 'formula',
            formula: '\\det(A - \\lambda I) = \\begin{vmatrix} a_{11}-\\lambda & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22}-\\lambda & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{n1} & a_{n2} & \\cdots & a_{nn}-\\lambda \\end{vmatrix} = 0',
            caption: '特征多项式（特征方程）。在行列式中将每个主对角线元素减去 λ 后计算行列式，展成 λ 的 n 次多项式。',
          },
          {
            type: 'text',
            text: 'n 阶方阵恰好有 n 个特征值（在复数域中计算重数）。若 λ₀ 作为根以 k 次出现（含因式 (λ−λ₀)ᵏ），称 λ₀ 的代数重数为 k。实际应用中，实对称矩阵的特征值全是实数，这大大简化了分析。',
          },
          {
            type: 'text',
            text: '特征多项式的各项系数与矩阵的诸不变量有密切联系：λⁿ⁻¹ 项系数为 −tr(A)（迹的相反数）；常数项为 (−1)ⁿ|A|；所有系数都可表示为顺序主子式的交替和。这解释了为什么迹和行列式就是特征值的和与积。',
          },
        ],
      },
      {
        title: '特征向量的求法',
        content: [
          {
            type: 'heading',
            text: '(A−λI)v=0 —— 对每个特征值解齐次方程',
          },
          {
            type: 'text',
            text: '求得特征值 λ₀ 后，属于 λ₀ 的特征向量通过解齐次方程 (A−λ₀I)v=0 获得。这本质上是求矩阵 A−λ₀I 的零空间 N(A−λ₀I)，也称为特征子空间（eigenspace）。特征子空间的维数称为 λ₀ 的几何重数。',
          },
          {
            type: 'formula',
            formula: '(A - \\lambda_0 I) v = 0 \\;\\Longrightarrow\\; \\text{其基础解系即为属于 } \\lambda_0 \\text{ 的特征向量}',
            caption: '求特征向量的方法：对每个特征值 λ₀ 求解齐次方程 (A−λ₀I)v=0，其基础解系就是特征子空间的一组基。',
          },
          {
            type: 'text',
            text: '一个重要关系是：几何重数 ≤ 代数重数。当所有特征值的几何重数都等于各自的代数重数时，矩阵可以对角化。若某个特征值的几何重数 < 代数重数，矩阵只能化为 Jordan 标准型，无法对角化。特征子空间的所有向量（除零向量外）都是特征向量，这意味特征向量不是唯一的——任何一个非零标量倍仍是特征向量。',
          },
          {
            type: 'text',
            text: '在求得属于不同特征值的特征向量后，一个重要结论是：属于不同特征值的特征向量一定线性无关。这为对角化条件的讨论奠定了基础：若有 n 个不同的特征值，则对应有 n 个线性无关的特征向量，矩阵必然可对角化。',
          },
        ],
      },
      {
        title: '迹与行列式',
        content: [
          {
            type: 'heading',
            text: '特征值的和与积 —— 矩阵的两个标量指纹',
          },
          {
            type: 'text',
            text: '矩阵的两个最重要的标量——迹（trace）和行列式——可以通过特征值直接表达。这一观察将特征值理论、行列式理论和迹联系了起来，极大地丰富了我们对矩阵的理解。',
          },
          {
            type: 'formula',
            formula: '\\sum_{i=1}^{n} \\lambda_i = \\operatorname{tr}(A) = a_{11} + a_{22} + \\cdots + a_{nn}',
            caption: '所有特征值之和等于矩阵的迹（主对角线元素之和）。注意特征值要计及重数。',
          },
          {
            type: 'formula',
            formula: '\\prod_{i=1}^{n} \\lambda_i = |A|',
            caption: '所有特征值之积等于矩阵的行列式。同样需要计及重数（包括复数特征值）。',
          },
          {
            type: 'text',
            text: '这两个公式有直观的几何含义：迹是所有特征方向上的拉伸因子之和（总拉伸），行列式是所有特征方向上拉伸因子的乘积（体积缩放）。进一步地，特征多项式可以通过这 n 个特征值完全确定：p(λ) = (λ₁−λ)(λ₂−λ)…(λₙ−λ)，展开系数由特征值的初等对称多项式给出。',
          },
          {
            type: 'text',
            text: '这个结论还提供了一个便捷的验证方法：计算完特征值后，检查它们的和与积是否分别等于迹和行列式，可快速发现计算错误。例如对于 A=[[2,1],[0,3]]，tr(A)=5, |A|=6，特征值应为 2 和 3，和=5、积=6，验证正确。',
          },
        ],
      },
      {
        title: '相似矩阵的特征值',
        content: [
          {
            type: 'heading',
            text: '相似不改变特征值——矩阵的"本质类"',
          },
          {
            type: 'text',
            text: '若 B=P⁻¹AP，即 A 与 B 相似，则 A 与 B 的特征值全等（计算重数）。因为特征多项式在相似变换下不变：det(B−λI)=det(P⁻¹AP−λI)=det(P⁻¹(A−λI)P)=det(P⁻¹)·det(A−λI)·det(P)=det(A−λI)。',
          },
          {
            type: 'formula',
            formula: 'A \\sim B \\;\\Longrightarrow\\; \\lambda(A) = \\lambda(B)',
            caption: '相似矩阵具有相同的特征值。迹、行列式、秩也相同。这就是为什么相似变换是"等价关系"。',
          },
          {
            type: 'text',
            text: '这意味着特征值、迹和行列式都是相似不变量——它们在某类互相相似的矩阵中保持不变。对角化的本质就是找一个与原矩阵相似的对角矩阵，其对角元即为特征值。若 A 可对角化为 D=diag(λ₁,…,λₙ)，则 A∼D，它们的特征值完全一致。',
          },
          {
            type: 'text',
            text: '特别地，实对称矩阵的所有特征值都是实数。而且属于不同特征值的特征向量互相正交。这一性质使得对称矩阵不仅可相似对角化，还可用正交矩阵对角化（A=QΛQᵀ，其中 Q 为正交矩阵）。这为后续的正交变换法化二次型为标准型打下了基础。',
          },
        ],
      },
    ],
  },

  'similar-diagonal': {
    sections: [
      {
        title: '相似矩阵',
        content: [
          {
            type: 'heading',
            text: 'B=P⁻¹AP —— 换个基底看同一个变换',
          },
          {
            type: 'text',
            text: '矩阵相似（similarity）是线性变换在不同基底下表示之间的关系。若存在可逆矩阵 P 使 B=P⁻¹AP，则称 B 与 A 相似，记作 A∼B。相似关系的几何本质是：同一个线性变换在不同基底下的矩阵表示互为相似。',
          },
          {
            type: 'formula',
            formula: 'B = P^{-1} A P',
            caption: '相似变换公式。P 是基底变换矩阵（列向量为新基在旧基下的坐标）。',
          },
          {
            type: 'text',
            text: '相似是一个等价关系：①反身性：A∼A（取 P=I）；②对称性：A∼B ⇒ B∼A（取 P⁻¹ 替换 P）；③传递性：A∼B 且 B∼C ⇒ A∼C。正是这种等价关系使得"特征值的集合"成为一个相似不变量。相似矩阵还共享相同的秩、迹、行列式和特征多项式，这是相似关系最实用的特征。',
          },
        ],
      },
      {
        title: '可对角化的充要条件',
        content: [
          {
            type: 'heading',
            text: '何时能对角化？—— 四个等价表述',
          },
          {
            type: 'text',
            text: 'n 阶方阵 A 若相似于某个对角矩阵，则称 A 可对角化。对角化的本质是将原矩阵 P⁻¹AP 转化为对角矩阵 diag(λ₁,…,λₙ)。要达到这一目标，矩阵必须满足特定的条件。',
          },
          {
            type: 'formula',
            formula: 'A \\text{ 可对角化 } \\Longleftrightarrow\\; A \\text{ 有 } n \\text{ 个线性无关的特征向量}',
            caption: '核心等价条件。线性无关的特征向量数量必须等于矩阵的阶。',
          },
          {
            type: 'formula',
            formula: '\\Longleftrightarrow\\; \\text{对每个特征值 } \\lambda,\\; \\text{几何重数} = \\text{代数重数}',
            caption: '用几何重数和代数重数表述的条件。每个特征值都要"贡献"足够多的独立特征向量。',
          },
          {
            type: 'text',
            text: '几个充分条件可以帮助快速判断：①若有 n 个互异的特征值，则一定可对角化（属于不同特征值的特征向量自动线性无关）；②实对称矩阵一定可对角化，且可被正交矩阵对角化；③若矩阵的极小多项式没有重根，则矩阵可对角化（这一点超出了本科生课程范围，但很实用）。',
          },
          {
            type: 'text',
            text: '不可对角化的情况发生在：某个特征值的代数重数大于其几何重数。这意味着 (A−λI)v=0 的解空间维数（即线性无关的特征向量个数）小于该特征值的根重数，"特征向量不够用"。这时矩阵只能化为 Jordan 标准型。',
          },
        ],
      },
      {
        title: '对角化步骤',
        content: [
          {
            type: 'heading',
            text: '构造对角化的四步法',
          },
          {
            type: 'text',
            text: '对角化矩阵的标准程序分为四步：第一步——求解特征方程 |A−λI|=0，得到特征值 λ₁, λ₂, …, λₙ（含重数）；第二步——对每个特征值 λᵢ 求解齐次方程 (A−λᵢI)v=0，得到一组线性无关的特征向量；第三步——将所有特征向量按列拼成矩阵 P（顺序与特征值一致）；第四步——写出对角矩阵 D = diag(λ₁,…,λₙ)，验证 P⁻¹AP = D。',
          },
          {
            type: 'formula',
            formula: 'P = \\begin{bmatrix} v_1 & v_2 & \\cdots & v_n \\end{bmatrix}, \\qquad D = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\dots, \\lambda_n)',
            caption: 'P 以特征向量为列，D 以特征值为对角元。两者一一对应——P 第 i 列的特征向量对应 D 第 i 个对角元。',
          },
          {
            type: 'text',
            text: '对角化成功的本质是 A·P = P·D，即 A 乘上第 i 个特征向量等于 λᵢ 乘上该向量，这恰好是特征方程 Avᵢ=λᵢvᵢ 的计算。P 的可逆性由特征向量的线性无关性保证。求 P⁻¹ 时可使用 (P|I)→(I|P⁻¹) 的初等行变换法。',
          },
        ],
      },
      {
        title: '具体例子',
        content: [
          {
            type: 'heading',
            text: '完整对角化——以 2×2 矩阵为例',
          },
          {
            type: 'text',
            text: '以矩阵 A=[[1,2],[3,2]] 为例完整演示对角化过程。首先计算特征多项式：|A−λI|=|[[1−λ,2],[3,2−λ]]| = (1−λ)(2−λ)−6 = λ²−3λ−4 = (λ−4)(λ+1)，特征值为 λ₁=4, λ₂=−1。',
          },
          {
            type: 'formula',
            formula: 'A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 2 \\end{bmatrix}',
            caption: '待对角化的矩阵 A。',
          },
          {
            type: 'formula',
            formula: '\\lambda_1 = 4: \\; (A-4I)v = \\begin{bmatrix} -3 & 2 \\\\ 3 & -2 \\end{bmatrix}v = 0 \\;\\Longrightarrow\\; v_1 = \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix}',
            caption: '属于特征值 4 的特征向量。由方程 −3x+2y=0 得 x=2y/3，取 y=3 得 x=2。',
          },
          {
            type: 'formula',
            formula: '\\lambda_2 = -1: \\; (A+I)v = \\begin{bmatrix} 2 & 2 \\\\ 3 & 3 \\end{bmatrix}v = 0 \\;\\Longrightarrow\\; v_2 = \\begin{bmatrix} -1 \\\\ 1 \\end{bmatrix}',
            caption: '属于特征值 −1 的特征向量。由方程 2x+2y=0 得 x=−y，取 y=1 得 x=−1。',
          },
          {
            type: 'formula',
            formula: 'P = \\begin{bmatrix} 2 & -1 \\\\ 3 & 1 \\end{bmatrix}, \\quad D = \\begin{bmatrix} 4 & 0 \\\\ 0 & -1 \\end{bmatrix}, \\quad P^{-1}AP = D',
            caption: '对角化结果。P 以 v₁, v₂ 为列，D 以 λ₁, λ₂ 为对角元。验证：P⁻¹ = [[1/5,1/5],[−3/5,2/5]]，代入 P⁻¹AP 得 D。',
          },
        ],
      },
      {
        title: '不可对角化的情况',
        content: [
          {
            type: 'heading',
            text: 'Jordan 标准型简介',
          },
          {
            type: 'text',
            text: '并非所有方阵都可以对角化。当某个特征值的代数重数大于其几何重数时，矩阵不可对角化。典型例子：A = [[2,1],[0,2]]，特征值 λ=2（代数重数 2），但解 (A−2I)v=0 只能得到一个线性无关的特征向量 v=[1,0]ᵀ，几何重数=1<2。',
          },
          {
            type: 'formula',
            formula: 'A = \\begin{bmatrix} 2 & 1 \\\\ 0 & 2 \\end{bmatrix} \\;\\Longrightarrow\\; \\text{不可对角化，其 Jordan 标准型为 } J = \\begin{bmatrix} 2 & 1 \\\\ 0 & 2 \\end{bmatrix}',
            caption: 'Jordan 块示例。对角元为特征值，超对角元为 1（称为幂零块）。每个特征值对应一个或多个 Jordan 块。',
          },
          {
            type: 'text',
            text: 'Jordan 标准型定理保证：任何复方阵都相似于其 Jordan 标准型——一个由 Jordan 块构成的分块对角矩阵。对角化是 Jordan 标准型的特殊情形，即所有 Jordan 块都是 1×1 的。非对称矩阵可能出现复数特征值（成对共轭），这也属于不可实对角化但可复对角化的情况。',
          },
          {
            type: 'text',
            text: '在实际应用（如微分方程式系统、控制理论）中，Jordan 块的大小与广义特征向量的阶数相关联，决定了系统解的形态。虽然 Jordan 型比对角化要复杂，但它在数学理论上填补了完备性——证明了任意方阵都可以被"最接近对角"的形式表示。',
          },
        ],
      },
    ],
  },

  'contract-diagonal': {
    sections: [
      {
        title: '合同变换',
        content: [
          {
            type: 'heading',
            text: 'CᵀAC —— 对称矩阵的保持者',
          },
          {
            type: 'text',
            text: '合同变换（congruence transformation）是指对矩阵 A 左乘 Cᵀ、右乘 C 的操作，得到 B=CᵀAC，称 B 与 A 合同。合同变换只对实对称矩阵讨论才有意义，因为对称性在合同变换下保持：若 A=Aᵀ，则 Bᵀ = (CᵀAC)ᵀ = CᵀAᵀ(Cᵀ)ᵀ = CᵀAC = B。',
          },
          {
            type: 'formula',
            formula: 'B = C^T A C, \\quad A = A^T \\;\\Longrightarrow\\; B = B^T',
            caption: '合同变换保持对称性。这是合同变换讨论实对称矩阵自然的原因。',
          },
          {
            type: 'text',
            text: '合同关系也是等价关系（自反、对称、传递）。合同不保持特征值，但保持两个重要的整数值——正惯性指数 p 和负惯性指数 q（惯性定理的核心结论）。合同变换对应于二次型作非退化的变量替换——C 就是替换矩阵。',
          },
          {
            type: 'formula',
            formula: 'A \\stackrel{\\text{合同}}{\\sim} B \\;\\Longrightarrow\\; r(A)=r(B),\\; p(A)=p(B),\\; q(A)=q(B)',
            caption: '合同不变量：秩、正惯性指数 p、负惯性指数 q。p+q=r(A)。',
          },
        ],
      },
      {
        title: '惯性定理',
        content: [
          {
            type: 'heading',
            text: '实对称矩阵的合同标准形',
          },
          {
            type: 'text',
            text: '惯性定理（Sylvester惯性定律）是合同对角化的核心定理：任何实对称矩阵 A 合同于唯一的规范形 diag(1,…,1,−1,…,−1,0,…,0)。其中 1 的个数 p 称为正惯性指数，−1 的个数 q 称为负惯性指数。惯性指数是合同不变量。',
          },
          {
            type: 'formula',
            formula: 'C^T A C = \\begin{bmatrix} I_p & 0 & 0 \\\\ 0 & -I_q & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}',
            caption: '合同规范形。前 p 个对角元为 1，接着 q 个为 −1，最后 n−r 个为 0（其中 r=p+q=r(A)）。',
          },
          {
            type: 'text',
            text: '惯性定理的证明思想：任何实对称矩阵 A 可通过 Gauss 消元（同时对行和列做相同的初等操作）化为对角形 diag(d₁,…,dₙ)，再通过缩放将每个非零对角元变成 ±1——正对角元变为 1，负对角元变为 −1。正、负元素的个数 p 和 q 是唯一的，不依赖于具体的变换路径。',
          },
          {
            type: 'formula',
            formula: 'p = \\#\\{\\lambda_i > 0\\}, \\qquad q = \\#\\{\\lambda_i < 0\\}',
            caption: '惯性指数与特征值的关系：p 等于正特征值的个数，q 等于负特征值的个数（计算重数）。',
          },
          {
            type: 'text',
            text: '惯性定理在二次型分类中起关键作用：正定二次型 ⇔ p=n（全正特征值）；负定 ⇔ q=n；不定 ⇔ p>0 且 q>0。正定性的判定可以通过特征值全正或顺序主子式全正（Hurwitz判别法）来完成。',
          },
        ],
      },
      {
        title: '合同对角化方法',
        content: [
          {
            type: 'heading',
            text: '合同对角化的操作细节',
          },
          {
            type: 'text',
            text: '合同对角化采用"同时做相同的行和列变换"的策略。若对矩阵 A 的某行做了一个初等操作，必须同时对相应列做同样的操作，这样才能保证对称性不变。即：如果先做行变换 Rᵢ→Rᵢ+kRⱼ，接着一定要做列变换 Cᵢ→Cᵢ+kCⱼ。',
          },
          {
            type: 'text',
            text: '实际操作中最常用的方法是用 Lagrange 配方法：看对角元，如果 a₁₁≠0，就将第一列（行）消成 (d₁,0,…,0)ᵀ，然后递归处理右下角子块。如果 a₁₁=0 但 aᵢᵢ≠0，交换行列使非零对角元移到首位。如果所有对角元为零，就找非对角元 aᵢⱼ≠0，通过变换 xᵢ→xᵢ+xⱼ 或类似方式引入非零对角元。',
          },
          {
            type: 'formula',
            formula: '\\text{行变换 } R_i \\rightarrow R_i + k R_j \\;\\Longrightarrow\\; \\text{紧接列变换 } C_i \\rightarrow C_i + k C_j',
            caption: '合同对角化的核心约束：行变换后必须立即做对应的列变换（双层同构操作）。',
          },
          {
            type: 'text',
            text: '最后化对角元为 1、−1 或 0：对其非零对角元 dᵢ，除以 √|dᵢ| 即可。若 dᵢ>0，缩放后变为 1；dᵢ<0，缩放后变为 −1。所有操作的行列双重性确保了合同等价性和惯性指数的保持。',
          },
        ],
      },
      {
        title: '与相似对角化的比较',
        content: [
          {
            type: 'heading',
            text: '相似 vs 合同 —— 两种对角化的区别与联系',
          },
          {
            type: 'text',
            text: '相似对角化（P⁻¹AP）和合同对角化（CᵀAC）是两个不同的概念，但在实对称矩阵的特殊情形下它们可以统一。相似变换保持特征值、合同变换保持惯性指数。合同比相似"更弱"——合同不保持特征值的具体数值，只保持符号模式。',
          },
          {
            type: 'formula',
            formula: '\\begin{aligned} \\text{相似: }& P^{-1}AP = \\Lambda = \\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n) \\;\\;\\text{（特征值不变）} \\\\ \\text{合同: }& C^TAC = \\operatorname{diag}(\\pm1,\\dots,\\pm1,0) \\;\\;\\text{（惯性指数不变）} \\end{aligned}',
            caption: '两种对角化的对比。相似对角化对角元是特征值，合同规范形对角元是 ±1 或 0。',
          },
          {
            type: 'text',
            text: '对于实对称矩阵 A，存在正交矩阵 Q 使得 QᵀAQ = Q⁻¹AQ = diag(λ₁,…,λₙ)。这里 Qᵀ=Q⁻¹，所以正交变换既是相似变换也是合同变换——同时保持了特征值和惯性指数。这一双重性质使得正交对角化成为对称矩阵分析中最强大的工具，也是后续二次型正交变换法的理论基础。',
          },
        ],
      },
    ],
  },

  'quadratic-form': {
    sections: [
      {
        title: '二次型的概念',
        content: [
          {
            type: 'heading',
            text: 'xᵀAx —— 二次型的矩阵语言',
          },
          {
            type: 'text',
            text: '二次型（quadratic form）是 n 元二次齐次多项式。对于变量 x=(x₁,…,xₙ)ᵀ，n 元二次型可以写作 xᵀAx 的形式，其中 A 是 n 阶实对称矩阵。给定一个二次型，其矩阵表示 A 是唯一的——A 的第 (i,j) 元素 aᵢⱼ 等于 xᵢxⱼ 系数的一半（当 i≠j 时）。',
          },
          {
            type: 'formula',
            formula: 'f(x_1, x_2, \\dots, x_n) = \\sum_{i=1}^{n}\\sum_{j=1}^{n} a_{ij} x_i x_j = x^T A x',
            caption: '二次型的矩阵表示。A=(aᵢⱼ) 是对称矩阵，主对角元对应平方项系数，次对角元对应交叉项系数的一半。',
          },
          {
            type: 'text',
            text: '例如 f(x₁,x₂)=3x₁²+4x₁x₂+2x₂²，展开得其矩阵为 A=[[3,2],[2,2]]。注意交叉项 4x₁x₂ 拆分为 2x₁x₂+2x₁x₂，各贡献系数 2。二次型理论与实对称矩阵理论密不可分，对角化二次型本质上就是对矩阵 A 做合同对角化。',
          },
          {
            type: 'formula',
            formula: 'f(x_1,x_2,\\dots,x_n) = x^T A x, \\quad A = A^T',
            caption: '二次型与对称矩阵的一一对应。一个二次型唯一确定一个对称矩阵，反之亦然。',
          },
          {
            type: 'text',
            text: '二次型来源于多个数学物理领域：多元函数的二阶泰勒展开中含二次型（Hessian 矩阵）；曲面方程（椭球面、双曲面）是等值二次型；力学中的动能公式、电路中的能量公式都是二次型。标准化二次型能清晰地揭示其几何性质。',
          },
        ],
      },
      {
        title: '正交变换法（主轴定理）',
        content: [
          {
            type: 'heading',
            text: '主轴定理 —— 二次型标准化的最强工具',
          },
          {
            type: 'text',
            text: '正交变换法（又称主轴定理，Principal Axes Theorem）化二次型为标准型是线性代数中最优美的结论之一。正交变换 x=Qy（Q 为正交矩阵，Qᵀ=Q⁻¹）下，二次型 f=xᵀAx 变为 f=yᵀ(QᵀAQ)y。而 QᵀAQ=Q⁻¹AQ=Λ=diag(λ₁,…,λₙ)，于是 f=λ₁y₁²+…+λₙyₙ²。',
          },
          {
            type: 'text',
            text: '正交变换法的步骤：①写出对称矩阵 A→②求 A 的特征值 λ₁,…,λₙ→③对每个特征值求对应的单位特征向量，并将属于不同特征值的向量正交化（自然正交）→④对所有特征向量做 Schmidt 正交单位化，按列构成正交矩阵 Q→⑤作变换 x=Qy→⑥得到标准型 f=λ₁y₁²+λ₂y₂²+…+λₙyₙ²。',
          },
          {
            type: 'formula',
            formula: 'x^T A x \\xrightarrow{x=Qy} y^T (Q^T A Q) y = y^T \\Lambda y = \\lambda_1 y_1^2 + \\lambda_2 y_2^2 + \\cdots + \\lambda_n y_n^2',
            caption: '主轴定理：正交变换化二次型为标准型。系数恰是矩阵的特征值。',
          },
          {
            type: 'text',
            text: '主轴定理的几何含义：通过坐标旋转（正交变换），二次型表示的二次曲面与坐标轴对齐。特征向量给出了新的坐标轴方向（主轴方向），特征值给出了沿该轴拉伸或压缩的幅度。正特征值对应椭球面的半轴长度。',
          },
        ],
      },
      {
        title: '正交变换法完整示例',
        content: [
          {
            type: 'heading',
            text: '以 f=5x₁²+4x₁x₂+5x₂² 为例',
          },
          {
            type: 'text',
            text: '考虑二次型 f(x₁,x₂)=5x₁²+4x₁x₂+5x₂²，对称矩阵为 A=[[5,2],[2,5]]。计算特征多项式 |A−λI|=(5−λ)²−4=λ²−10λ+21=(λ−7)(λ−3)，特征值为 λ₁=7, λ₂=3。',
          },
          {
            type: 'formula',
            formula: 'A = \\begin{bmatrix} 5 & 2 \\\\ 2 & 5 \\end{bmatrix}',
            caption: '二次型 f=5x₁²+4x₁x₂+5x₂² 对应的对称矩阵。交叉项系数 4 拆分后各为 2。',
          },
          {
            type: 'formula',
            formula: '\\lambda_1 = 7: \\; v_1 = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix},\\; \\lambda_2 = 3: \\; v_2 = \\begin{bmatrix} -1 \\\\ 1 \\end{bmatrix}',
            caption: '特征向量。v₁ 和 v₂ 正交（点积为 0），将其单位化：q₁=(1/√2, 1/√2)ᵀ, q₂=(−1/√2, 1/√2)ᵀ。',
          },
          {
            type: 'formula',
            formula: 'Q = \\begin{bmatrix} \\frac{1}{\\sqrt{2}} & -\\frac{1}{\\sqrt{2}} \\\\ \\frac{1}{\\sqrt{2}} & \\frac{1}{\\sqrt{2}} \\end{bmatrix},\\quad \\text{作 } x=Qy \\;\\Longrightarrow\\; f = 7y_1^2 + 3y_2^2',
            caption: '正交矩阵 Q 和标准化结果。二次型从含交叉项的形式变成了纯平方和。',
          },
        ],
      },
      {
        title: '配方法（Lagrange法）',
        content: [
          {
            type: 'heading',
            text: '逐项消去交叉项——Lagrange 配方法',
          },
          {
            type: 'text',
            text: '配方法是化二次型为标准型的最原始也是最通用的方法，不需求解特征值，只需直接对变量进行配方。其核心思想是逐项消除交叉项：每次挑出一个变量，将其与所有含该变量的交叉项合并成完全平方形式，然后递归处理剩余变量。',
          },
          {
            type: 'text',
            text: '配方法策略：情形一——若 a₁₁≠0，将所有含 x₁ 的项收集起来配方，得到 (a₁₁)(x₁+…)² + (不含 x₁ 的剩余二次型)；情形二——若 a₁₁=0 但 a₂₂≠0，类似处理 x₂；情形三——若所有对角元 aᵢᵢ 均为零但存在非对角元 aᵢⱼ≠0（对称性保证 aⱼᵢ=aᵢⱼ≠0），则先通过 xᵢ=yᵢ+yⱼ, xⱼ=yᵢ−yⱼ 引入平方项，再继续配方。',
          },
          {
            type: 'formula',
            formula: 'a_{11}x_1^2 + 2a_{12}x_1x_2 + 2a_{13}x_1x_3 + \\cdots = a_{11}\\left(x_1 + \\frac{a_{12}}{a_{11}}x_2 + \\frac{a_{13}}{a_{11}}x_3 + \\cdots\\right)^2 + \\text{（剩余部分）}',
            caption: '配方基本操作：将含 x₁ 的项配成完全平方，剩余部分不再含 x₁。',
          },
          {
            type: 'text',
            text: '配方法的优点是无需计算特征值，适用于任意实二次型。但配方法得到的标准型中系数的符号（惯性指数）是确定的，而具体数值与正交变换法可能不同——反映了合同变换只保持惯性指数而不保持特征值这一事实。',
          },
        ],
      },
      {
        title: '配方法完整示例',
        content: [
          {
            type: 'heading',
            text: '逐步配方：f=x₁²+2x₁x₂+2x₁x₃+2x₂²+4x₂x₃+4x₃²',
          },
          {
            type: 'text',
            text: '首先针对含 x₁ 的项配方：x₁²+2x₁x₂+2x₁x₃ = (x₁²+2x₁(x₂+x₃)) = (x₁+(x₂+x₃))² − (x₂+x₃)²。因此 f = (x₁+x₂+x₃)² − (x₂+x₃)² + 2x₂²+4x₂x₃+4x₃² = (x₁+x₂+x₃)² + (x₂² + 2x₂x₃ + 3x₃²)。',
          },
          {
            type: 'formula',
            formula: '\\begin{aligned} f &= x_1^2 + 2x_1x_2 + 2x_1x_3 + 2x_2^2 + 4x_2x_3 + 4x_3^2 \\\\ &= (x_1 + x_2 + x_3)^2 + x_2^2 + 2x_2x_3 + 3x_3^2 \\end{aligned}',
            caption: '第 1 步：对 x₁ 完成配方，消去所有含 x₁ 的交叉项。',
          },
          {
            type: 'formula',
            formula: '\\begin{aligned} x_2^2 + 2x_2x_3 + 3x_3^2 &= (x_2^2 + 2x_2x_3 + x_3^2) + 2x_3^2 \\\\ &= (x_2 + x_3)^2 + 2x_3^2 \\end{aligned}',
            caption: '第 2 步：对 x₂ 完成配方。剩余 x₃² 已经是平方项。',
          },
          {
            type: 'formula',
            formula: 'f = (x_1 + x_2 + x_3)^2 + (x_2 + x_3)^2 + 2x_3^2',
            caption: '最终配方结果。作变量代换 y₁=x₁+x₂+x₃, y₂=x₂+x₃, y₃=x₃，得 f = y₁² + y₂² + 2y₃²。所有系数为正，二次型正定。',
          },
          {
            type: 'text',
            text: '最后写出变元代换的矩阵形式：y=Cx，其中 C = [[1,1,1],[0,1,1],[0,0,1]]。验证 CᵀAC 是否等于 diag(1,1,2)？注意到三个系数全正，惯性指数(3,0)，正定二次型。',
          },
        ],
      },
      {
        title: '正定二次型',
        content: [
          {
            type: 'heading',
            text: '正定性——二次型的最重要分类',
          },
          {
            type: 'text',
            text: '正定二次型（positive definite）是最重要的一类二次型。定义：若对任意非零向量 x∈Rⁿ，都有 f(x)=xᵀAx > 0，则称 f 为正定二次型，称 A 为正定矩阵。正定二次型表示的二次曲面是一个"椭球面"，没有鞍点和极小曲面。',
          },
          {
            type: 'formula',
            formula: 'A \\text{ 正定 } \\Longleftrightarrow\\; \\forall x \\neq \\mathbf{0},\\; x^T A x > 0',
            caption: '正定二次型（正定矩阵）的定义。f(x) 始终为正，只在原点为零。',
          },
          {
            type: 'text',
            text: '正定性的四个等价判别条件：①所有特征值 > 0；②顺序主子式 Δ₁,Δ₂,…,Δₙ 均 > 0（Hurwitz 判别法）；③正惯性指数 p = n；④存在可逆矩阵 C 使得 A = CᵀC（Cholesky 分解）。其中 Hurwitz 判别法最常用于手工检验。',
          },
          {
            type: 'formula',
            formula: 'A \\text{ 正定 } \\Longleftrightarrow\\; \\Delta_1 > 0,\\; \\Delta_2 > 0,\\; \\dots,\\; \\Delta_n > 0 \\quad (\\Delta_k \\text{ 是 } A \\text{ 的 } k \\text{ 阶顺序主子式})',
            caption: 'Hurwitz 判别法：所有顺序主子式为正。例如 Δ₁=a₁₁>0, Δ₂=|a₁₁ a₁₂; a₂₁ a₂₂|>0, …。',
          },
          {
            type: 'text',
            text: '类似地，半正定（≥0）、负定（<0）、不定（有正有负）也有对应的判别条件。正定矩阵在优化中有特殊地位：当 Hessian 矩阵正定时，该点是局部极小值点；在力学中，弹性变形能矩阵正定意味着结构稳定。惯性指数 (p,q)=(n,0) 等价于正定，这也是最理想的结构形态。',
          },
        ],
      },
    ],
  },
};