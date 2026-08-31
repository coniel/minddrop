import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { Tags } from '@minddrop/tags';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { MenuItem } from '@minddrop/ui-primitives';
import { cleanup, setup } from '../test-utils';
import { TagItemActions } from './TagItemActions';

const { tag_1 } = TagFixtures;

// Renders the actions inside a menu item, matching how the list
// renders them
function renderActions() {
  return render(
    <MenuItem
      stringLabel={tag_1.name}
      actions={<TagItemActions tag={tag_1} />}
    />,
  );
}

describe('<TagItemActions />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renames the tag on rename commit', async () => {
    renderActions();
    const user = userEvent.setup();

    // Open the options menu and start renaming
    await user.click(screen.getByLabelText('tags.actions.options'));
    await user.click(await screen.findByText('tags.actions.rename'));

    // Replace the name and commit it with Enter
    const nameInput = screen.getByDisplayValue(tag_1.name);
    await user.clear(nameInput);
    await user.type(nameInput, 'Renamed Tag{Enter}');

    // The rename should be persisted to the store
    await waitFor(() => {
      expect(Tags.get(tag_1.id).name).toBe('Renamed Tag');
    });
  });

  it('deletes the tag on confirmed delete', async () => {
    renderActions();
    const user = userEvent.setup();

    // Confirm the deletion as soon as the confirmation is requested
    Events.addListener(
      OpenConfirmationDialogEvent,
      'test-confirm',
      ({ data }) => {
        data.onConfirm();
      },
    );

    // Open the options menu and click the delete action
    await user.click(screen.getByLabelText('tags.actions.options'));
    await user.click(await screen.findByText('tags.actions.delete.label'));

    // The tag should be removed from the store
    await waitFor(() => {
      expect(Tags.get(tag_1.id, false)).toBeNull();
    });
  });
});
