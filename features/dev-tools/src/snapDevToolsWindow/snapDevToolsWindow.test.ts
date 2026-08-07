import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsUiState } from '../DevToolsUiState';
import { SnappedWindowGap, SnappedWindowWidth } from '../constants';
import { cleanup, setup } from '../test-utils';
import { snapDevToolsWindow } from './snapDevToolsWindow';

describe('snapDevToolsWindow', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('snaps the window to the left', () => {
    snapDevToolsWindow('left');

    expect(DevToolsUiState.get('windowX')).toBe(SnappedWindowGap);
    expect(DevToolsUiState.get('windowY')).toBe(SnappedWindowGap);
    expect(DevToolsUiState.get('windowWidth')).toBe(SnappedWindowWidth);
    expect(DevToolsUiState.get('windowHeight')).toBe(
      window.innerHeight - SnappedWindowGap * 2,
    );
  });

  it('snaps the window to the right', () => {
    snapDevToolsWindow('right');

    expect(DevToolsUiState.get('windowX')).toBe(
      window.innerWidth - SnappedWindowWidth - SnappedWindowGap,
    );
  });
});
