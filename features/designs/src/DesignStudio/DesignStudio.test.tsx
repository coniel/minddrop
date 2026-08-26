import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import { UpdateViewEvent, UpdateViewEventData } from '@minddrop/views';
import { DesignStudioViewId, DesignStudioViewTitle } from '../constants';
import { DesignStudioViewProps } from '../events';
import { cleanup, setup } from '../test-utils';
import { DesignStudio } from './DesignStudio';

const { design_books } = DesignFixtures;

const ListenerId = 'design-studio-test';

describe('<DesignStudio />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    Events.removeListener(UpdateViewEvent, ListenerId);
    cleanup();
  });

  it('records the opened design on the view', async () => {
    const updates = captureViewUpdates();

    render(<DesignStudio />);

    // Open a design from the dashboard
    await userEvent.click(screen.getByText(design_books.name));

    // The design is recorded on the view so that it survives the
    // view remounting
    expect(updates).toContainEqual({
      id: DesignStudioViewId,
      props: { designId: design_books.id, fromDashboard: true },
    });
  });

  it('opens the design recorded on the view', () => {
    render(<DesignStudio designId={design_books.id} fromDashboard />);

    // The recorded design is open rather than the dashboard
    expect(screen.queryByText('design-studio.labels.designs')).toBeNull();
  });

  it('titles the view after the open design', async () => {
    const updates = captureViewUpdates();

    render(<DesignStudio />);

    // The studio's own title is used while no design is open
    expect(updates.at(-1)).toEqual({
      id: DesignStudioViewId,
      title: i18n.t(DesignStudioViewTitle),
    });

    // Open a design from the dashboard
    await userEvent.click(screen.getByText(design_books.name));

    // The open design titles the view, labelling its tab
    expect(updates.at(-1)).toEqual({
      id: DesignStudioViewId,
      title: design_books.name,
    });
  });
});

/**
 * Collects the view updates dispatched by the studio into an array.
 */
function captureViewUpdates(): UpdateViewEventData<DesignStudioViewProps>[] {
  const updates: UpdateViewEventData<DesignStudioViewProps>[] = [];

  Events.addListener(UpdateViewEvent, ListenerId, ({ data }) => {
    updates.push(data);
  });

  return updates;
}
