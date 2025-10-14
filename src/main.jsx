import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { APIPuppiesContextpProvider } from './context/apipuppiescontext.jsx'

createRoot(document.getElementById('root')).render(
  <APIPuppiesContextpProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </APIPuppiesContextpProvider>
)
