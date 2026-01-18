import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initTelegramWebApp, expandApp, enableClosingConfirmation } from './utils/telegram'

// Инициализация Telegram WebApp
if (initTelegramWebApp()) {
  // Расширяем приложение на весь экран
  expandApp();
  // Включаем подтверждение при закрытии
  enableClosingConfirmation();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

