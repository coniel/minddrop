import React from 'react';
import * as ReactDOM from 'react-dom';
import { MindDrop } from '@minddrop/minddrop';
import { initializeFileStorage } from './renderer-init';
import './App.css';

const App: React.FC = () => {
  return (
    <MindDrop
      appId="app"
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
