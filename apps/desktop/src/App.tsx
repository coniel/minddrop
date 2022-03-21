import React from 'react';
import * as ReactDOM from 'react-dom';
import { MindDrop } from '@minddrop/minddrop';
import { initializeFileStorage } from './renderer-init';
import './App.css';

initializeFileStorage();

const App: React.FC = () => {
  return <MindDrop appId="app" dbApi={window.db} extensions={[]} />;
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
