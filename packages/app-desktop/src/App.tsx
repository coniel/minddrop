import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '@minddrop/theme';
import { initializeI18n } from '@minddrop/i18n';
import { initializeFileStorage } from './renderer-init';
import './App.css';

initializeI18n();
initializeFileStorage();

const App: React.FC = () => {
  return <div />;
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
