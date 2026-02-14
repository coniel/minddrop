import { Databases } from '@minddrop/databases';
import { Design } from '@minddrop/designs';
import {
  Events,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
} from '@minddrop/events';
import {
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '@minddrop/feature-designs';
import { i18n } from '@minddrop/i18n';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
  IconButton,
  MenuGroup,
  MenuItem,
  MenuItemDropdownMenu,
} from '@minddrop/ui-primitives';
import { uuid } from '@minddrop/utils';

export interface DatabaseDesignMenuItemProps {
  /**
   * The ID of the database to which the design belongs.
   */
  databaseId: string;

  /**
   * The design to display.
   */
  design: Design;
}

export const DatabaseDesignMenuItem: React.FC<DatabaseDesignMenuItemProps> = ({
  design,
  databaseId,
}) => {
  function handleClick() {
    // Open the design studio
    Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
      databaseId,
      designId: design.id,
    });
  }

  async function handleDuplicate() {
    // Duplicate the design
    const duplatedDesign = {
      ...design,
      id: uuid(),
      name: `${design.name} (${i18n.t('labels.copy')})`,
    };

    // Add the design to the database
    await Databases.addDesign(databaseId, duplatedDesign);

    // Open the design studio
    Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
      databaseId,
      designId: duplatedDesign.id,
    });
  }

  function handleDelete() {
    const i18nRoot = 'designs.actions.deleteConfirmation';

    Events.dispatch<OpenConfirmationDialogEventData>(
      OpenConfirmationDialogEvent,
      {
        title: `${i18nRoot}.title`,
        message: `${i18nRoot}.message`,
        confirmLabel: `${i18nRoot}.confirm`,
        danger: true,
        onConfirm: () => {
          Databases.removeDesign(databaseId, design.id);
        },
      },
    );
  }

  return (
    <MenuItem
      muted
      icon={icon(design)}
      label={design.name}
      onClick={handleClick}
      actions={
        <MenuItemDropdownMenu>
          <DropdownMenuTrigger>
            <IconButton
              size="small"
              icon="more-vertical"
              label="actions.manage"
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner side="bottom" align="start">
              <DropdownMenuContent
                minWidth={300}
                className="property-type-selection-menu"
              >
                <MenuGroup padded>
                  <MenuItem
                    icon="edit"
                    label="actions.edit"
                    onClick={handleClick}
                  />
                  <MenuItem
                    icon="copy"
                    label="actions.duplicate"
                    onClick={handleDuplicate}
                  />
                  <MenuItem
                    icon="trash"
                    label="actions.delete"
                    onClick={handleDelete}
                  />
                </MenuGroup>
              </DropdownMenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </MenuItemDropdownMenu>
      }
    />
  );
};

function icon(design: Design) {
  if (design.type === 'page') {
    return 'layout';
  } else if (design.type === 'card') {
    return 'layout-grid';
  } else if (design.type === 'list') {
    return 'layout-list';
  }
}
