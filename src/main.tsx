import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Player from './Player.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/player/:id" element={<Player />} />
      <Route path="/:paramYear/:paramCategory/:paramType/:paramGender" element={<App />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  </Router>
)