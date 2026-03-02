// import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export const ShowWindowOnRendered: React.FC = () => {
  useEffect(() => {
    async function showWindow() {
      // const visible = await getCurrentWindow().isVisible();
      // if (!visible) {
      //   setTimeout(() => {
      //     getCurrentWindow().show();
      //   }, 50);
      // }
    }

    showWindow();
  }, []);

  return null;
};
