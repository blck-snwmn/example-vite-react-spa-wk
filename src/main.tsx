import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="max-w-5xl mx-auto p-8 text-center">
      <App />
    </div>
  </StrictMode>,
)
