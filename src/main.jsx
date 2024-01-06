import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { TokenProvider } from './hooks/TokenContext.jsx';

import './styles/index.css'
import './styles/navbar.css'
import './styles/dashboard.css'
import './styles/collection.css'
import './styles/collections.css'
import './styles/figurine.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
  </React.StrictMode>,
)
