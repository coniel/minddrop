import { vi } from 'vitest';
import { act, cleanup as cleanupRender } from '@minddrop/test-utils';
import { elementConfigs } from './editor.data';
import { registerElementConfig } from '../registerElementConfig';
import { defaultMarkConfigs } from '../default-mark-configs';
import { registerMarkConfig } from '../registerMarkConfig';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { ElementConfigsStore } from '../ElementConfigsStore';

export function setup() {
  act(() => {
    // Register element types
    elementConfigs.forEach((config) => {
      registerElementConfig(config);
    });

    // Register marks
    defaultMarkConfigs.forEach((config) => registerMarkConfig(config));
  });
}

export function cleanup() {
  // React testing library cleanup
  cleanupRender();

  act(() => {
    // Clear all mock functions
    vi.clearAllMocks();

    // Clear registered elements
    ElementConfigsStore.clear();

    // Clear registered marks
    MarkConfigsStore.clear();
  });
}
