import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { TagsPropertySchema } from '@minddrop/properties';
import { OpenTagsViewEvent } from '@minddrop/tags';
import {
  MockFs,
  TagGroupFixtures,
  cleanupTagFixtures,
  setupTagFixtures,
} from '@minddrop/tags/test-utils';
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { TagsPropertyEditor } from './TagsPropertyEditor';

const { tagGroup_1 } = TagGroupFixtures;

const onSave = vi.fn(() => true);
const onDelete = vi.fn();

const property: TagsPropertySchema = { ...TagsPropertySchema, name: 'Tags' };

describe('<TagsPropertyEditor />', () => {
  beforeEach(() => {
    // Load tag fixtures into the stores and mock file system
    setupTagFixtures(MockFs);
  });

  afterEach(() => {
    cleanup();
    cleanupTagFixtures();
    Events._clearAll();
    MockFs.reset();
    vi.clearAllMocks();
  });

  it('lists the tag groups in the group limit select', async () => {
    render(
      <TagsPropertyEditor
        defaultOpen
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    // Open the group limit select
    await user.click(screen.getByText('properties.tags.group.all'));

    // The tag groups should be listed
    expect(await screen.findByText(tagGroup_1.name)).toBeInTheDocument();
  });

  it('saves without a group limit by default', async () => {
    render(
      <TagsPropertyEditor
        defaultOpen
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    // Save the property
    await user.click(screen.getByText('actions.save'));

    // The saved property should have no group limit
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.not.objectContaining({ group: expect.anything() }),
      );
    });
  });

  it('saves the picked group limit', async () => {
    render(
      <TagsPropertyEditor
        defaultOpen
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    // Pick a group in the group limit select
    await user.click(screen.getByText('properties.tags.group.all'));
    await user.click(await screen.findByText(tagGroup_1.name));

    // Save the property
    await user.click(screen.getByText('actions.save'));

    // The saved property should carry the picked group
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ group: tagGroup_1.id }),
      );
    });
  });

  it('opens the tags view from the manage button', async () => {
    // Tracks whether the open tags view event was dispatched
    let dispatched = false;

    Events.addListener(OpenTagsViewEvent, 'test', () => {
      dispatched = true;
    });

    render(
      <TagsPropertyEditor
        defaultOpen
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    // Press the manage tags button
    await user.click(screen.getByText('properties.tags.manage'));

    // The open tags view event should be dispatched
    await waitFor(() => {
      expect(dispatched).toBe(true);
    });
  });
});
