import React from 'react';
import ReactDOM from 'react-dom/client';
import { CreateFirstWorkspace } from '@minddrop/desktop-app';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <CreateFirstWorkspace />
    </App>
  </React.StrictMode>,
);
