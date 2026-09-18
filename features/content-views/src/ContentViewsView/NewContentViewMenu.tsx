import { useMemo, useRef, useState } from 'react';
import { ContentViewGroups, ContentViewTypes } from '@minddrop/content-views';
import {
  CreateEntityGroupMenuItem,
  CreateEntityGroupPopover,
} from '@minddrop/ui-entity-groups';
import {
  DropdownMenu,
  DropdownMenuSeparator,
  IconButton,
  MenuGroup,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { OpenNewContentViewViewEvent } from '../events';
import { resolveContentViewTypeActions } from '../utils';

/**
 * Renders the add button's dropdown menu: an action creating a view
 * of each view type, and one creating a content view group.
 */
export const NewContentViewMenu: React.FC = () => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [namingGroup, setNamingGroup] = useState(false);
  const viewTypes = ContentViewTypes.useAll();
  const openView = Views.useOpenView();

  // Open the creation form for the picked view type
  const viewTypeActions = useMemo(
    () =>
      resolveContentViewTypeActions(viewTypes, (viewType) =>
        openView(OpenNewContentViewViewEvent, { viewType }),
      ),
    [viewTypes, openView],
  );

  return (
    <>
      <DropdownMenu
        minWidth={200}
        content={viewTypeActions}
        trigger={
          <IconButton
            ref={addButtonRef}
            icon="plus"
            size="md"
            variant="subtle"
            label="contentViews.actions.add"
          />
        }
      >
        <MenuGroup>
          <DropdownMenuSeparator />
          <CreateEntityGroupMenuItem onSelect={() => setNamingGroup(true)} />
        </MenuGroup>
      </DropdownMenu>

      {/* Names the new group in place of the menu */}
      <CreateEntityGroupPopover
        type={ContentViewGroups.constants.Type}
        open={namingGroup}
        onOpenChange={setNamingGroup}
        anchor={addButtonRef}
      />
    </>
  );
};
