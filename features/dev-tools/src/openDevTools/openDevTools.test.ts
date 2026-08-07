import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsUiState } from '../DevToolsUiState';
import { cleanup, setup } from '../test-utils';
import { openDevTools } from './openDevTools';

describe('openDevTools', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('opens the dev tools', () => {
    openDevTools();

    expect(DevToolsUiState.get('open')).toBe(true);
  });

  it('activates the requested panel', () => {
    openDevTools('logs');

    expect(DevToolsUiState.get('activePanelId')).toBe('logs');
  });

  it('keeps the active panel when none is requested', () => {
    openDevTools('logs');
    openDevTools();

    expect(DevToolsUiState.get('activePanelId')).toBe('logs');
  });
});
