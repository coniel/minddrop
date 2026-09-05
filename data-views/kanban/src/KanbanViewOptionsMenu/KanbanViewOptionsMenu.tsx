import { DataViewTypeSettingsMenuProps } from '@minddrop/data-views';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseLayoutSelectionMenu } from '@minddrop/ui-databases';
import {
  DropdownMenuItem,
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
import { setPendingColumnRename } from '../PendingColumnRenameStore';
import { addKanbanColumn } from '../addKanbanColumn';
import {
  KANBAN_COLUMN_BACKGROUNDS,
  KANBAN_COLUMN_WIDTHS,
  NO_VALUE_COLUMN,
  defaultKanbanViewOptions,
} from '../constants';
import {
  KanbanColumnBackground,
  KanbanColumnWidth,
  KanbanViewOptions,
} from '../types';
import { useKanbanGroupProperty } from '../useKanbanGroupProperty';

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
 * column visibility and styling settings, and a card layout
 * picker.
 */
export const KanbanViewOptionsMenu: React.FC<
  DataViewTypeSettingsMenuProps<KanbanViewOptions>
> = ({ view, options, onUpdateOptions }) => {
  const { available, property, databaseId } = useKanbanGroupProperty(view);

  // The database IDs the card layout picker addresses
  const databaseIds = databaseId ? [databaseId] : [];

  // The column styling settings, falling back to the defaults
  const columnWidth =
    options.columnWidth ?? defaultKanbanViewOptions.columnWidth;
  const columnBackground =
    options.columnBackground ?? defaultKanbanViewOptions.columnBackground;
  const columnScroll =
    options.columnScroll ?? defaultKanbanViewOptions.columnScroll;

  // The option values of the hidden columns
  const hiddenOptions = options.hiddenOptions ?? [];

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

  // Set whether columns holding no entries are hidden
  function handleHideEmptyChange(checked: boolean) {
    onUpdateOptions({ hideEmptyColumns: checked });
  }

  // Show or hide a column on the board
  function handleColumnVisibilityChange(value: string, visible: boolean) {
    onUpdateOptions({
      hiddenOptions: visible
        ? hiddenOptions.filter((hiddenValue) => hiddenValue !== value)
        : [...hiddenOptions, value],
    });
  }

  // Add a column with a default name to the group property,
  // handing it over to the board to open its rename popover.
  async function handleAddColumn() {
    // Check that a group property resolved to append the option to
    if (!property || !databaseId) {
      return;
    }

    const value = await addKanbanColumn(databaseId, property);

    setPendingColumnRename(view.id, value);
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
        {/** Per-column visibility switches **/}
        {property && (
          <DropdownSubmenu>
            <DropdownSubmenuTriggerItem label="dataViews.kanban.columns.visible" />
            <DropdownMenuPortal>
              <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
                <DropdownSubmenuContent>
                  <DropdownMenuSwitchItem
                    label="dataViews.kanban.noValue"
                    checked={!hiddenOptions.includes(NO_VALUE_COLUMN)}
                    onCheckedChange={(visible) =>
                      handleColumnVisibilityChange(NO_VALUE_COLUMN, visible)
                    }
                  />
                  {property.options.map((option) => (
                    <DropdownMenuSwitchItem
                      key={option.value}
                      stringLabel={option.value}
                      checked={!hiddenOptions.includes(option.value)}
                      onCheckedChange={(visible) =>
                        handleColumnVisibilityChange(option.value, visible)
                      }
                    />
                  ))}
                </DropdownSubmenuContent>
              </DropdownMenuPositioner>
            </DropdownMenuPortal>
          </DropdownSubmenu>
        )}

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

        <DropdownMenuSwitchItem
          label="dataViews.kanban.options.hideEmpty"
          checked={options.hideEmptyColumns ?? false}
          onCheckedChange={handleHideEmptyChange}
        />

        {/** Add column with a default name **/}
        {property && (
          <DropdownMenuItem
            icon="plus"
            label="dataViews.kanban.columns.add"
            onSelect={handleAddColumn}
          />
        )}
      </MenuGroup>

      <DropdownMenuSeparator />

      {/** Card layout picker **/}
      <DatabaseLayoutSelectionMenu
        databaseId={databaseIds}
        layoutType="card"
        value={options.cardLayoutOverrides || {}}
        onValueChange={handleLayoutChange}
      />
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
