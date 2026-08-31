import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Tags } from '@minddrop/tags';
import { TagGroupFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { NewTagMenu } from './NewTagMenu';

const { tagGroup_1, tagGroups } = TagGroupFixtures;

describe('<NewTagMenu />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a tag from the new tag form', async () => {
    render(<NewTagMenu groups={tagGroups} onCreateGroup={() => {}} />);
    const user = userEvent.setup();

    // Open the menu and pick the new tag action
    await user.click(screen.getByLabelText('tags.actions.add'));
    await user.click(await screen.findByText('tags.actions.new'));

    // Name the tag and commit it with Enter
    await user.type(
      screen.getByPlaceholderText('tags.details.namePlaceholder'),
      'Urgent{Enter}',
    );

    // The tag should be created in the store
    await waitFor(() => {
      expect(Tags.getByName('Urgent')).toBeDefined();
    });
  });

  it('creates a tag into the picked group', async () => {
    render(<NewTagMenu groups={tagGroups} onCreateGroup={() => {}} />);
    const user = userEvent.setup();

    // Open the menu and pick the group's new tag action
    await user.click(screen.getByLabelText('tags.actions.add'));
    await user.click(await screen.findByText(tagGroup_1.name));

    // Name the tag and commit it with Enter
    await user.type(
      screen.getByPlaceholderText('tags.details.namePlaceholder'),
      'Urgent{Enter}',
    );

    // The tag should be created in the picked group
    await waitFor(() => {
      expect(Tags.getByName('Urgent').group).toBe(tagGroup_1.id);
    });
  });
});
