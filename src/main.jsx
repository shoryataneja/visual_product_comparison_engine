import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegenerateCatalog from './RegenerateCatalog.jsx'

const isRegeneratePage = window.location.pathname === '/regenerate';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isRegeneratePage ? <RegenerateCatalog /> : <App />}
  </StrictMode>,
)
