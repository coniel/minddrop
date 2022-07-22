import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useThemeStore } from '../useThemeStore';

export const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:theme',
});

export function setup() {
  //
}

export function cleanup() {
  act(() => {
    // Reset the appearance to the default value
    useThemeStore.getState().setAppearance('light');
    // Reset the appearance setting to the default value
    useThemeStore.getState().setAppearanceSetting('system');
  });
}
