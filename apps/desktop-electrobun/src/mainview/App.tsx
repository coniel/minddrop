import { useEffect, useState } from 'react';
import { initializeDesktopApp } from '@minddrop/feature-desktop-app';

export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initializingApp, setInitializingApp] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeDesktopApp();
      setInitializingApp(false);
    };

    init();
  }, []);

  if (initializingApp) {
    return null;
  }

  return children;
};
