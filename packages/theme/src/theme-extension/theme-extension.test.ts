import {
  describe,
  beforeAll,
  beforeEach,
  afterEach,
  it,
  expect,
  vi,
} from 'vitest';
import { Theme } from '../Theme';
import { setThemeAppearanceSetting } from '../setThemeAppearanceSetting';
import { setup, cleanup, core } from '../test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { onRun, onDisable } from './theme-extension';
import { ThemeAppearance } from '../types';

describe('theme extension', () => {
  let matchMediaEventListeners: VoidFunction[] = [];

  function mockMatchMedia(appearance: ThemeAppearance = 'light') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: appearance === 'dark',
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
    // Run the extension once before all tests in
    // order to initialize the local persistent store.
    onRun(core);
  });

  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Clear all event listeners
    core.removeAllEventListeners();

    // Reset the local persistent store data to default values
    ThemeConfig.set('appearanceSetting', 'system');

    // Clear mock match media event listeners
    matchMediaEventListeners = [];
  });

  describe('onRun', () => {
    it('loads the appearance setting value from the local persistent store', () => {
      // Set the initial appearance setting value in the
      // local persistent store.
      ThemeConfig.set('appearanceSetting', 'dark');

      // Run the extension
      onRun(core);

      // Should load the apperance setting from the local
      // persistent store into the theme store.
      expect(ThemeConfig.get('appearanceSetting')).toBe('dark');
    });

    describe('initial theme appearance', () => {
      it('sets the OS value when the setting is `system`', () => {
        // Mock match media to return a match for dark mode
        mockMatchMedia('dark');
        // Set the initial appearance setting value to 'system'
        ThemeConfig.set('appearanceSetting', 'system');

        // Run the extension
        onRun(core);

        // Should set theme appearance to 'dark'
        expect(ThemeConfig.get('appearance')).toBe('dark');
      });

      it('sets the setting value when the setting is `light` or `dark`', () => {
        // Mock match media to return a match for light mode
        mockMatchMedia('light');
        // Set the initial appearance setting value to 'dark'
        ThemeConfig.set('appearanceSetting', 'dark');

        // Run the extension
        onRun(core);

        // Should set theme appearance to 'dark'
        expect(ThemeConfig.get('appearance')).toBe('dark');
      });

      it('listens for OS dark mode changes when setting is `system`', () => {
        // Mock match media to return a match for light mode
        mockMatchMedia('light');
        // Set the initial appearance setting value to 'system'
        ThemeConfig.set('appearanceSetting', 'system');

        // Run the extension
        onRun(core);

        // Simulate OS appearance change to dark mode
        simulateOsAppearanceChange('dark');

        // Should set theme appearance to 'dark'
        expect(ThemeConfig.get('appearance')).toBe('dark');
      });
    });

    describe('theme appearance setting change', () => {
      it('updates the local persistent store appearanceSetting value', async () => {
        // Run the extension
        onRun(core);

        // Change the appearance setting value
        setThemeAppearanceSetting(core, 'dark');

        // Wait for the event to be dispatched
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });

        // Should set the new appearance setting in the local
        // persistent store.
        expect(ThemeConfig.get('appearanceSetting')).toBe('dark');
      });

      it('sets the OS value if the setting is `system`', async () => {
        // Mock match media to return a match for dark mode
        mockMatchMedia('dark');
        // Set the initial appearance setting value to 'light'
        ThemeConfig.set('appearanceSetting', 'light');

        // Run the extension
        onRun(core);

        // Set the theme appearance setting to 'system'
        Theme.setAppearanceSetting(core, 'system');

        // Wait for the event listener to run
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });

        // Should set theme appearance to 'dark'
        expect(ThemeConfig.get('appearance')).toBe('dark');
      });

      it('sets the setting value if the setting is `light` or `dark`', async () => {
        // Mock match media to return a match for light mode
        mockMatchMedia('light');
        // Set the initial appearance setting value to 'light'
        ThemeConfig.set('appearanceSetting', 'light');

        // Run the extension
        onRun(core);

        // Set the theme appearance setting to 'dark'
        Theme.setAppearanceSetting(core, 'dark');

        // Wait for the event listener to run
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });

        // Should set theme appearance to 'dark'
        expect(ThemeConfig.get('appearance')).toBe('dark');
      });

      it('listens for OS dark mode changes if setting is `system`', async () => {
        // Mock match media to return a match for light mode
        mockMatchMedia('light');
        // Set the initial appearance setting value to 'light'
        ThemeConfig.set('appearanceSetting', 'light');

        // Run the extension
        onRun(core);

        // Set the theme appearance setting to 'system'
        Theme.setAppearanceSetting(core, 'system');

        // Wait for the event listener to run
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });

        // Simulate OS appearance change to dark mode
        simulateOsAppearanceChange('dark');

        // Should set theme appearance to 'dark'
        expect(ThemeConfig.get('appearance')).toBe('dark');
      });

      it('removes OS dark mode changes listener if setting is `light` or `dark`', async () => {
        // Mock match media to return a match for dark mode
        mockMatchMedia('dark');
        // Set the initial appearance setting value to 'system'
        ThemeConfig.set('appearanceSetting', 'system');

        // Run the extension
        onRun(core);

        // Set the theme appearance setting to 'dark'
        Theme.setAppearanceSetting(core, 'dark');

        // Wait for the event listener to run
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });

        // Simulate OS appearance change to light mode
        simulateOsAppearanceChange('light');

        // Theme appearance should remain 'dark'
        expect(ThemeConfig.get('appearance')).toBe('dark');
      });
    });
  });

  describe('onDisable', () => {
    it('removes all theme event listeners', () => {
      // Add an event listener
      Theme.addEventListener(core, 'theme:appearance:set-value', vi.fn());

      // Disable the extension
      onDisable(core);

      // Should clear event listeners
      expect(core.eventListenerCount()).toBe(0);
    });
  });
});
