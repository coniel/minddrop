import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { TagGroups, Tags } from '@minddrop/tags';
import { TagFixtures, TagGroupFixtures } from '@minddrop/tags/test-utils';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { cleanup, setup } from '../test-utils';
import { TagsView } from './TagsView';

const { tag_1 } = TagFixtures;
const { tagGroup_1 } = TagGroupFixtures;

// Renders the view inside a subview context
function renderView() {
  return render(
    <Views.SubviewProvider subview={null}>
      <TagsView />
    </Views.SubviewProvider>,
  );
}

describe('<TagsView />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renames a tag via its item menu', async () => {
    renderView();
    const user = userEvent.setup();

    // Open the first tag's menu and start renaming
    await user.click(screen.getAllByLabelText('tags.actions.options')[0]);
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

  it('deletes a tag via its context menu', async () => {
    renderView();
    const user = userEvent.setup();

    // Confirm the deletion as soon as the confirmation is requested
    Events.addListener(OpenConfirmationDialogEvent, 'test-confirm', (data) => {
      data.onConfirm();
    });

    // Open the tag's context menu and click the delete action
    fireEvent.contextMenu(screen.getByText(tag_1.name));
    await user.click(await screen.findByText('tags.actions.delete.label'));

    // The tag should be removed from the store
    await waitFor(() => {
      expect(Tags.get(tag_1.id, false)).toBeNull();
    });
  });

  it('renames a group via its section menu', async () => {
    renderView();
    const user = userEvent.setup();

    // Open the first group's menu and start renaming
    await user.click(screen.getAllByLabelText('tags.actions.groupOptions')[0]);
    await user.click(await screen.findByText('tags.actions.renameGroup'));

    // Replace the name and commit it with Enter
    const nameInput = screen.getByDisplayValue(tagGroup_1.name);
    await user.clear(nameInput);
    await user.type(nameInput, 'Renamed Group{Enter}');

    // The rename should be persisted to the store
    await waitFor(() => {
      expect(TagGroups.get(tagGroup_1.id).name).toBe('Renamed Group');
    });
  });

  it('creates a tag in a group via its add button', async () => {
    renderView();
    const user = userEvent.setup();

    // Click the first group's add button
    await user.click(screen.getAllByLabelText('tags.actions.new')[0]);

    // Name the tag and commit it with Enter
    await user.type(
      screen.getByPlaceholderText('tags.details.namePlaceholder'),
      'Urgent{Enter}',
    );

    // The tag should be created in the group
    await waitFor(() => {
      expect(Tags.getByName('Urgent').group).toBe(tagGroup_1.id);
    });
  });
});
