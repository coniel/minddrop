import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ElementTemplates } from '@minddrop/designs';
import {
  DesignStudioStore,
  addDesignElementFromTemplate,
} from '@minddrop/feature-designs';
import { SpaceFixtures, Spaces } from '@minddrop/spaces';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { SpaceViewStateStore, setSpaceViewState } from '../SpaceViewStateStore';
import { MockFs, cleanup, setup } from '../test-utils';
import { SpaceEditMode } from './SpaceEditMode';

const { space_1 } = SpaceFixtures;

describe('<SpaceEditMode />', () => {
  beforeEach(() => {
    setup();

    // Load the space into the store and its file into the mock
    // file system so edits can be written
    Spaces.Store.load([space_1]);
    MockFs.addFiles(SpaceFixtures.spaceFiles);
  });

  afterEach(() => {
    cleanup();
    DesignStudioStore.clear();
    SpaceViewStateStore.clear();
  });

  it('initializes the layout editor session for the space', () => {
    render(<SpaceEditMode space={space_1} />);

    // The space's layout is active with property binding disabled
    expect(DesignStudioStore.getActiveLayoutId()).toBe(space_1.layout.id);
    expect(DesignStudioStore.isPropertyBindingEnabled()).toBe(false);
  });

  it('persists element edits to the space', async () => {
    render(<SpaceEditMode space={space_1} />);

    // Add a text element from its template
    addDesignElementFromTemplate(ElementTemplates.text, 'root', 0);

    await waitFor(() => {
      // The added element was saved into the space's layout
      expect(Spaces.get(space_1.id).layout.tree.children.length).toBe(1);
    });
  });

  it('deletes the highlighted element on Delete', async () => {
    render(<SpaceEditMode space={space_1} />);
    const user = userEvent.setup();

    // Add an element (added elements are selected and highlighted)
    addDesignElementFromTemplate(ElementTemplates.text, 'root', 0);

    await user.keyboard('{Delete}');

    await waitFor(() => {
      // The element was removed from the space's layout
      expect(Spaces.get(space_1.id).layout.tree.children.length).toBe(0);
    });
  });

  it('exits edit mode on Escape', async () => {
    // Enter edit mode
    setSpaceViewState(space_1.id, { editing: true });

    render(<SpaceEditMode space={space_1} />);
    const user = userEvent.setup();

    await user.keyboard('{Escape}');

    // Edit mode was exited
    expect(SpaceViewStateStore.get(space_1.id)?.editing).toBe(false);
  });

  it('exits edit mode via the back button', async () => {
    // Enter edit mode
    setSpaceViewState(space_1.id, { editing: true });

    render(<SpaceEditMode space={space_1} />);
    const user = userEvent.setup();

    // Click the panel's back button
    await user.click(screen.getByLabelText('spaces.view.actions.exitEditMode'));

    // Edit mode was exited
    expect(SpaceViewStateStore.get(space_1.id)?.editing).toBe(false);
  });

  it('clears the editor session on unmount', () => {
    const { unmount } = render(<SpaceEditMode space={space_1} />);

    unmount();

    expect(DesignStudioStore.isInitialized()).toBe(false);
  });
});
