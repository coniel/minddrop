import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { initializeI18n } from '@minddrop/i18n';
import '@minddrop/theme/reset.css';
import '@minddrop/theme/light.css';
import '@minddrop/theme/dark.css';
import '@minddrop/theme/base.css';
import '@minddrop/ui/dist/styles.css';
import { Button } from '@minddrop/ui';
import { useEffect, useState } from 'react';

initializeI18n();

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light-theme' | 'dark-theme'>(
    'light-theme',
  );

  useEffect(() => {
    document.getElementsByTagName('body').item(0).setAttribute('class', theme);
  }, [theme]);

  return (
    <>
      <h2>Hello from React!</h2>
      <Button
        label="test"
        onClick={() =>
          setTheme((theme) =>
            theme === 'light-theme' ? 'dark-theme' : 'light-theme',
          )
        }
      />
      <Button label="test" />
    </>
  );
};

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
