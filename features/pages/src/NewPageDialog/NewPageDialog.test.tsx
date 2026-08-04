import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { OpenNewPageDialogEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { NewPageDialog } from './NewPageDialog';

const { layout_page_1, layout_page_2 } = DesignFixtures;

describe('<NewPageDialog />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens on open event', async () => {
    render(<NewPageDialog />);

    Events.dispatch(OpenNewPageDialogEvent);

    await waitFor(() => {
      screen.getByText('pages.form.layout.preview.empty');
    });
  });

  it('closes on cancel', async () => {
    render(<NewPageDialog defaultOpen />);
    const user = userEvent.setup();

    // Click the cancel button
    await user.click(screen.getByText('actions.cancel'));

    await waitFor(() => {
      expect(screen.queryByText('pages.form.layout.preview.empty')).toBeNull();
    });
  });

  it('lists page layouts from all designs', async () => {
    render(<NewPageDialog defaultOpen />);

    // Page layouts from both designs are listed
    screen.getByText(layout_page_1.name);
    screen.getByText(layout_page_2.name);
  });

  it('filters layouts by search query', async () => {
    render(<NewPageDialog defaultOpen />);
    const user = userEvent.setup();

    // Search for the second page layout by name
    await user.type(
      screen.getByPlaceholderText('pages.form.layout.search.placeholder'),
      layout_page_2.name,
    );

    await waitFor(() => {
      expect(screen.queryByText(layout_page_1.name)).toBeNull();
      screen.getByText(layout_page_2.name);
    });
  });

  it('advances to the properties step when a layout is selected', async () => {
    render(<NewPageDialog defaultOpen />);
    const user = userEvent.setup();

    // Select a layout
    await user.click(screen.getByText(layout_page_1.name));

    // Advance to the properties step
    await user.click(screen.getByText('pages.form.actions.next'));

    await waitFor(() => {
      screen.getByText('pages.form.actions.back');
    });
  });
});
