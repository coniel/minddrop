import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { DesktopApp } from '@minddrop/desktop-app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <DesktopApp />
    </App>
  </React.StrictMode>,
);
