import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initTelegramWebApp, expandApp, enableClosingConfirmation } from './utils/telegram'

// Инициализация Telegram WebApp
if (initTelegramWebApp()) {
  try {
    // Расширяем приложение на весь экран
    expandApp();
    // Включаем подтверждение при закрытии (с задержкой, так как SDK может быть еще не полностью инициализирован)
    setTimeout(() => {
      enableClosingConfirmation();
    }, 100);
  } catch (error) {
    console.debug('Error during Telegram initialization:', error);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

