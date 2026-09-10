import {
  DropdownMenu,
  DropdownMenuColorSelectionItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Icon,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { ContentColor, ContentColors } from '@minddrop/ui-theme';

export interface PreviewColorMenuProps {
  /**
   * The picked colour, or null while the preview follows the
   * previewed entry's own colour.
   */
  color?: ContentColor | null;

  /**
   * The previewed entry's own colour, shown on the option
   * following it.
   */
  entryColor?: ContentColor | null;

  /**
   * Callback fired with the picked colour, or null when the
   * preview is set to follow the entry's own colour.
   */
  onColorChange: (color: ContentColor | null) => void;
}

// Width of the menu panel, wide enough for a colour name beside
// its swatch.
const MenuWidth = 180;

/**
 * Renders the picker for the colour a previewed entry renders
 * with: a toolbar button carrying the colour as its icon, opening
 * a menu of the content colours led by the entry's own colour.
 */
export const PreviewColorMenu: React.FC<PreviewColorMenuProps> = ({
  color,
  entryColor,
  onColorChange,
}) => {
  // The colour the trigger shows: the picked one, or the entry's
  // own while none is picked.
  const shownColor = color ?? entryColor ?? 'default';

  return (
    <DropdownMenu
      side="bottom"
      align="start"
      minWidth={MenuWidth}
      trigger={
        <ToolbarIconButton
          size="sm"
          variant="subtle"
          className="database-design-preview-toolbar-color-trigger"
          label="databases.design.preview.color.label"
          tooltip={{
            title: 'databases.design.preview.color.label',
            description: 'databases.design.preview.color.description',
          }}
        >
          {/* The preview's colour stands in for an icon */}
          <div className={`color-swatch color-swatch-${shownColor}`} />
        </ToolbarIconButton>
      }
    >
      {/* Following the entry, an explicit option rather than
          unpicking the picked colour */}
      <DropdownMenuItem
        label="databases.design.preview.color.matchEntry"
        icon={
          <div
            className={`color-swatch color-swatch-${entryColor ?? 'default'}`}
          />
        }
        trailingIcon={color ? undefined : <Icon name="check" />}
        onSelect={() => onColorChange(null)}
      />

      <DropdownMenuSeparator />

      {ContentColors.map((contentColor) => (
        <DropdownMenuColorSelectionItem
          key={contentColor}
          color={contentColor}
          checked={color === contentColor}
          onClick={() => onColorChange(contentColor)}
        />
      ))}
    </DropdownMenu>
  );
};
