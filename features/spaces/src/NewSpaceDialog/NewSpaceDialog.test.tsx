import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DefaultSpaceIcon, Spaces } from '@minddrop/spaces';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { OpenNewSpaceDialogEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { NewSpaceDialog } from './NewSpaceDialog';

describe('<NewSpaceDialog />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens on open event', async () => {
    render(<NewSpaceDialog />);

    Events.dispatch(OpenNewSpaceDialogEvent);

    await waitFor(() => {
      screen.getByText('spaces.templates.blank.description');
    });
  });

  it('closes on cancel', async () => {
    render(<NewSpaceDialog defaultOpen />);
    const user = userEvent.setup();

    // Click the cancel button
    await user.click(screen.getByText('actions.cancel'));

    await waitFor(() => {
      expect(
        screen.queryByText('spaces.templates.blank.description'),
      ).toBeNull();
    });
  });

  it('requires a name', async () => {
    render(<NewSpaceDialog defaultOpen />);
    const user = userEvent.setup();

    // Submit without filling in the name
    await user.click(screen.getByText('spaces.form.actions.create'));

    // No space was created
    expect(Spaces.Store.getAllArray()).toEqual([]);
  });

  it('creates the space on submit', async () => {
    render(<NewSpaceDialog defaultOpen />);
    const user = userEvent.setup();

    // Fill in the space name
    await user.type(screen.getByLabelText('spaces.form.name.label'), 'Media');

    // Submit the form
    await user.click(screen.getByText('spaces.form.actions.create'));

    await waitFor(() => {
      // The space was created with the name and default icon
      const space = Spaces.Store.getAllArray()[0];

      expect(space.name).toBe('Media');
      expect(space.icon).toBe(DefaultSpaceIcon);
    });
  });
});
