import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import * as Theme from '../Theme';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark, ThemeLight, ThemeSystem } from '../constants';
import { setThemeAppearanceSetting } from '../setThemeAppearanceSetting';
import { cleanup, setup } from '../test-utils';
import { ThemeAppearance } from '../types';
import { initializeTheme } from './initializeTheme';

describe('initializeTheme', () => {
  let matchMediaEventListeners: VoidFunction[] = [];

  function mockMatchMedia(appearance: ThemeAppearance = ThemeLight) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: appearance === ThemeDark,
        // Add the callback to the 'matchMediaEventListeners' array
        addEventListener: (event: string, callback: VoidFunction) =>
          matchMediaEventListeners.push(callback),
        // Remove the callback from the 'matchMediaEventListeners' array
        removeEventListener: (event: string, callback: VoidFunction) => {
          matchMediaEventListeners = matchMediaEventListeners.filter(
            (fn) => fn !== callback,
          );
        },
      })),
    });
  }

  function simulateOsAppearanceChange(appearance: ThemeAppearance) {
    // Mock match media to return a match for
    // the speficied appearance.
    mockMatchMedia(appearance);

    // Run match media event listeners to simulate OS
    // appearance change.
    matchMediaEventListeners.forEach((callback) => callback());
  }

  beforeAll(() => {
    mockMatchMedia();
    setup();
    // Run once before all tests in order to initialize
    // the local persistent store.
    initializeTheme();
  });

  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Reset the local persistent store data to default values
    ThemeConfig.set('appearanceSetting', ThemeSystem);

    // Clear mock match media event listeners
    matchMediaEventListeners = [];
  });

  it('loads the appearance setting value from the local persistent store', () => {
    // Set the initial appearance setting value in the
    // local persistent store.
    ThemeConfig.set('appearanceSetting', ThemeDark);

    // Initialize theme
    initializeTheme();

    // Should load the apperance setting from the local
    // persistent store into the theme store.
    expect(ThemeConfig.get('appearanceSetting')).toBe(ThemeDark);
  });

  describe('initial theme appearance', () => {
    it('sets the OS value when the setting is `system`', () => {
      // Mock match media to return a match for dark mode
      mockMatchMedia(ThemeDark);
      // Set the initial appearance setting value to 'system'
      ThemeConfig.set('appearanceSetting', ThemeSystem);

      // Initialize theme
      initializeTheme();

      // Should set theme appearance to 'dark'
      expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
    });

    it('sets the setting value when the setting is `light` or `dark`', () => {
      // Mock match media to return a match for light mode
      mockMatchMedia(ThemeLight);
      // Set the initial appearance setting value to 'dark'
      ThemeConfig.set('appearanceSetting', ThemeDark);

      // Initialize theme
      initializeTheme();

      // Should set theme appearance to 'dark'
      expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
    });

    it('listens for OS dark mode changes when setting is `system`', () => {
      // Mock match media to return a match for light mode
      mockMatchMedia(ThemeLight);
      // Set the initial appearance setting value to 'system'
      ThemeConfig.set('appearanceSetting', ThemeSystem);

      // Initialize theme
      initializeTheme();

      // Simulate OS appearance change to dark mode
      simulateOsAppearanceChange(ThemeDark);

      // Should set theme appearance to 'dark'
      expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
    });
  });

  describe('theme appearance setting change', () => {
    it('updates the local persistent store appearanceSetting value', async () => {
      // Initialize theme
      initializeTheme();

      // Change the appearance setting value
      setThemeAppearanceSetting(ThemeDark);

      // Wait for the event to be dispatched
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      // Should set the new appearance setting in the local
      // persistent store.
      expect(ThemeConfig.get('appearanceSetting')).toBe(ThemeDark);
    });

    it('sets the OS value if the setting is `system`', async () => {
      // Mock match media to return a match for dark mode
      mockMatchMedia(ThemeDark);
      // Set the initial appearance setting value to 'light'
      ThemeConfig.set('appearanceSetting', ThemeLight);

      // Initialize theme
      initializeTheme();

      // Set the theme appearance setting to 'system'
      Theme.setAppearanceSetting(ThemeSystem);

      // Wait for the event listener to run
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      // Should set theme appearance to 'dark'
      expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
    });

    it('sets the setting value if the setting is `light` or `dark`', async () => {
      // Mock match media to return a match for light mode
      mockMatchMedia(ThemeLight);
      // Set the initial appearance setting value to 'light'
      ThemeConfig.set('appearanceSetting', ThemeLight);

      // Initialize theme
      initializeTheme();

      // Set the theme appearance setting to 'dark'
      Theme.setAppearanceSetting(ThemeDark);

      // Wait for the event listener to run
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      // Should set theme appearance to 'dark'
      expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
    });

    it('listens for OS dark mode changes if setting is `system`', async () => {
      // Mock match media to return a match for light mode
      mockMatchMedia(ThemeLight);
      // Set the initial appearance setting value to 'light'
      ThemeConfig.set('appearanceSetting', ThemeLight);

      // Initialize theme
      initializeTheme();

      // Set the theme appearance setting to 'system'
      Theme.setAppearanceSetting(ThemeSystem);

      // Wait for the event listener to run
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      // Simulate OS appearance change to dark mode
      simulateOsAppearanceChange(ThemeDark);

      // Should set theme appearance to 'dark'
      expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
    });

    it('removes OS dark mode changes listener if setting is `light` or `dark`', async () => {
      // Mock match media to return a match for dark mode
      mockMatchMedia(ThemeDark);
      // Set the initial appearance setting value to 'system'
      ThemeConfig.set('appearanceSetting', ThemeSystem);

      // Initialize theme
      initializeTheme();

      // Set the theme appearance setting to 'dark'
      Theme.setAppearanceSetting(ThemeDark);

      // Wait for the event listener to run
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      // Simulate OS appearance change to light mode
      simulateOsAppearanceChange(ThemeLight);

      // Theme appearance should remain 'dark'
      expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
    });
  });
});
