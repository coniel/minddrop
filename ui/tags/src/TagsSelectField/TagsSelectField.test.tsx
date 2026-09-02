import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Tags } from '@minddrop/tags';
import { TagFixtures, TagGroupFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { TagsSelectField } from './TagsSelectField';

const { tag_1, tag_2 } = TagFixtures;
const { tagGroup_1 } = TagGroupFixtures;

describe('<TagsSelectField />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists all tags as options', async () => {
    render(<TagsSelectField value={[]} onChange={() => {}} />);
    const user = userEvent.setup();

    // Open the picker
    await user.click(screen.getByRole('combobox'));

    // All tags should be listed
    expect(await screen.findByText(tag_1.name)).toBeInTheDocument();
    expect(screen.getByText(tag_2.name)).toBeInTheDocument();
  });

  it('reports picked tag names', async () => {
    // Records the reported value
    let received: string[] = [];

    render(
      <TagsSelectField
        value={[]}
        onChange={(value) => {
          received = value;
        }}
      />,
    );
    const user = userEvent.setup();

    // Open the picker and pick a tag
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText(tag_1.name));

    // The picked tag's name should be reported
    expect(received).toEqual([tag_1.name]);
  });

  it('deselects picked tags on repeat pick', async () => {
    // Records the reported value
    let received: string[] = [tag_1.name];

    render(
      <TagsSelectField
        value={[tag_1.name]}
        onChange={(value) => {
          received = value;
        }}
      />,
    );
    const user = userEvent.setup();

    // Open the picker and pick the already selected tag
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: tag_1.name }));

    // The tag should be removed from the value
    expect(received).toEqual([]);
  });

  it('creates an unknown tag on type', async () => {
    // Records the reported value
    let received: string[] = [];

    render(
      <TagsSelectField
        value={[]}
        onChange={(value) => {
          received = value;
        }}
      />,
    );
    const user = userEvent.setup();

    // Open the picker and search for an unknown tag name
    await user.click(screen.getByRole('combobox'));
    await user.type(
      screen.getByPlaceholderText('tags.field.searchPlaceholder'),
      'Urgent',
    );

    // Pick the create option
    await user.click(await screen.findByText('tags.field.create'));

    // The tag should land in the tags store
    await waitFor(() => {
      expect(Tags.getByName('Urgent')).toBeDefined();
    });

    // The created tag should be appended to the value
    await waitFor(() => {
      expect(received).toEqual(['Urgent']);
    });
  });

  it('offers no create option for existing tag names', async () => {
    render(<TagsSelectField value={[]} onChange={() => {}} />);
    const user = userEvent.setup();

    // Open the picker and search for an existing tag name
    await user.click(screen.getByRole('combobox'));
    await user.type(
      screen.getByPlaceholderText('tags.field.searchPlaceholder'),
      tag_1.name,
    );

    // The tag should be listed without a create option
    expect(await screen.findByText(tag_1.name)).toBeInTheDocument();
    expect(screen.queryByText('tags.field.create')).toBeNull();
  });

  it('limits options to the group when one is set', async () => {
    // Add a tag in the group
    await Tags.create('Grouped', undefined, tagGroup_1.id);

    render(
      <TagsSelectField value={[]} onChange={() => {}} group={tagGroup_1.id} />,
    );
    const user = userEvent.setup();

    // Open the picker
    await user.click(screen.getByRole('combobox'));

    // Only the group's tags should be listed
    expect(await screen.findByText('Grouped')).toBeInTheDocument();
    expect(screen.queryByText(tag_1.name)).toBeNull();
  });

  it('creates tags into the group when one is set', async () => {
    render(
      <TagsSelectField value={[]} onChange={() => {}} group={tagGroup_1.id} />,
    );
    const user = userEvent.setup();

    // Open the picker and search for an unknown tag name
    await user.click(screen.getByRole('combobox'));
    await user.type(
      screen.getByPlaceholderText('tags.field.searchPlaceholder'),
      'Urgent',
    );

    // Pick the create option
    await user.click(await screen.findByText('tags.field.create'));

    // The tag should be created in the group
    await waitFor(() => {
      expect(Tags.getByName('Urgent').group).toBe(tagGroup_1.id);
    });
  });
});
