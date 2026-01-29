import React, { useEffect, useRef } from 'react';

export const PerformanceMonitor: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(performance.now());

  useEffect(() => {
    renderCount.current++;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;

    // Лёгкий лог для локальной отладки производительности
    // Оставляем console.debug чтобы не шуметь в production
    console.debug(`Render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    lastRenderTime.current = currentTime;
  });

  return <>{children}</>;
};

export const usePerformanceTimer = (name: string) => {
  const startTime = useRef<number | null>(null);

  const startTimer = () => {
    startTime.current = performance.now();
  };

  const endTimer = () => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      console.debug(`${name}: ${duration.toFixed(2)}ms`);
      startTime.current = null;
      return duration;
    }
    return 0;
  };

  return { startTimer, endTimer };
};

export default PerformanceMonitor;
