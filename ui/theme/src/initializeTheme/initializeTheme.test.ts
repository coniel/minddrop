import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { Events } from '@minddrop/events';
import { ThemeStore } from '../ThemeStore';
import { ThemeDark, ThemeLight, ThemeSystem } from '../constants';
import { VariantChangedEvent, VariantChangedEventData } from '../events';
import { setThemeVariant } from '../setThemeVariant';
import { cleanup, setup } from '../test-utils';
import { ResolvedThemeVariant } from '../types';
import { initializeTheme } from './initializeTheme';

// Short delay to wait for async event dispatch
const waitForEvents = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

describe('initializeTheme', () => {
  let matchMediaEventListeners: VoidFunction[] = [];

  function mockMatchMedia(appearance: ResolvedThemeVariant = ThemeLight) {
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

  function simulateOsAppearanceChange(appearance: ResolvedThemeVariant) {
    // Mock match media to return a match for
    // the specified appearance.
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
    ThemeStore.set('variant', ThemeSystem);

    // Clear mock match media event listeners
    matchMediaEventListeners = [];
  });

  it('loads the variant value from the local persistent store', () => {
    // Set the initial variant value in the local persistent store
    ThemeStore.set('variant', ThemeDark);

    // Initialize theme
    initializeTheme();

    // Should keep the variant from the local persistent store
    expect(ThemeStore.get('variant')).toBe(ThemeDark);
  });

  describe('initial theme variant', () => {
    it('dispatches resolved OS value when the variant is `system`', async () => {
      // Mock match media to return a match for dark mode
      mockMatchMedia(ThemeDark);
      // Set the initial variant value to 'system'
      ThemeStore.set('variant', ThemeSystem);

      // Track dispatched event data
      let eventData: VariantChangedEventData | null = null;

      Events.addListener<VariantChangedEventData>(
        VariantChangedEvent,
        'test',
        (payload) => {
          eventData = payload.data;
        },
      );

      // Initialize theme
      initializeTheme();

      // Wait for async event dispatch
      await waitForEvents();

      // Should dispatch with system variant and resolved dark
      expect(eventData?.variant).toBe(ThemeSystem);
      expect(eventData?.resolvedAppearance).toBe(ThemeDark);
    });

    it('dispatches resolved value when the variant is `light` or `dark`', async () => {
      // Mock match media to return a match for light mode
      mockMatchMedia(ThemeLight);
      // Set the initial variant value to 'dark'
      ThemeStore.set('variant', ThemeDark);

      // Track dispatched event data
      let eventData: VariantChangedEventData | null = null;

      Events.addListener<VariantChangedEventData>(
        VariantChangedEvent,
        'test',
        (payload) => {
          eventData = payload.data;
        },
      );

      // Initialize theme
      initializeTheme();

      // Wait for async event dispatch
      await waitForEvents();

      // Should dispatch with dark variant and resolved dark
      expect(eventData?.variant).toBe(ThemeDark);
      expect(eventData?.resolvedAppearance).toBe(ThemeDark);
    });

    it('listens for OS dark mode changes when variant is `system`', async () => {
      // Mock match media to return a match for light mode
      mockMatchMedia(ThemeLight);
      // Set the initial variant value to 'system'
      ThemeStore.set('variant', ThemeSystem);

      // Initialize theme
      initializeTheme();

      // Wait for async event dispatch from initialization
      await waitForEvents();

      // Track dispatched event data
      let eventData: VariantChangedEventData | null = null;

      Events.addListener<VariantChangedEventData>(
        VariantChangedEvent,
        'test',
        (payload) => {
          eventData = payload.data;
        },
      );

      // Simulate OS appearance change to dark mode
      simulateOsAppearanceChange(ThemeDark);

      // Wait for async event dispatch
      await waitForEvents();

      // Should dispatch with resolved dark appearance
      expect(eventData?.resolvedAppearance).toBe(ThemeDark);
    });
  });

  describe('theme variant change', () => {
    it('updates the local persistent store variant value', async () => {
      // Initialize theme
      initializeTheme();

      // Change the variant value
      setThemeVariant(ThemeDark);

      // Wait for the event to be dispatched
      await waitForEvents();

      // Should set the new variant in the local persistent store
      expect(ThemeStore.get('variant')).toBe(ThemeDark);
    });

    it('listens for OS dark mode changes if variant is `system`', async () => {
      // Mock match media to return a match for light mode
      mockMatchMedia(ThemeLight);
      // Set the initial variant value to 'light'
      ThemeStore.set('variant', ThemeLight);

      // Initialize theme
      initializeTheme();

      // Set the theme variant to 'system'
      setThemeVariant(ThemeSystem);

      // Wait for the event listener to run
      await waitForEvents();

      // Track the resolved appearance from the event
      let lastResolvedAppearance: string | null = null;

      Events.addListener<VariantChangedEventData>(
        VariantChangedEvent,
        'test-os-change',
        (payload) => {
          lastResolvedAppearance = payload.data.resolvedAppearance;
        },
      );

      // Simulate OS appearance change to dark mode
      simulateOsAppearanceChange(ThemeDark);

      // Wait for async event dispatch
      await waitForEvents();

      // Should have dispatched with dark resolved appearance
      expect(lastResolvedAppearance).toBe(ThemeDark);
    });

    it('removes OS dark mode changes listener if variant is `light` or `dark`', async () => {
      // Mock match media to return a match for dark mode
      mockMatchMedia(ThemeDark);
      // Set the initial variant value to 'system'
      ThemeStore.set('variant', ThemeSystem);

      // Initialize theme
      initializeTheme();

      // Set the theme variant to 'dark'
      setThemeVariant(ThemeDark);

      // Wait for the event listener to run
      await waitForEvents();

      // Track whether a new event is dispatched
      let eventDispatched = false;

      Events.addListener<VariantChangedEventData>(
        VariantChangedEvent,
        'test-no-os-change',
        () => {
          eventDispatched = true;
        },
      );

      // Simulate OS appearance change to light mode
      simulateOsAppearanceChange(ThemeLight);

      // Wait to ensure no event fires
      await waitForEvents();

      // No event should have been dispatched since
      // OS listener was removed.
      expect(eventDispatched).toBe(false);
    });
  });
});
