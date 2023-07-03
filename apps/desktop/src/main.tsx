import React from 'react';
import ReactDOM from 'react-dom/client';
import '@minddrop/theme/src/reset.css';
import '@minddrop/theme/src/light.css';
import '@minddrop/theme/src/dark.css';
import '@minddrop/theme/src/base.css';
import '@minddrop/theme/src/animations.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
