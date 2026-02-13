import { Databases } from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '@minddrop/feature-designs';
import { i18n } from '@minddrop/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
  IconButton,
  MenuGroup,
} from '@minddrop/ui-primitives';

export interface DatabaseDesignTypeSelectionMenuProps {
  /**
   * The ID of the database to which to add the design.
   */
  databaseId: string;
}

export const DatabaseDesignTypeSelectionMenu: React.FC<
  DatabaseDesignTypeSelectionMenuProps
> = ({ databaseId }) => {
  async function handleSelect(type: string) {
    // Generate a new design of the specified type
    const design = Designs.generate(type, i18n.t(`designs.${type}.name`));

    // Add the design to the database
    await Databases.addDesign(databaseId, design);

    // Open the design studio
    Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
      databaseId,
      designId: design.id,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          size="small"
          label="databases.actions.addDesign"
          icon="plus"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="start">
          <DropdownMenuContent
            minWidth={300}
            className="property-type-selection-menu"
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
                label="designs.list-item.new"
                tooltipDescription="designs.list-item.description"
                onClick={() => handleSelect('list-item')}
              />
            </MenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
