import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { CreateEntityGroupPopover } from './CreateEntityGroupPopover';

const { entityGroup_exclusive_1, groupTypeConfig_exclusive } =
  EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('<CreateEntityGroupPopover />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  function init() {
    render(
      <CreateEntityGroupPopover open type={type} onOpenChange={() => {}} />,
    );
  }

  it('creates the named group', async () => {
    init();

    await nameGroup('Reading');

    await waitFor(() => {
      expect(getGroupNames()).toContain('Reading');
    });
  });

  it('says so when the name is one an existing group has', async () => {
    init();

    await nameGroup(entityGroup_exclusive_1.name);

    expect(
      await screen.findByText('A group with this name already exists'),
    ).toBeInTheDocument();
    expect(EntityGroups.getAll(type)).toHaveLength(3);
  });
});

/**
 * Names the group in the open popover and commits it.
 */
async function nameGroup(name: string): Promise<void> {
  await userEvent.type(
    await screen.findByPlaceholderText('Group name'),
    `${name}{Enter}`,
  );
}

/**
 * Returns the names of the type's groups.
 */
function getGroupNames(): string[] {
  return EntityGroups.getAll(type).map((group) => group.name);
}
