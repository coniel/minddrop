import { getCurrent } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export const ShowWindowOnRendered: React.FC = () => {
  useEffect(() => {
    async function showWindow() {
      const visible = await getCurrent().isVisible();

      if (!visible) {
        setTimeout(() => {
          getCurrent().show();
        }, 50);
      }
    }

    showWindow();
  }, []);

  return null;
};
