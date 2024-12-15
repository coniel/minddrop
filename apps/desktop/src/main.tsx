import React from 'react';
import ReactDOM from 'react-dom/client';
import { DesktopApp } from '@minddrop/desktop-app';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <DesktopApp />
    </App>
  </React.StrictMode>,
);
