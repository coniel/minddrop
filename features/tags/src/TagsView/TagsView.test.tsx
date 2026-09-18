import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { TagGroups, Tags } from '@minddrop/tags';
import { TagFixtures, TagGroupFixtures } from '@minddrop/tags/test-utils';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { cleanup, setup } from '../test-utils';
import { TagsView } from './TagsView';

const { tag_1, tag_2, tag_3 } = TagFixtures;
const { tagGroup_1, tagGroup_2, tagGroups } = TagGroupFixtures;

// Renders the view inside a subview context
function renderView() {
  return render(
    <Views.SubviewProvider subview={null}>
      <TagsView />
    </Views.SubviewProvider>,
  );
}

// Files the first two tags under the groups. The third stays
// ungrouped.
async function groupTags(): Promise<void> {
  await TagGroups.addItem(tagGroup_1.id, tag_1.id);
  await TagGroups.addItem(tagGroup_2.id, tag_2.id);
}

// Returns the element of the group with the given name
function getGroup(name: string): HTMLElement {
  return screen.getByText(name).closest('.entity-group') as HTMLElement;
}

// Returns the names of the tags listed under the ungrouped group,
// in the order they are shown.
function getUngroupedNames(): (string | null)[] {
  return Array.from(
    getGroup('Ungrouped').querySelectorAll('.menu-item-label'),
  ).map((label) => label.textContent);
}

// Returns the names of every tag listed in the left column, in the
// order they are shown.
function getListedNames(): (string | null)[] {
  const list = document.querySelector(
    '.list-panel-view-list-items',
  ) as HTMLElement;

  return Array.from(list.querySelectorAll('.menu-item-label')).map(
    (label) => label.textContent,
  );
}

describe('<TagsView />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the tags under the groups holding them', async () => {
    await groupTags();

    renderView();

    expect(
      within(getGroup(tagGroup_1.name)).getByText(tag_1.name),
    ).toBeInTheDocument();
    expect(
      within(getGroup(tagGroup_2.name)).getByText(tag_2.name),
    ).toBeInTheDocument();
  });

  it('lists the tags in no group under the ungrouped group', async () => {
    await groupTags();

    renderView();

    expect(
      within(getGroup('Ungrouped')).getByText(tag_3.name),
    ).toBeInTheDocument();
  });

  it('lists the ungrouped tags by name', async () => {
    // Rename the first tag so that the creation order and the
    // alphabetical order differ.
    await Tags.update(tag_1.id, { name: 'Zebra' });

    renderView();

    expect(getUngroupedNames()).toEqual([tag_2.name, tag_3.name, 'Zebra']);
  });

  it('leaves the search results in the order they matched', async () => {
    // Names whose match order differs from their alphabetical one,
    // so that a sort would be visible.
    await Tags.update(tag_1.id, { name: 'Beta' });
    await Tags.update(tag_2.id, { name: 'Ab' });
    await Tags.update(tag_3.id, { name: 'Cab' });

    renderView();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('tags.list.searchPlaceholder'),
      'b',
    );

    await waitFor(() => {
      expect(getListedNames()).toEqual(Tags.search('b').map((tag) => tag.name));
    });
  });

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

  it('refuses a tag name another tag already has', async () => {
    renderView();
    const user = userEvent.setup();

    // Open the first tag's menu and start renaming
    await user.click(screen.getAllByLabelText('tags.actions.options')[0]);
    await user.click(await screen.findByText('tags.actions.rename'));

    // Name it after another tag
    const nameInput = screen.getByDisplayValue(tag_1.name);
    await user.clear(nameInput);
    await user.type(nameInput, `${tag_2.name}{Enter}`);

    // The naming should stay open, saying the name is taken
    expect(await screen.findByText('tags.form.nameTaken')).toBeInTheDocument();
    expect(Tags.get(tag_1.id).name).toBe(tag_1.name);
  });

  it('deletes a tag nothing is tagged with without asking', async () => {
    renderView();
    const user = userEvent.setup();
    // Set if a confirmation is asked for, which this tag warrants
    // none of: no entries are tagged with it.
    let confirmed = false;

    Events.addListener(
      Events.events.OpenConfirmationDialog,
      'test-confirm',
      () => {
        confirmed = true;
      },
    );

    // Open the tag's context menu and click the delete action
    fireEvent.contextMenu(screen.getByText(tag_1.name));
    await user.click(await screen.findByText('tags.actions.delete.label'));

    // The tag should be removed from the store
    await waitFor(() => {
      expect(Tags.get(tag_1.id, false)).toBeNull();
    });

    expect(confirmed).toBe(false);
  });

  it('renames a group via its group menu', async () => {
    renderView();
    const user = userEvent.setup();

    // Open the first group's menu and start renaming
    await user.click(
      within(getGroup(tagGroup_1.name)).getByLabelText('Options'),
    );
    await user.click(await screen.findByText('Rename group'));

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
    await user.click(
      within(getGroup(tagGroup_1.name)).getByLabelText('tags.actions.new'),
    );

    // Name the tag and commit it with Enter
    await user.type(
      screen.getByPlaceholderText('tags.details.namePlaceholder'),
      'Urgent{Enter}',
    );

    // The tag should be created in the group
    await waitFor(() => {
      expect(TagGroups.get(tagGroup_1.id).items).toEqual([
        Tags.getByName('Urgent').id,
      ]);
    });
  });

  it('leaves the group field out of a group new tag form', async () => {
    renderView();
    const user = userEvent.setup();

    // Click the first group's add button
    await user.click(
      within(getGroup(tagGroup_1.name)).getByLabelText('tags.actions.new'),
    );

    // The group the form was opened from is the tag's, so the form
    // has no group to show.
    await screen.findByPlaceholderText('tags.details.namePlaceholder');

    const form = document.querySelector('.tag-form-popover') as HTMLElement;

    expect(within(form).queryByText(tagGroup_1.name)).toBeNull();
  });

  it('files a tag created from the ungrouped group under no group', async () => {
    await groupTags();

    renderView();
    const user = userEvent.setup();

    // Click the ungrouped group's add button
    await user.click(
      within(getGroup('Ungrouped')).getByLabelText('tags.actions.new'),
    );

    // Name the tag and commit it with Enter
    await user.type(
      screen.getByPlaceholderText('tags.details.namePlaceholder'),
      'Urgent{Enter}',
    );

    await waitFor(() => {
      expect(Tags.getByName('Urgent')).toBeDefined();
    });

    expect(TagGroups.getForItem(Tags.getByName('Urgent').id)).toEqual([]);
  });

  it('names a new group at the add button', async () => {
    const { container } = renderView();
    const user = userEvent.setup();

    // Open the add menu and pick the new group action
    await user.click(screen.getByLabelText('tags.actions.add'));
    await user.click(await screen.findByText('tags.actions.newGroup'));

    // The name is asked for at the button, without a group taking
    // shape in the list.
    expect(container.querySelector('.entity-group-placeholder')).toBeNull();

    // Name the group and commit it with Enter
    await user.type(
      screen.getByPlaceholderText('entityGroups.name.placeholder'),
      'Urgent{Enter}',
    );

    await waitFor(() => {
      expect(TagGroups.getAll()[0].name).toBe('Urgent');
    });
  });

  it('says so when a new group is named after one which exists', async () => {
    renderView();
    const user = userEvent.setup();

    // Open the add menu and pick the new group action
    await user.click(screen.getByLabelText('tags.actions.add'));
    await user.click(await screen.findByText('tags.actions.newGroup'));

    // Name the group after one which already exists
    await user.type(
      screen.getByPlaceholderText('entityGroups.name.placeholder'),
      `${tagGroup_1.name}{Enter}`,
    );

    expect(
      await screen.findByText('A group with this name already exists'),
    ).toBeInTheDocument();

    // The naming goes on, and no group was made
    expect(TagGroups.getAll()).toHaveLength(tagGroups.length);
  });

  it('lists the matches without their groups while searching', async () => {
    await groupTags();

    renderView();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('tags.list.searchPlaceholder'),
      tag_1.name,
    );

    await waitFor(() => {
      expect(screen.queryByText(tagGroup_1.name)).toBeNull();
    });

    expect(screen.queryByText(tagGroup_2.name)).toBeNull();
    expect(screen.queryByText('Ungrouped')).toBeNull();
    expect(screen.getByText(tag_1.name)).toBeInTheDocument();
  });
});
