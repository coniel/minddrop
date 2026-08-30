import { useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { DataViewTypeSettingsMenuProps } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { DatabaseLayoutSelectionMenu } from '@minddrop/ui-databases';
import {
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSwitchItem,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';
import {
  CanvasViewData,
  CanvasViewOptions,
  CanvasViewToolbarCardOptions,
} from '../types';

// Radio value representing a blank entry with no template
const BLANK_ENTRY = 'blank';

/**
 * Renders the canvas view settings menu content with a card
 * layout picker per database and toolbar card settings.
 */
export const CanvasViewOptionsMenu: React.FC<
  DataViewTypeSettingsMenuProps<CanvasViewOptions, CanvasViewData>
> = ({ view, options, onUpdateOptions }) => {
  // Load the collection backing the view
  const collection = Collections.use(view.dataSource.id);

  // Derive the databases the collection's entries belong to
  const databaseIds = useMemo(() => {
    if (!collection) {
      return [];
    }

    return Databases.getFromEntries(collection.items).map(
      (database) => database.id,
    );
  }, [collection]);

  // Set the card layout override for the database the
  // selection belongs to
  function handleLayoutChange(layoutId: string, databaseId?: string) {
    if (!databaseId) {
      return;
    }

    onUpdateOptions({
      cardLayoutOverrides: {
        ...options.cardLayoutOverrides,
        [databaseId]: layoutId,
      },
    });
  }

  // Set a database's toolbar card configuration
  function handleToolbarCardChange(
    databaseId: string,
    cardOptions: CanvasViewToolbarCardOptions,
  ) {
    onUpdateOptions({
      toolbarCards: {
        ...options.toolbarCards,
        [databaseId]: cardOptions,
      },
    });
  }

  return (
    <>
      {/* Card layout picker */}
      <DatabaseLayoutSelectionMenu
        databaseId={databaseIds}
        layoutType="card"
        value={options.cardLayoutOverrides || {}}
        onValueChange={handleLayoutChange}
      />

      {/* Toolbar card settings, hidden when there are no cards */}
      {databaseIds.length > 0 && (
        <>
          <DropdownMenuSeparator />

          <MenuGroup>
            <MenuLabel label="dataViews.canvas.toolbarCards" />
            {databaseIds.map((databaseId) => (
              <ToolbarCardMenu
                key={databaseId}
                databaseId={databaseId}
                cardOptions={options.toolbarCards?.[databaseId] || {}}
                onChange={(cardOptions) =>
                  handleToolbarCardChange(databaseId, cardOptions)
                }
              />
            ))}
          </MenuGroup>
        </>
      )}
    </>
  );
};

interface ToolbarCardMenuProps {
  /**
   * The ID of the database whose toolbar card is configured.
   */
  databaseId: string;

  /**
   * The card's current configuration.
   */
  cardOptions: CanvasViewToolbarCardOptions;

  /**
   * Called with the card's updated configuration.
   */
  onChange: (cardOptions: CanvasViewToolbarCardOptions) => void;
}

/**
 * Renders a database's toolbar card settings. Databases without
 * entry templates render as a plain visibility switch. Databases
 * with templates render as a submenu containing the visibility
 * switch and the template used when creating entries via the card.
 */
const ToolbarCardMenu: React.FC<ToolbarCardMenuProps> = ({
  databaseId,
  cardOptions,
  onChange,
}) => {
  const database = Databases.use(databaseId);

  // Nothing to render if the database is no longer available
  if (!database) {
    return null;
  }

  const templates = database.entryTemplates ?? [];

  // Toggle the card's visibility in the toolbar
  function handleVisibilityChange(visible: boolean) {
    onChange({ ...cardOptions, hidden: !visible });
  }

  // Set the template used by the card, clearing it when the
  // blank entry option is selected
  function handleTemplateChange(value: string) {
    const { templateId, ...rest } = cardOptions;

    onChange(value === BLANK_ENTRY ? rest : { ...rest, templateId: value });
  }

  // Template-less databases render as a plain visibility switch
  if (templates.length === 0) {
    return (
      <DropdownMenuSwitchItem
        stringLabel={database.name}
        contentIcon={database.icon}
        checked={!cardOptions.hidden}
        onCheckedChange={handleVisibilityChange}
      />
    );
  }

  return (
    <DropdownSubmenu>
      <DropdownSubmenuTriggerItem
        stringLabel={database.name}
        contentIcon={database.icon}
      />
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
          <DropdownSubmenuContent>
            {/* Toolbar visibility switch */}
            <DropdownMenuSwitchItem
              label="dataViews.canvas.showToolbarCard"
              checked={!cardOptions.hidden}
              onCheckedChange={handleVisibilityChange}
            />

            {/* Template picker */}
            <DropdownMenuSeparator />
            <MenuGroup>
              <MenuLabel label="dataViews.canvas.toolbarCardTemplate" />
              <DropdownMenuRadioGroup
                value={cardOptions.templateId || BLANK_ENTRY}
                onValueChange={handleTemplateChange}
              >
                <DropdownMenuRadioItem
                  value={BLANK_ENTRY}
                  label="databases.entryTemplates.menus.blankEntry"
                />
                {templates.map((template) => (
                  <DropdownMenuRadioItem
                    key={template.id}
                    value={template.id}
                    stringLabel={template.name}
                  />
                ))}
              </DropdownMenuRadioGroup>
            </MenuGroup>
          </DropdownSubmenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownSubmenu>
  );
};
