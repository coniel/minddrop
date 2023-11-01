import { appWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export const ShowWindowOnRendered: React.FC = () => {
  useEffect(() => {
    async function showWindow() {
      const visible = await appWindow.isVisible();

      if (!visible) {
        appWindow.show();
      }
    }

    showWindow();
  }, []);

  return null;
};
