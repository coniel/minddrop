import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { TagGroups, Tags } from '@minddrop/tags';
import { TagFixtures, TagGroupFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { TagGroupActions } from './TagGroupActions';

const { tag_1 } = TagFixtures;
const { tagGroup_1 } = TagGroupFixtures;

describe('<TagGroupActions />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renames the group on rename commit', async () => {
    render(<TagGroupActions group={tagGroup_1} />);
    const user = userEvent.setup();

    // Open the group options menu and start renaming
    await user.click(screen.getByLabelText('tags.actions.groupOptions'));
    await user.click(await screen.findByText('tags.actions.renameGroup'));

    // Replace the name and commit it with Enter
    const nameInput = screen.getByDisplayValue(tagGroup_1.name);
    await user.clear(nameInput);
    await user.type(nameInput, 'Renamed Group{Enter}');

    // The rename should be persisted to the store
    expect(TagGroups.get(tagGroup_1.id).name).toBe('Renamed Group');
  });

  it('deletes the group on confirmed delete, ungrouping its tags', async () => {
    // Assign a tag to the group
    await Tags.update(tag_1.id, { group: tagGroup_1.id });

    render(<TagGroupActions group={tagGroup_1} />);
    const user = userEvent.setup();

    // Confirm the deletion as soon as the confirmation is requested
    Events.addListener(
      OpenConfirmationDialogEvent,
      'test-confirm',
      ({ data }) => {
        data.onConfirm();
      },
    );

    // Open the group options menu and click the delete action
    await user.click(screen.getByLabelText('tags.actions.groupOptions'));
    await user.click(await screen.findByText('tags.actions.deleteGroup.label'));

    await waitFor(() => {
      // The group should be removed from the store
      expect(TagGroups.get(tagGroup_1.id, false)).toBeNull();

      // The member tag should be ungrouped, not deleted
      expect(Tags.get(tag_1.id).group).toBeUndefined();
    });
  });
});
