import { Theme } from '../Theme';
import { ThemeDark, ThemeLight, ThemeSystem } from '../constants';

export function onRun() {
  // Media matcher that matches if OS is in dark mode
  const matchMediaDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  function setThemeAppearanceToSystemValue() {
    // Get the OS dark mode value
    const darkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set the theme appearance to the system value
    Theme.setAppearance(darkMode ? ThemeDark : ThemeLight);
  }

  // Listen to `theme:appearance:set-setting` events
  Theme.addEventListener(
    'theme:appearance:set-setting',
    'theme:appearance:set',
    (payload) => {
      // The event data is the new appearance setting
      const appearanceSetting = payload.data;

      if (appearanceSetting === ThemeSystem) {
        // If the setting has been set to 'system', set
        // the current theme appearance to the system value.
        setThemeAppearanceToSystemValue();

        // Listen for changes to the OS dark mode setting
        // and update the theme appearance when it changes.
        matchMediaDarkMode.addEventListener(
          'change',
          setThemeAppearanceToSystemValue,
        );
      } else {
        // If the setting has been set to a fixed value,
        // set the value as the current theme appearance.
        Theme.setAppearance(appearanceSetting || ThemeLight);

        // Remove the OS dark mode change listener
        matchMediaDarkMode.removeEventListener(
          'change',
          setThemeAppearanceToSystemValue,
        );
      }
    },
  );

  // Get the initial theme appearance setting
  const appearanceSetting = Theme.getAppearanceSetting();

  if (appearanceSetting === ThemeSystem) {
    // If the theme appearance setting is 'system', set
    // the theme appearance to the system value.
    setThemeAppearanceToSystemValue();

    // Watch for changes to the OS dark mode setting
    matchMediaDarkMode.addEventListener(
      'change',
      setThemeAppearanceToSystemValue,
    );
  } else {
    // If the setting has been set to a fixed value,
    // set the value as the current theme appearance.
    Theme.setAppearance(appearanceSetting);
  }
}

export function onDisable() {}
