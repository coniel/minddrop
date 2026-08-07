import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsUiState } from '../DevToolsUiState';
import { cleanup, setup } from '../test-utils';
import { closeDevTools } from './closeDevTools';

describe('closeDevTools', () => {
  beforeEach(() => {
    setup();

    DevToolsUiState.set('open', true);
  });

  afterEach(cleanup);

  it('closes the dev tools', () => {
    closeDevTools();

    expect(DevToolsUiState.get('open')).toBe(false);
  });
});
