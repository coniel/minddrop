import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BuiltInDesignRoles, DesignRoles, Designs } from '@minddrop/designs';
import {
  DesignStudioStore,
  createDesignStudioStore,
  insertRoleElement,
} from '@minddrop/feature-designs';
import { Spaces } from '@minddrop/spaces';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { SpaceViewStateStore, setSpaceViewState } from '../SpaceViewStateStore';
import { MockFs, cleanup, setup } from '../test-utils';
import { SpaceEditMode } from './SpaceEditMode';

const { space_1 } = SpaceFixtures;

describe('<SpaceEditMode />', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Studio store instance passed into the editor so the tests
    // can drive and inspect the session
    studio = createDesignStudioStore();

    // Register the built-in design roles used by the palette
    BuiltInDesignRoles.forEach(DesignRoles.register);

    // Load the space and its owned design into the stores, and
    // its file into the mock file system so edits can be written
    Spaces.Store.load([space_1]);
    Designs.loadVirtual([space_1.design]);
    MockFs.addFiles(SpaceFixtures.getSpaceFiles());
  });

  afterEach(() => {
    cleanup();
    Designs.Store.clear();
    DesignRoles.Store.clear();
    SpaceViewStateStore.clear();
  });

  it('initializes the layout editor session for the space', () => {
    render(<SpaceEditMode space={space_1} studio={studio} />);

    // The space's layout is active with property binding disabled
    expect(studio.getActiveLayoutId()).toBe(space_1.design.layouts[0].id);
    expect(studio.isPropertyBindingEnabled()).toBe(false);
  });

  it('persists element edits through the space design', async () => {
    render(<SpaceEditMode space={space_1} studio={studio} />);

    // Insert a heading element into the layout root
    insertRoleElement(studio, 'heading', 'root', 0);

    await waitFor(() => {
      // The added element was saved into the space's design
      const design = Designs.get(space_1.design.id);

      expect(design.layouts[0].tree.children.length).toBe(1);
    });
  });

  it('deletes the highlighted element on Delete', async () => {
    render(<SpaceEditMode space={space_1} studio={studio} />);
    const user = userEvent.setup();

    // Insert an element (inserted elements are selected and
    // highlighted)
    insertRoleElement(studio, 'heading', 'root', 0);

    await user.keyboard('{Delete}');

    // Force the debounced save through
    await studio.flushSave();

    // The element was removed from the space's design
    const design = Designs.get(space_1.design.id);

    expect(design.layouts[0].tree.children.length).toBe(0);
  });

  it('exits edit mode on Escape', async () => {
    // Enter edit mode
    setSpaceViewState(space_1.id, { editing: true });

    render(<SpaceEditMode space={space_1} studio={studio} />);
    const user = userEvent.setup();

    await user.keyboard('{Escape}');

    // Edit mode was exited
    expect(SpaceViewStateStore.get(space_1.id)?.editing).toBe(false);
  });

  it('exits edit mode via the back button', async () => {
    // Enter edit mode
    setSpaceViewState(space_1.id, { editing: true });

    render(<SpaceEditMode space={space_1} studio={studio} />);
    const user = userEvent.setup();

    // Click the panel's back button
    await user.click(screen.getByLabelText('spaces.view.actions.exitEditMode'));

    // Edit mode was exited
    expect(SpaceViewStateStore.get(space_1.id)?.editing).toBe(false);
  });

  it('clears the editor session on unmount', () => {
    const { unmount } = render(
      <SpaceEditMode space={space_1} studio={studio} />,
    );

    unmount();

    expect(studio.isInitialized()).toBe(false);
  });
});
