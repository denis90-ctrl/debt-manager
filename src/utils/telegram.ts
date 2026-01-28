// Типы для Telegram WebApp
interface TelegramWebApp {
  expand(): void;
  close(): void;
  enableClosingConfirmation(): void;
  showAlert(message: string): void;
  showConfirm(message: string, callback: (confirmed: boolean) => void): void;
  sendData(data: string): void;
  ready(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  HapticFeedback?: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  MainButton: {
    setText(text: string): void;
    onClick(callback: () => void): void;
    show(): void;
    hide(): void;
    setParams(params: { is_visible?: boolean; is_active?: boolean; text?: string; color?: string; text_color?: string }): void;
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
      is_premium?: boolean;
    };
  };
  onEvent(eventType: string, eventHandler: () => void): void;
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
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
  try {
    const webApp = getWebApp();
    if (webApp && typeof webApp.expand === 'function') {
      webApp.expand();
    }
  } catch (error) {
    console.debug('expandApp failed:', error);
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
  try {
    const webApp = getWebApp();
    if (webApp && typeof webApp.showAlert === 'function') {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  } catch (error) {
    console.debug('showAlert failed:', error);
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
  try {
    const webApp = getWebApp();
    if (webApp && typeof webApp.onEvent === 'function') {
      webApp.onEvent('themeChanged', () => {
        try {
          callback(getTheme());
        } catch (error) {
          console.debug('Theme change callback failed:', error);
        }
      });
    }
  } catch (error) {
    console.debug('onThemeChange failed:', error);
  }
};

/**
 * Включить закрытие при свайпе вниз (с проверкой версии)
 */
export const enableClosingConfirmation = () => {
  try {
    const webApp = getWebApp();
    if (webApp && typeof webApp.enableClosingConfirmation === 'function') {
      webApp.enableClosingConfirmation();
    }
  } catch (error) {
    // Метод может не быть поддержан в некоторых версиях Telegram
    console.debug('enableClosingConfirmation is not supported or failed:', error);
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

/**
 * Haptic feedback - вибрация для обратной связи
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'warning' | 'selection') => {
  try {
    const webApp = getWebApp();
    if (!webApp?.HapticFeedback) return;

    if (type === 'error' || type === 'success' || type === 'warning') {
      webApp.HapticFeedback.notificationOccurred(type);
    } else if (type === 'selection') {
      webApp.HapticFeedback.selectionChanged();
    } else {
      webApp.HapticFeedback.impactOccurred(type);
    }
  } catch (error) {
    console.debug('Haptic feedback failed:', error);
  }
};

/**
 * Инициализировать Telegram WebApp правильно
 */
export const initializeTelegramApp = () => {
  try {
    const webApp = getWebApp();
    if (!webApp) return;

    // Сообщить Telegram, что приложение готово
    if (typeof webApp.ready === 'function') {
      webApp.ready();
    }

    // Расширить приложение на весь экран
    expandApp();

    // Установить цвета в соответствии с темой
    const isDark = webApp.colorScheme === 'dark';
    if (typeof webApp.setHeaderColor === 'function') {
      webApp.setHeaderColor(isDark ? '#1f2937' : '#ffffff');
    }
    if (typeof webApp.setBackgroundColor === 'function') {
      webApp.setBackgroundColor(isDark ? '#0f172a' : '#f8fafc');
    }
  } catch (error) {
    console.debug('Telegram app initialization failed:', error);
  }
};

/**
 * Получить информацию о пользователе Telegram
 */
export const getTelegramUser = () => {
  try {
    const webApp = getWebApp();
    const user = webApp?.initDataUnsafe?.user;
    if (user) {
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
        isPremium: user.is_premium || false,
      };
    }
    return null;
  } catch (error) {
    console.debug('Failed to get Telegram user:', error);
    return null;
  }
};

/**
 * Получить размеры viewport
 */
export const getViewportInfo = () => {
  try {
    const webApp = getWebApp();
    return {
      isExpanded: webApp?.isExpanded || false,
      height: webApp?.viewportHeight || window.innerHeight,
      stableHeight: webApp?.viewportStableHeight || window.innerHeight,
    };
  } catch (error) {
    console.debug('Failed to get viewport info:', error);
    return {
      isExpanded: false,
      height: window.innerHeight,
      stableHeight: window.innerHeight,
    };
  }
};

