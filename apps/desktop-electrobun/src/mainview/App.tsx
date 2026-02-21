import { useEffect, useState } from 'react';
import { initializeDesktopApp } from '@minddrop/desktop-app';
import '@minddrop/theme/src/reset.css';
import '@minddrop/theme/src/dark.css';
import '@minddrop/theme/src/light.css';
import '@minddrop/theme/src/base.css';
import '@minddrop/theme/src/animations.css';

export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initializingApp, setInitializingApp] = useState(true);

  useEffect(() => {
    // Cleanup function is returned asynchronously by
    // initializeDesktopApp.
    let cleanupFn: Promise<VoidFunction>;

    const init = async () => {
      // Initialize desktop app
      cleanupFn = initializeDesktopApp();

      // Wait for the app to be initialized
      await cleanupFn;

      setInitializingApp(false);
    };

    init();

    return () => {
      async function runCleanup() {
        // Wait for the cleanup function to be returned by
        // by initializeDesktopApp before trying to call it.
        const cleanup = await cleanupFn;

        cleanup();
      }

      runCleanup();
    };
  }, []);

  if (initializingApp) {
    return null;
  }

  return children;
};
