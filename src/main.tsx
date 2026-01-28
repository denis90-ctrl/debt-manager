import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initializeTelegramApp } from './utils/telegram'

// Инициализация Telegram WebApp
initializeTelegramApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

