import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '@minddrop/theme';
import { initializeI18n } from '@minddrop/i18n';
import { initializeCore } from '@minddrop/core';
import { initializeResourceConnectors } from '@minddrop/pouchdb';
import { initializeFileStorage } from './renderer-init';
import * as files from '@minddrop/files';
import * as tags from '@minddrop/tags';
import * as drops from '@minddrop/drops';
import * as topics from '@minddrop/topics';
import './App.css';

initializeI18n();
initializeFileStorage();

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

files.onRun(core);
tags.onRun(core);
drops.onRun(core);
topics.onRun(core);

initializeResourceConnectors(core, window.db);

const App: React.FC = () => {
  return <div />;
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
