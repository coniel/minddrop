import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { Tags } from '@minddrop/tags';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { TagDetails } from './TagDetails';

const { tag_1, tag_2 } = TagFixtures;

describe('<TagDetails />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renames the tag on name commit', async () => {
    render(<TagDetails tag={tag_1} />);
    const user = userEvent.setup();

    // Replace the name and commit it with Enter
    const nameInput = screen.getByDisplayValue(tag_1.name);
    await user.clear(nameInput);
    await user.type(nameInput, 'Renamed Tag{Enter}');

    // The rename should be persisted to the store
    expect(Tags.get(tag_1.id).name).toBe('Renamed Tag');
  });

  it('reverts blank names without persisting', async () => {
    render(<TagDetails tag={tag_1} />);
    const user = userEvent.setup();

    // Clear the name and commit it
    const nameInput = screen.getByDisplayValue(tag_1.name);
    await user.clear(nameInput);
    await user.keyboard('{Enter}');

    // The store name should be unchanged
    expect(Tags.get(tag_1.id).name).toBe(tag_1.name);
  });

  it('reverts names already in use without persisting', async () => {
    render(<TagDetails tag={tag_1} />);
    const user = userEvent.setup();

    // Commit another tag's name
    const nameInput = screen.getByDisplayValue(tag_1.name);
    await user.clear(nameInput);
    await user.type(nameInput, `${tag_2.name}{Enter}`);

    // The store name should be unchanged
    expect(Tags.get(tag_1.id).name).toBe(tag_1.name);
  });

  it('deletes the tag on confirmed delete', async () => {
    render(<TagDetails tag={tag_1} />);
    const user = userEvent.setup();

    // Confirm the deletion as soon as the confirmation is requested
    Events.addListener(
      OpenConfirmationDialogEvent,
      'test-confirm',
      ({ data }) => {
        data.onConfirm();
      },
    );

    // Click the delete button
    await user.click(screen.getByText('tags.actions.delete.label'));

    // The tag should be removed from the store
    await waitFor(() => {
      expect(Tags.get(tag_1.id, false)).toBeNull();
    });
  });
});
