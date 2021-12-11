import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import '@minddrop/theme';
import { initializeI18n } from '@minddrop/i18n';

initializeI18n();

const App: React.FC = () => {
  return <div />;
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
