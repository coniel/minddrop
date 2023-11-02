import { act, MockFsAdapter } from '@minddrop/test-utils';
import { registerFileSystemAdapter } from '@minddrop/core';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeLight, ThemeSystem } from '../constants';
import { Events } from '@minddrop/events';

export function setup() {
  // Reigster mock file system adapter
  registerFileSystemAdapter(MockFsAdapter);
}

export function cleanup() {
  // Clear all event listeners
  Events._clearAll();

  act(() => {
    // Reset the appearance to the default value
    ThemeConfig.set('appearance', ThemeLight);
    // Reset the appearance setting to the default value
    ThemeConfig.set('appearanceSetting', ThemeSystem);
  });
}
