import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {WalletProvider} from "./hooks/wallet.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <WalletProvider>
    <App />
  </WalletProvider>,
)
