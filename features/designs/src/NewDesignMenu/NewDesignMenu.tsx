import { DesignType } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';

export interface NewDesignMenuProps {
  /**
   * The event to dispatch when the back button is pressed
   * in the design studio.
   */
  backEvent?: string;

  /**
   * The data to pass to the back event.
   */
  backEventData?: any;

  /**
   * The database ID. When provided, a "Browse designs"
   * option is shown at the top of the menu.
   */
  databaseId?: string;

  /**
   * Optional callback fired when a design type is selected.
   * When provided, this is called instead of dispatching the
   * design studio open event.
   */
  onSelectType?: (type: DesignType) => void;
}

/**
 * Renders a + icon button that opens a dropdown menu for
 * creating a new design by type, with an optional browse option.
 */
export const NewDesignMenu: React.FC<NewDesignMenuProps> = ({
  backEvent,
  backEventData,
  databaseId,
  onSelectType,
}) => {
  // Open the design studio to create a new design of the given type,
  // or call the onSelectType callback if provided
  function handleSelectType(type: DesignType) {
    if (onSelectType) {
      onSelectType(type);

      return;
    }

    Events.dispatch('design-studio:open', {
      newDesignType: type,
      backEvent,
      backEventData,
    });
  }

  // Dispatch the browse designs event to open the design browser overlay
  function handleBrowse() {
    Events.dispatch('feature-design-property-mapping:designs:browse', {
      databaseId,
    });
  }

  return (
    <DropdownMenu
      trigger={
        <IconButton size="sm" label="databases.actions.addDesign" icon="plus" />
      }
    >
      {databaseId && (
        <MenuGroup padded>
          <DropdownMenuItem
            muted
            icon="search"
            label="databases.actions.browseDesigns"
            onClick={handleBrowse}
          />
        </MenuGroup>
      )}
      <MenuGroup padded>
        {databaseId && <MenuLabel label="designs.labels.new" />}
        <DropdownMenuItem
          muted
          icon="layout-grid"
          label="designs.card.new"
          tooltipDescription="designs.card.description"
          onClick={() => handleSelectType('card')}
        />
        <DropdownMenuItem
          muted
          icon="layout-list"
          label="designs.list.new"
          tooltipDescription="designs.list.description"
          onClick={() => handleSelectType('list')}
        />
        <DropdownMenuItem
          muted
          icon="layout"
          label="designs.page.new"
          tooltipDescription="designs.page.description"
          onClick={() => handleSelectType('page')}
        />
      </MenuGroup>
    </DropdownMenu>
  );
};
