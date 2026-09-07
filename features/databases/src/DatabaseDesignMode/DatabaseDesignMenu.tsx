import { FC } from 'react';
import { Database, Databases, LayoutContext } from '@minddrop/databases';
import { Design, Designs } from '@minddrop/designs-next';
import { Events } from '@minddrop/events';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import {
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuSeparator,
  ContextMenuSwitchItem,
  ContextSubmenu,
  ContextSubmenuContent,
  ContextSubmenuTriggerItem,
  MenuRenameItem,
} from '@minddrop/ui-primitives';

export interface DatabaseDesignMenuProps {
  /**
   * The database owning the design.
   */
  database: Database;

  /**
   * The design the menu acts on.
   */
  design: Design;

  /**
   * Called with the copy's ID after the design is duplicated.
   */
  onDuplicated: (designId: string) => void;

  /**
   * Called when the menu should close, after a name is submitted.
   */
  onClose: () => void;
}

const contextKey = createI18nKeyBuilder('databases.layoutContexts.');
const typeKey = createI18nKeyBuilder('designsNext.types.');

/**
 * Renders the contents of a design tab's menu: rename, the layout
 * contexts the design is used for, duplicate and delete.
 */
export const DatabaseDesignMenu: FC<DatabaseDesignMenuProps> = ({
  database,
  design,
  onDuplicated,
  onClose,
}) => {
  const { t } = useTranslation();

  // The layout contexts the design's type can render
  const contexts = Databases.constants.LayoutContexts.filter(
    (context) =>
      Databases.constants.LayoutContextBaseType[context] === design.type,
  );

  // The design type's name, which unnamed designs are named after.
  // The name field shows it as its placeholder instead, so a fresh
  // design's field starts empty.
  const typeName = t(typeKey(design.type));
  const name = design.name === typeName ? '' : design.name;

  // Name the design, falling back to its type's name when cleared
  function handleRename(value: string) {
    Designs.update(design.id, { name: value.trim() || typeName });
  }

  function handleDefaultChange(context: LayoutContext, checked: boolean) {
    Databases.setDefaultDesign(
      database.id,
      context,
      checked ? design.id : null,
    );
  }

  async function handleDuplicate() {
    const copy = await Designs.duplicate(design.id);

    onDuplicated(copy.id);
  }

  function handleDelete() {
    // Confirm the deletion before removing the design
    Events.dispatch(Events.events.OpenConfirmationDialog, {
      title: 'databases.design.delete.confirmation.title',
      message: 'databases.design.delete.confirmation.message',
      confirmLabel: 'databases.design.delete.confirmation.confirm',
      danger: true,
      onConfirm: () => {
        Designs.delete(design.id);
      },
    });
  }

  return (
    <>
      <MenuRenameItem
        value={name}
        placeholder={typeKey(design.type)}
        onValueChange={() => {}}
        onRename={handleRename}
        onSubmit={onClose}
      />
      <ContextMenuSeparator />

      {/* The layout contexts the design is the default for */}
      <ContextSubmenu>
        <ContextSubmenuTriggerItem
          icon="pin"
          label="databases.design.actions.useAsDefault"
        />
        <ContextMenuPortal>
          <ContextMenuPositioner side="right" align="start" sideOffset={4}>
            <ContextSubmenuContent>
              {contexts.map((context) => (
                <ContextMenuSwitchItem
                  key={context}
                  label={contextKey(context, 'name')}
                  checked={database.defaultDesigns?.[context] === design.id}
                  onCheckedChange={(checked) =>
                    handleDefaultChange(context, checked)
                  }
                />
              ))}
            </ContextSubmenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextSubmenu>

      <ContextMenuItem
        icon="copy"
        label="databases.design.actions.duplicate"
        onSelect={handleDuplicate}
      />
      <ContextMenuSeparator />
      <ContextMenuItem
        icon="trash"
        danger
        label="databases.design.actions.delete"
        onSelect={handleDelete}
      />
    </>
  );
};
