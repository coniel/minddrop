import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsUiState } from '../DevToolsUiState';
import { cleanup, setup } from '../test-utils';
import { toggleDevTools } from './toggleDevTools';

describe('toggleDevTools', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('opens closed dev tools', () => {
    toggleDevTools();

    expect(DevToolsUiState.get('open')).toBe(true);
  });

  it('closes open dev tools', () => {
    DevToolsUiState.set('open', true);

    toggleDevTools();

    expect(DevToolsUiState.get('open')).toBe(false);
  });
});
