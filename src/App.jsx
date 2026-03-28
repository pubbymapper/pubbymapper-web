import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import TheLocalPage from './the-local/TheLocalPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/the-local" element={<TheLocalPage />} />
    </Routes>
  )
}

export default App
