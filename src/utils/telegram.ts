// Типы для Telegram WebApp
interface TelegramWebApp {
  expand(): void;
  close(): void;
  enableClosingConfirmation(): void;
  showAlert(message: string): void;
  showConfirm(message: string, callback: (confirmed: boolean) => void): void;
  sendData(data: string): void;
  MainButton: {
    setText(text: string): void;
    onClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  BackButton: {
    onClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  colorScheme: 'light' | 'dark';
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  onEvent(eventType: string, eventHandler: () => void): void;
}

interface TelegramWindow {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}

declare global {
  interface Window extends TelegramWindow {}
}

/**
 * Инициализация Telegram WebApp
 */
export const initTelegramWebApp = () => {
  // Проверяем, что мы в Telegram
  return typeof window !== 'undefined' && window.Telegram?.WebApp !== undefined;
};

/**
 * Получить экземпляр WebApp
 */
export const getWebApp = (): TelegramWebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

/**
 * Проверить, запущено ли приложение в Telegram
 */
export const isTelegramWebApp = (): boolean => {
  return initTelegramWebApp();
};

/**
 * Расширить приложение на весь экран
 */
export const expandApp = () => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.expand();
  }
};

/**
 * Закрыть приложение
 */
export const closeApp = () => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.close();
  }
};

/**
 * Показать главную кнопку Telegram
 */
export const showMainButton = (text: string, onClick: () => void) => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
  }
};

/**
 * Скрыть главную кнопку Telegram
 */
export const hideMainButton = () => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.MainButton.hide();
  }
};

/**
 * Показать кнопку "Назад"
 */
export const showBackButton = (onClick: () => void) => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.BackButton.onClick(onClick);
    webApp.BackButton.show();
  }
};

/**
 * Скрыть кнопку "Назад"
 */
export const hideBackButton = () => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.BackButton.hide();
  }
};

/**
 * Показать всплывающее окно
 */
export const showAlert = (message: string) => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.showAlert(message);
  } else {
    alert(message);
  }
};

/**
 * Показать подтверждение
 */
export const showConfirm = (message: string): Promise<boolean> => {
  const webApp = getWebApp();
  if (webApp) {
    return new Promise((resolve) => {
      webApp.showConfirm(message, (confirmed: boolean) => {
        resolve(confirmed);
      });
    });
  } else {
    return Promise.resolve(window.confirm(message));
  }
};

/**
 * Получить данные пользователя Telegram
 */
export const getUser = () => {
  const webApp = getWebApp();
  return webApp?.initDataUnsafe?.user || null;
};

/**
 * Получить тему приложения
 */
export const getTheme = (): 'light' | 'dark' => {
  const webApp = getWebApp();
  return (webApp?.colorScheme as 'light' | 'dark') || 'light';
};

/**
 * Установить обработчик изменения темы
 */
export const onThemeChange = (callback: (theme: 'light' | 'dark') => void) => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.onEvent('themeChanged', () => {
      callback(getTheme());
    });
  }
};

/**
 * Включить закрытие при свайпе вниз
 */
export const enableClosingConfirmation = () => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.enableClosingConfirmation();
  }
};

/**
 * Отправить данные на сервер бота (если нужно)
 */
export const sendData = (data: string) => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.sendData(data);
  }
};

