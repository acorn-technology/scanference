import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ScanPage from './pages/ScanPage'
import LookupPage from './pages/LookupPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/lookup" element={<LookupPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
