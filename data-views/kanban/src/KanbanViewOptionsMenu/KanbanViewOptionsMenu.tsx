import { DataViewTypeSettingsMenuProps } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseLayoutSelectionMenu } from '@minddrop/ui-databases';
import {
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSwitchItem,
  DropdownRadioSubmenu,
  DropdownRadioSubmenuItem,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';
import {
  KANBAN_COLUMN_BACKGROUNDS,
  KANBAN_COLUMN_WIDTHS,
  defaultKanbanViewOptions,
} from '../constants';
import {
  KanbanColumnBackground,
  KanbanColumnWidth,
  KanbanViewOptions,
  KanbanViewToolbarCardOptions,
} from '../types';
import { useKanbanGroupProperty } from '../useKanbanGroupProperty';

// Radio value representing a blank entry with no template
const BLANK_ENTRY = 'blank';

// Builds the keys of the column settings' labels, which are named
// after the value they label
const optionsI18nKey = createI18nKeyBuilder('dataViews.kanban.options.');

const columnWidthItems: DropdownRadioSubmenuItem[] = KANBAN_COLUMN_WIDTHS.map(
  (width) => ({ value: width, label: optionsI18nKey(width) }),
);

const columnBackgroundItems: DropdownRadioSubmenuItem[] =
  KANBAN_COLUMN_BACKGROUNDS.map((background) => ({
    value: background,
    label: optionsI18nKey(background),
  }));

/**
 * Renders the kanban view settings menu content with a picker
 * for the select property the columns are generated from, the
 * column width and background, a card layout picker, and the
 * toolbar card settings.
 */
export const KanbanViewOptionsMenu: React.FC<
  DataViewTypeSettingsMenuProps<KanbanViewOptions>
> = ({ view, options, onUpdateOptions }) => {
  const { available, property, databaseId } = useKanbanGroupProperty(view);

  // The database IDs the layout and toolbar card pickers address
  const databaseIds = databaseId ? [databaseId] : [];

  // The column styling settings, falling back to the defaults
  const columnWidth =
    options.columnWidth ?? defaultKanbanViewOptions.columnWidth;
  const columnBackground =
    options.columnBackground ?? defaultKanbanViewOptions.columnBackground;
  const columnScroll =
    options.columnScroll ?? defaultKanbanViewOptions.columnScroll;

  // Set the select property the columns are generated from
  function handleGroupByChange(propertyName: string) {
    onUpdateOptions({ groupBy: propertyName });
  }

  // Set the width the columns take
  function handleColumnWidthChange(value: string) {
    // Check that the value is one of the column widths
    if (!isColumnWidth(value)) {
      return;
    }

    onUpdateOptions({ columnWidth: value });
  }

  // Set the background the columns are drawn on
  function handleColumnBackgroundChange(value: string) {
    // Check that the value is one of the column backgrounds
    if (!isColumnBackground(value)) {
      return;
    }

    onUpdateOptions({ columnBackground: value });
  }

  // Set whether each column's cards scroll on their own
  function handleColumnScrollChange(checked: boolean) {
    onUpdateOptions({ columnScroll: checked });
  }

  // Set the card layout override for the database the selection
  // belongs to.
  function handleLayoutChange(layoutId: string, layoutDatabaseId?: string) {
    // Check that the selection names a database
    if (!layoutDatabaseId) {
      return;
    }

    onUpdateOptions({
      cardLayoutOverrides: {
        ...options.cardLayoutOverrides,
        [layoutDatabaseId]: layoutId,
      },
    });
  }

  // Set a database's toolbar card configuration
  function handleToolbarCardChange(
    cardDatabaseId: string,
    cardOptions: KanbanViewToolbarCardOptions,
  ) {
    onUpdateOptions({
      toolbarCards: {
        ...options.toolbarCards,
        [cardDatabaseId]: cardOptions,
      },
    });
  }

  return (
    <>
      {/** Group by property picker **/}
      {available.length > 0 && (
        <MenuGroup>
          <MenuLabel label="dataViews.kanban.groupBy" />
          <DropdownMenuRadioGroup
            value={property?.name ?? ''}
            onValueChange={handleGroupByChange}
          >
            {available.map((candidate) => (
              <DropdownMenuRadioItem
                key={candidate.name}
                value={candidate.name}
                stringLabel={candidate.name}
              />
            ))}
          </DropdownMenuRadioGroup>
        </MenuGroup>
      )}

      <DropdownMenuSeparator />

      {/** Column settings **/}
      <MenuGroup>
        <MenuLabel label="dataViews.kanban.options.columns" />
        <DropdownRadioSubmenu
          label="dataViews.kanban.options.width"
          items={columnWidthItems}
          value={columnWidth}
          onValueChange={handleColumnWidthChange}
        />

        <DropdownRadioSubmenu
          label="dataViews.kanban.options.background"
          items={columnBackgroundItems}
          value={columnBackground}
          onValueChange={handleColumnBackgroundChange}
        />

        <DropdownMenuSwitchItem
          label="dataViews.kanban.options.scroll"
          checked={columnScroll}
          onCheckedChange={handleColumnScrollChange}
        />
      </MenuGroup>

      <DropdownMenuSeparator />

      {/** Card layout picker **/}
      <DatabaseLayoutSelectionMenu
        databaseId={databaseIds}
        layoutType="card"
        value={options.cardLayoutOverrides || {}}
        onValueChange={handleLayoutChange}
      />

      {/** Toolbar card settings, hidden when there are no cards **/}
      {databaseIds.length > 0 && (
        <>
          <DropdownMenuSeparator />

          <MenuGroup>
            <MenuLabel label="dataViews.kanban.toolbarCards" />
            {databaseIds.map((cardDatabaseId) => (
              <ToolbarCardMenu
                key={cardDatabaseId}
                databaseId={cardDatabaseId}
                cardOptions={options.toolbarCards?.[cardDatabaseId] || {}}
                onChange={(cardOptions) =>
                  handleToolbarCardChange(cardDatabaseId, cardOptions)
                }
              />
            ))}
          </MenuGroup>
        </>
      )}
    </>
  );
};

// Narrows a submenu's value to one of the column widths
function isColumnWidth(value: string): value is KanbanColumnWidth {
  return KANBAN_COLUMN_WIDTHS.some((width) => width === value);
}

// Narrows a submenu's value to one of the column backgrounds
function isColumnBackground(value: string): value is KanbanColumnBackground {
  return KANBAN_COLUMN_BACKGROUNDS.some((background) => background === value);
}

interface ToolbarCardMenuProps {
  /**
   * The ID of the database whose toolbar card is configured.
   */
  databaseId: string;

  /**
   * The card's current configuration.
   */
  cardOptions: KanbanViewToolbarCardOptions;

  /**
   * Called with the card's updated configuration.
   */
  onChange: (cardOptions: KanbanViewToolbarCardOptions) => void;
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

  // Check that the database is still available
  if (!database) {
    return null;
  }

  // The entry templates the card can create entries from
  const templates = database.entryTemplates ?? [];

  // Toggle the card's visibility in the toolbar
  function handleVisibilityChange(visible: boolean) {
    onChange({ ...cardOptions, hidden: !visible });
  }

  // Set the template used by the card, clearing it when the
  // blank entry option is selected.
  function handleTemplateChange(value: string) {
    const { templateId, ...rest } = cardOptions;

    onChange(value === BLANK_ENTRY ? rest : { ...rest, templateId: value });
  }

  // Check if the database has templates. Without them the card
  // renders as a plain visibility switch.
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
            {/** Toolbar visibility switch **/}
            <DropdownMenuSwitchItem
              label="dataViews.kanban.showToolbarCard"
              checked={!cardOptions.hidden}
              onCheckedChange={handleVisibilityChange}
            />

            {/** Template picker **/}
            <DropdownMenuSeparator />
            <MenuGroup>
              <MenuLabel label="dataViews.kanban.toolbarCardTemplate" />
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
