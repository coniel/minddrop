import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { ResolvedThemeVariant, Theme } from '@minddrop/ui-theme';
import { registerAppDataStoreListeners } from '../registerAppDataStoreListeners';
import { MockFs, cleanup } from '../test-utils';
import { initializeTheme } from './initializeTheme';

// IDs of the theme event listeners registered by initializeTheme,
// removed between tests so each test registers fresh listeners
const THEME_LISTENER_IDS = [
  'app:set-body-theme-appearance-class',
  'app:set-body-image-dimming-class',
  'app:set-body-invert-light-images-class',
  'theme:initialize:manage-os-listener',
];

// Events.dispatch awaits each listener, so listeners run on the
// microtask queue. Yielding to a macrotask drains them.
const flushEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('initializeTheme', () => {
  // Cleanup function for the store persistence listeners which
  // answer the theme store's hydrate request
  let removeStoreListeners: VoidFunction = () => {};

  // Callbacks registered on the mocked OS dark mode media query
  let matchMediaEventListeners: VoidFunction[] = [];

  function mockMatchMedia(appearance: ResolvedThemeVariant = 'light') {
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

  function simulateOsAppearanceChange(appearance: ResolvedThemeVariant) {
    // Mock match media to return a match for
    // the specified appearance
    mockMatchMedia(appearance);

    // Run match media event listeners to simulate OS
    // appearance change
    matchMediaEventListeners.forEach((callback) => callback());
  }

  beforeEach(() => {
    // Mock match media with a light OS appearance by default
    mockMatchMedia();

    // Create the AppData stores directory. The mock file system
    // resolves recursive directory creation against the root,
    // ignoring the base directory, so the listeners cannot create
    // it themselves in tests.
    MockFs.createDir('app-data/stores', { recursive: true });

    // Register the store persistence listeners which answer the
    // theme store's hydrate request, without which initializeTheme
    // never resolves
    removeStoreListeners = registerAppDataStoreListeners();
  });

  afterEach(() => {
    // Remove the store persistence listeners
    removeStoreListeners();

    // Remove the theme event listeners registered during the test
    THEME_LISTENER_IDS.forEach((id) => {
      Events.removeListener(Theme.events.VariantChanged, id);
      Events.removeListener(Theme.events.ImageDimmingChanged, id);
      Events.removeListener(Theme.events.InvertLightImagesChanged, id);
    });

    // Restore the theme settings to their default values
    Theme.setVariant('system');
    Theme.setImageDimming('off');
    Theme.setInvertLightImages(false);

    // Remove the theme classes applied to <body>
    document.body.className = '';

    // Clear mock match media event listeners
    matchMediaEventListeners = [];

    cleanup();
  });

  it('applies the appearance class from the persisted variant', async () => {
    // Persist a dark theme variant setting
    MockFs.writeJsonFile('app-data/stores/theme.json', { variant: 'dark' });

    // Initialize the theme
    await initializeTheme();

    // Wait for async event dispatch
    await flushEvents();

    // Should apply the dark theme class to <body>
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });

  it('resolves the system variant from the OS preference', async () => {
    // Mock match media to return a match for dark mode
    mockMatchMedia('dark');

    // Initialize the theme with the default 'system' variant
    await initializeTheme();

    // Wait for async event dispatch
    await flushEvents();

    // Should apply the dark theme class to <body>
    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });

  it('applies the light theme class when the resolved appearance is light', async () => {
    // Initialize the theme with the default 'system' variant
    // and a light OS appearance
    await initializeTheme();

    // Wait for async event dispatch
    await flushEvents();

    // Should apply the light theme class to <body>
    expect(document.body.classList.contains('light-theme')).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  it('updates the appearance class when the variant changes', async () => {
    // Initialize the theme with a light appearance
    await initializeTheme();
    await flushEvents();

    // Change the variant to dark
    Theme.setVariant('dark');

    // Wait for async event dispatch
    await flushEvents();

    // Should swap the appearance classes on <body>
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });

  it('updates the appearance class when the OS preference changes', async () => {
    // Initialize the theme with the default 'system' variant
    // and a light OS appearance
    await initializeTheme();
    await flushEvents();

    // Simulate the OS switching to dark mode
    simulateOsAppearanceChange('dark');

    // Wait for async event dispatch
    await flushEvents();

    // Should apply the dark theme class to <body>
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });

  it('applies the classes from persisted image settings', async () => {
    // Persist image dimming and light image inversion settings
    MockFs.writeJsonFile('app-data/stores/theme.json', {
      imageDimming: '3',
      invertLightImages: true,
    });

    // Initialize the theme
    await initializeTheme();

    // Wait for async event dispatch
    await flushEvents();

    // Should apply the image dimming class to <body>
    expect(document.body.classList.contains('image-dimming-3')).toBe(true);

    // Should apply the light image inversion class to <body>
    expect(document.body.classList.contains('image-invert-light')).toBe(true);
  });

  it('updates the image dimming class when the setting changes', async () => {
    // Initialize the theme
    await initializeTheme();
    await flushEvents();

    // Set the image dimming level
    Theme.setImageDimming('2');

    // Wait for async event dispatch
    await flushEvents();

    // Should apply the image dimming class to <body>
    expect(document.body.classList.contains('image-dimming-2')).toBe(true);

    // Turn image dimming off
    Theme.setImageDimming('off');

    // Wait for async event dispatch
    await flushEvents();

    // Should remove all image dimming classes from <body>
    expect(document.body.classList.contains('image-dimming-1')).toBe(false);
    expect(document.body.classList.contains('image-dimming-2')).toBe(false);
    expect(document.body.classList.contains('image-dimming-3')).toBe(false);
  });

  it('toggles the light image inversion class when the setting changes', async () => {
    // Initialize the theme
    await initializeTheme();
    await flushEvents();

    // Enable light image inversion
    Theme.setInvertLightImages(true);

    // Wait for async event dispatch
    await flushEvents();

    // Should apply the light image inversion class to <body>
    expect(document.body.classList.contains('image-invert-light')).toBe(true);

    // Disable light image inversion
    Theme.setInvertLightImages(false);

    // Wait for async event dispatch
    await flushEvents();

    // Should remove the light image inversion class from <body>
    expect(document.body.classList.contains('image-invert-light')).toBe(false);
  });
});
