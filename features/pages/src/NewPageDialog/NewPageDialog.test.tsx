import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DefaultPageIcon, Pages } from '@minddrop/pages';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { OpenNewPageDialogEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { NewPageDialog } from './NewPageDialog';

describe('<NewPageDialog />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens on open event', async () => {
    render(<NewPageDialog />);

    Events.dispatch(OpenNewPageDialogEvent);

    await waitFor(() => {
      screen.getByText('pages.templates.blank.description');
    });
  });

  it('closes on cancel', async () => {
    render(<NewPageDialog defaultOpen />);
    const user = userEvent.setup();

    // Click the cancel button
    await user.click(screen.getByText('actions.cancel'));

    await waitFor(() => {
      expect(
        screen.queryByText('pages.templates.blank.description'),
      ).toBeNull();
    });
  });

  it('requires a name', async () => {
    render(<NewPageDialog defaultOpen />);
    const user = userEvent.setup();

    // Submit without filling in the name
    await user.click(screen.getByText('pages.form.actions.create'));

    // No page was created
    expect(Pages.Store.getAllArray()).toEqual([]);
  });

  it('creates the page on submit', async () => {
    render(<NewPageDialog defaultOpen />);
    const user = userEvent.setup();

    // Fill in the page name
    await user.type(screen.getByLabelText('pages.form.name.label'), 'Media');

    // Submit the form
    await user.click(screen.getByText('pages.form.actions.create'));

    await waitFor(() => {
      // The page was created with the name and default icon
      const page = Pages.Store.getAllArray()[0];

      expect(page.name).toBe('Media');
      expect(page.icon).toBe(DefaultPageIcon);
    });
  });
});
