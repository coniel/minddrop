import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { MindDrop } from '@minddrop/minddrop';
import { initializeFileStorage } from './renderer-init';
import './App.css';

const App: React.FC = () => {
  const [appId, setAppId] = useState('');
  useEffect(() => {
    async function getAppId() {
      const result = await window.getStoreValue('appId');
      setAppId(result);
    }

    getAppId();
  }, []);

  if (!appId) {
    return <div className="loading-view">Loading...</div>;
  }

  return (
    <MindDrop
      appId={appId}
      resourceStorageAdapter={window.ResourceStorageAdapter}
      fileStorageAdapter={initializeFileStorage()}
      backendUtilsAdapter={window.BackendUtilsAdapter}
      extensions={[]}
    />
  );
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
