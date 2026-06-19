import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import DeterminantPage from '@/pages/DeterminantPage'
import RankPage from '@/pages/RankPage'
import MatrixPage from '@/pages/MatrixPage'
import EquationsPage from '@/pages/EquationsPage'
import BasicSolutionsPage from '@/pages/BasicSolutionsPage'
import EigenPage from '@/pages/EigenPage'
import SimilarDiagonalPage from '@/pages/SimilarDiagonalPage'
import ContractDiagonalPage from '@/pages/ContractDiagonalPage'
import QuadraticFormPage from '@/pages/QuadraticFormPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/determinant" element={<DeterminantPage />} />
        <Route path="/rank" element={<RankPage />} />
        <Route path="/matrix" element={<MatrixPage />} />
        <Route path="/equations" element={<EquationsPage />} />
        <Route path="/basic-solutions" element={<BasicSolutionsPage />} />
        <Route path="/eigen" element={<EigenPage />} />
        <Route path="/similar-diagonal" element={<SimilarDiagonalPage />} />
        <Route path="/contract-diagonal" element={<ContractDiagonalPage />} />
        <Route path="/quadratic-form" element={<QuadraticFormPage />} />
      </Route>
    </Routes>
  )
}
