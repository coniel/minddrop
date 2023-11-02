import { act, MockFsAdapter } from '@minddrop/test-utils';
import { initializeCore, registerFileSystemAdapter } from '@minddrop/core';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeLight, ThemeSystem } from '../constants';

export const core = initializeCore({
  extensionId: 'minddrop:theme',
});

export function setup() {
  // Reigster mock file system adapter
  registerFileSystemAdapter(MockFsAdapter);
}

export function cleanup() {
  act(() => {
    // Reset the appearance to the default value
    ThemeConfig.set('appearance', ThemeLight);
    // Reset the appearance setting to the default value
    ThemeConfig.set('appearanceSetting', ThemeSystem);
  });
}
