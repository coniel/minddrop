import { LayoutType } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { BrowseLayoutsEvent, OpenDesignStudioEvent } from '../events';

export interface NewLayoutMenuProps {
  /**
   * The event to dispatch when the back button is pressed
   * in the design studio.
   */
  backEvent?: string;

  /**
   * The data to pass to the back event.
   */
  backEventData?: unknown;

  /**
   * The database ID. When provided, a "Browse layouts"
   * option is shown at the top of the menu.
   */
  databaseId?: string;

  /**
   * Optional callback fired when a layout type is selected.
   * When provided, this is called instead of dispatching the
   * design studio open event.
   */
  onSelectType?: (type: LayoutType) => void;
}

/**
 * Renders a + icon button that opens a dropdown menu for
 * creating a new layout by type, with an optional browse option.
 */
export const NewLayoutMenu: React.FC<NewLayoutMenuProps> = ({
  backEvent,
  backEventData,
  databaseId,
  onSelectType,
}) => {
  // Open the design studio to create a new layout of the given type,
  // or call the onSelectType callback if provided
  function handleSelectType(type: LayoutType) {
    if (onSelectType) {
      onSelectType(type);

      return;
    }

    Events.dispatch(OpenDesignStudioEvent, {
      newLayoutType: type,
      backEvent,
      backEventData,
    });
  }

  // Dispatch the browse layouts event to open the layout browser overlay
  function handleBrowse() {
    Events.dispatch(BrowseLayoutsEvent, {
      databaseId,
    });
  }

  return (
    <DropdownMenu
      trigger={
        <IconButton size="sm" label="databases.actions.addLayout" icon="plus" />
      }
    >
      {databaseId && (
        <MenuGroup>
          <DropdownMenuItem
            muted
            icon="search"
            label="databases.actions.browseLayouts"
            onSelect={handleBrowse}
          />
        </MenuGroup>
      )}
      <MenuGroup>
        {databaseId && <MenuLabel label="designs.layouts.labels.new" />}
        <DropdownMenuItem
          muted
          icon="layout-grid"
          label="designs.layouts.card.new"
          tooltip={{ description: 'designs.layouts.card.description' }}
          onSelect={() => handleSelectType('card')}
        />
        <DropdownMenuItem
          muted
          icon="layout-list"
          label="designs.layouts.list.new"
          tooltip={{ description: 'designs.layouts.list.description' }}
          onSelect={() => handleSelectType('list')}
        />
        <DropdownMenuItem
          muted
          icon="layout"
          label="designs.layouts.page.new"
          tooltip={{ description: 'designs.layouts.page.description' }}
          onSelect={() => handleSelectType('page')}
        />
      </MenuGroup>
    </DropdownMenu>
  );
};
