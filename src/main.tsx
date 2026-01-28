import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initTelegramWebApp, expandApp } from './utils/telegram'

// Инициализация Telegram WebApp
if (initTelegramWebApp()) {
  try {
    // Расширяем приложение на весь экран
    expandApp();
  } catch (error) {
    console.debug('Error during Telegram initialization:', error);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

