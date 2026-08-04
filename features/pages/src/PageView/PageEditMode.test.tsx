import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ElementTemplates } from '@minddrop/designs';
import {
  DesignStudioStore,
  addDeisgnElementFromTemplate,
} from '@minddrop/feature-designs';
import { PageFixtures, Pages } from '@minddrop/pages';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { PageViewStateStore, setPageViewState } from '../PageViewStateStore';
import { MockFs, cleanup, setup } from '../test-utils';
import { PageEditMode } from './PageEditMode';

const { page_1 } = PageFixtures;

describe('<PageEditMode />', () => {
  beforeEach(() => {
    setup();

    // Load the page into the store and its file into the mock
    // file system so edits can be written
    Pages.Store.load([page_1]);
    MockFs.addFiles(PageFixtures.pageFiles);
  });

  afterEach(() => {
    cleanup();
    DesignStudioStore.getState().clear();
    PageViewStateStore.clear();
  });

  it('initializes the layout editor session for the page', () => {
    render(<PageEditMode page={page_1} />);

    const state = DesignStudioStore.getState();

    // The page's layout is active with property binding disabled
    expect(state.activeLayoutId).toBe(page_1.layout.id);
    expect(state.propertyBindingEnabled).toBe(false);
  });

  it('persists element edits to the page', async () => {
    render(<PageEditMode page={page_1} />);

    // Add a text element from its template
    addDeisgnElementFromTemplate(ElementTemplates.text, 'root', 0);

    await waitFor(() => {
      // The added element was saved into the page's layout
      expect(Pages.get(page_1.id).layout.tree.children.length).toBe(1);
    });
  });

  it('deletes the highlighted element on Delete', async () => {
    render(<PageEditMode page={page_1} />);
    const user = userEvent.setup();

    // Add an element (added elements are selected and highlighted)
    addDeisgnElementFromTemplate(ElementTemplates.text, 'root', 0);

    await user.keyboard('{Delete}');

    await waitFor(() => {
      // The element was removed from the page's layout
      expect(Pages.get(page_1.id).layout.tree.children.length).toBe(0);
    });
  });

  it('exits edit mode on Escape', async () => {
    // Enter edit mode
    setPageViewState(page_1.id, { editing: true });

    render(<PageEditMode page={page_1} />);
    const user = userEvent.setup();

    await user.keyboard('{Escape}');

    // Edit mode was exited
    expect(PageViewStateStore.get(page_1.id)?.editing).toBe(false);
  });

  it('exits edit mode via the back button', async () => {
    // Enter edit mode
    setPageViewState(page_1.id, { editing: true });

    render(<PageEditMode page={page_1} />);
    const user = userEvent.setup();

    // Click the panel's back button
    await user.click(screen.getByLabelText('pages.view.actions.exitEditMode'));

    // Edit mode was exited
    expect(PageViewStateStore.get(page_1.id)?.editing).toBe(false);
  });

  it('clears the editor session on unmount', () => {
    const { unmount } = render(<PageEditMode page={page_1} />);

    unmount();

    expect(DesignStudioStore.getState().initialized).toBe(false);
  });
});
