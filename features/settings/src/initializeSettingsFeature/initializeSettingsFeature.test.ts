import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { OpenViewEvent } from '@minddrop/views';
import { SettingsViewId, SettingsViewName } from '../constants';
import { OpenSettingsEvent } from '../events';
import { cleanup } from '../test-utils';
import { initializeSettingsFeature } from './initializeSettingsFeature';

describe('initializeSettingsFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    // Register the feature's event listeners
    removeEventListeners = initializeSettingsFeature();
  });

  afterEach(() => {
    removeEventListeners();
    cleanup();
  });

  it('opens the settings view on open settings events', () =>
    new Promise<void>((resolve) => {
      Events.addListener(OpenViewEvent, 'test-open-settings', (data) => {
        // The settings view opens with the requested settings view
        expect(data.view).toBe(SettingsViewName);
        expect(data.id).toBe(SettingsViewId);
        expect(data.props!.view).toBe('databases');
        resolve();
      });

      Events.dispatch(OpenSettingsEvent, { view: 'databases' });
    }));
});
