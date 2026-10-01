import { afterEach, describe, expect, it } from 'vitest';
import { createTestEditor } from '@minddrop/editor/test-utils';
import { registerPaneEditor } from '../registerPaneEditor';
import { cleanup } from '../test-utils';
import { unregisterPaneEditor } from '../unregisterPaneEditor';
import { updateFocusedPaneEditor } from '../updateFocusedPaneEditor';
import { resolvePaneEditor } from './resolvePaneEditor';

const paneKey = 'area:main';

describe('resolvePaneEditor', () => {
  afterEach(cleanup);

  it('returns null for a pane rendering no editor', () => {
    expect(resolvePaneEditor(paneKey)).toBeNull();
  });

  it('returns the first editor rendered in the pane', () => {
    const first = createTestEditor();
    const second = createTestEditor();

    registerPaneEditor(paneKey, first);
    registerPaneEditor(paneKey, second);

    expect(resolvePaneEditor(paneKey)).toBe(first);
  });

  it('prefers the editor last focused in the pane', () => {
    const first = createTestEditor();
    const second = createTestEditor();

    registerPaneEditor(paneKey, first);
    registerPaneEditor(paneKey, second);
    updateFocusedPaneEditor(paneKey, second);

    expect(resolvePaneEditor(paneKey)).toBe(second);
  });

  it('forgets an editor once it is unregistered', () => {
    const first = createTestEditor();
    const second = createTestEditor();

    registerPaneEditor(paneKey, first);
    registerPaneEditor(paneKey, second);
    updateFocusedPaneEditor(paneKey, second);
    unregisterPaneEditor(paneKey, second);

    expect(resolvePaneEditor(paneKey)).toBe(first);
  });

  it('skips the first editor once it is unregistered', () => {
    const first = createTestEditor();
    const second = createTestEditor();

    registerPaneEditor(paneKey, first);
    registerPaneEditor(paneKey, second);
    unregisterPaneEditor(paneKey, first);

    expect(resolvePaneEditor(paneKey)).toBe(second);
  });
});
