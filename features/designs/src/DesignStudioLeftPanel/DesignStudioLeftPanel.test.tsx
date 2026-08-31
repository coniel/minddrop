import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import { CanvasProvider } from '@minddrop/ui-canvas';
import {
  TransientViewStateContextValue,
  TransientViewStateProvider,
} from '@minddrop/ui-primitives';
import {
  DesignStudioProvider,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { createDesignStudioCanvasStore } from '../createDesignStudioCanvasStore';
import { cleanup, setup } from '../test-utils';
import { DesignStudioLeftPanel } from './DesignStudioLeftPanel';

const { design_books, design_space_virtual, layout_card_1 } = DesignFixtures;

describe('<DesignStudioLeftPanel />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the properties tab for database designs', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderPanel(studio);

    screen.getByText('design-studio.labels.properties');
  });

  it('omits the properties tab for designs without properties', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_space_virtual);

    renderPanel(studio);

    // Space designs carry no property schema
    expect(screen.queryByText('design-studio.labels.properties')).toBeNull();

    // The layouts tab is still rendered
    screen.getByText('design-studio.labels.layouts');
  });
  it('closes the open layout from the header back button', async () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);

    renderPanel(studio);

    await userEvent.click(
      screen.getByLabelText('designsStudio.layouts.backToLayouts'),
    );

    // The layout closed, and with it the back button is hidden,
    // keeping its space so the tabs do not shift
    expect(studio.getActiveLayoutId()).toBeNull();
    expect(
      screen.getByLabelText('designsStudio.layouts.backToLayouts'),
    ).toHaveClass('panel-view-back-button-hidden');
  });

  it('opens on the tab it was left on', async () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    // Stands in for the tab the studio is rendered in
    const bag: Record<string, unknown> = {};
    const value = {
      get: (key: string) => bag[key],
      set: (key: string, storedValue: unknown) => {
        bag[key] = storedValue;
      },
    };

    const panel = renderPanel(studio, value);

    await userEvent.click(screen.getByText('design-studio.labels.properties'));

    // Switch away from the tab, which unmounts the panel
    panel.unmount();

    renderPanel(studio, value);

    expect(
      screen
        .getByText('design-studio.labels.properties')
        .closest('[role="tab"]')
        ?.getAttribute('aria-selected'),
    ).toBe('true');
  });
});

/**
 * Renders the panel within the given studio instance, optionally
 * backed by a transient view state bag.
 */
function renderPanel(
  studio: ReturnType<typeof createDesignStudioStore>,
  viewState?: TransientViewStateContextValue,
) {
  const panel = (
    <DesignStudioProvider store={studio}>
      <CanvasProvider store={createDesignStudioCanvasStore()}>
        <DesignStudioLeftPanel />
      </CanvasProvider>
    </DesignStudioProvider>
  );

  if (!viewState) {
    return render(panel);
  }

  return render(
    <TransientViewStateProvider value={viewState}>
      {panel}
    </TransientViewStateProvider>,
  );
}
