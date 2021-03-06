import { Core } from '@minddrop/core';
import {
  LocalPersistentStore,
  LocalPersistentStoreDataSchema,
} from '@minddrop/persistent-store';
import { Theme } from '../Theme';
import { setThemeAppearanceSetting } from '../setThemeAppearanceSetting';
import { ThemeAppearanceSetting } from '../types';

interface LocalPersistentData {
  appearanceSetting: ThemeAppearanceSetting;
}

const localPersistentDataSchema: LocalPersistentStoreDataSchema<LocalPersistentData> =
  {
    appearanceSetting: {
      type: 'enum',
      options: ['light', 'dark', 'system'],
    },
  };

export function onRun(core: Core) {
  // Media matcher that matches if OS is in dark mode
  const matchMediaDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  // Initialize the local persistent store data
  LocalPersistentStore.initialize(core, localPersistentDataSchema, {
    appearanceSetting: 'system',
  });

  // Get the initial appearance setting value from
  // the local persistent store.
  setThemeAppearanceSetting(
    core,
    LocalPersistentStore.get(core, 'appearanceSetting', 'system'),
  );

  function setThemeAppearanceToSystemValue() {
    // Get the OS dark mode value
    const darkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set the theme appearance to the system value
    Theme.setAppearance(core, darkMode ? 'dark' : 'light');
  }

  // Listen to `theme:appearance:set-setting` events
  Theme.addEventListener(core, 'theme:appearance:set-setting', (payload) => {
    // The event data is the new appearance setting
    const appearanceSetting = payload.data;

    // Set the updated appearance setting in the local
    // persistent store.
    LocalPersistentStore.set(core, 'appearanceSetting', appearanceSetting);

    if (appearanceSetting === 'system') {
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
      Theme.setAppearance(core, appearanceSetting);

      // Remove the OS dark mode change listener
      matchMediaDarkMode.removeEventListener(
        'change',
        setThemeAppearanceToSystemValue,
      );
    }
  });

  // Get the initial theme appearance setting
  const appearanceSetting = Theme.getAppearanceSetting();

  if (appearanceSetting === 'system') {
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
    Theme.setAppearance(core, appearanceSetting);
  }
}

export function onDisable(core: Core) {
  // Clear all added event listeners
  core.removeAllEventListeners();
}
