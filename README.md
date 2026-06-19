# 线性代数学习之旅

交互式线性代数学习平台，按递进路径从行列式到二次型标准化，每一步都有可视化计算器和步骤演示。

## 学习路径

```
行列式 → 求秩 → 认识矩阵 → 刻画方程组 → 求基础解系 → 特征方程与特征向量 → 相似对角阵 → 合同对角化 → 化二次型为标准型 🏆
```

## 技术栈

- React 18 + TypeScript
- Vite 5
- TailwindCSS 3
- React Router v6
- Framer Motion（动画）
- KaTeX（数学公式渲染）
- Zustand（状态管理）
- 纯前端，无需后端

## 运行方式

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/

### 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

### 类型检查

```bash
npm run check
```

## 项目结构

```
src/
├── engine/         # 矩阵运算引擎（行列式、消元、特征值、对角化等）
├── components/
│   ├── layout/     # Layout、Sidebar、ProgressBar
│   └── ui/         # MatrixInput、StepDisplay、MathRenderer、KnowledgeBridge
├── pages/          # 学习页面（每个知识点一个页面）
├── store/          # Zustand 进度管理
└── types/          # TypeScript 类型定义
```
