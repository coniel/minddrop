import { Databases } from '@minddrop/databases';
import { DesignType, Designs } from '@minddrop/designs';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  MenuGroup,
} from '@minddrop/ui-primitives';
import { openDesignStudio } from '../navigation';

export interface DatabaseDesignTypeSelectionMenuProps {
  /**
   * The ID of the database to which to add the design.
   */
  databaseId: string;
}

export const DatabaseDesignTypeSelectionMenu: React.FC<
  DatabaseDesignTypeSelectionMenuProps
> = ({ databaseId }) => {
  async function handleSelect(type: DesignType) {
    // Generate a new design of the specified type
    const design = Designs.generate(type);

    // Add the design to the database
    await Databases.addDesign(databaseId, design);

    // Open the design studio
    openDesignStudio(databaseId, design.id);
  }

  return (
    <DropdownMenu
      trigger={
        <IconButton size="sm" label="databases.actions.addDesign" icon="plus" />
      }
      minWidth={300}
      contentClassName="property-type-selection-menu"
    >
      <MenuGroup padded>
        <DropdownMenuItem
          muted
          icon="layout"
          label="designs.page.new"
          tooltipDescription="designs.page.description"
          onClick={() => handleSelect('page')}
        />
        <DropdownMenuItem
          muted
          icon="layout-grid"
          label="designs.card.new"
          tooltipDescription="designs.card.description"
          onClick={() => handleSelect('card')}
        />
        <DropdownMenuItem
          muted
          icon="layout-list"
          label="designs.list.new"
          tooltipDescription="designs.list.description"
          onClick={() => handleSelect('list')}
        />
      </MenuGroup>
    </DropdownMenu>
  );
};
