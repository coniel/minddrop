import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '@minddrop/theme';
import { initializeI18n } from '@minddrop/i18n';
import { IconsProvider } from '@minddrop/icons';
import { useEffect, useState } from 'react';
import { AppSidebar } from './components';
import './App.css';

initializeI18n();

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light-theme' | 'dark-theme'>(
    'light-theme',
  );

  useEffect(() => {
    document.getElementsByTagName('body').item(0).setAttribute('class', theme);
  }, [theme]);

  return (
    <IconsProvider>
      <div style={{ display: 'flex', height: '100%' }}>
        <AppSidebar />
      </div>
    </IconsProvider>
  );
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
