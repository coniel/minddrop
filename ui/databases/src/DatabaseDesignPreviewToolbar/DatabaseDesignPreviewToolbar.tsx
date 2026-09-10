import { DatabaseEntries, Databases } from '@minddrop/databases';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/ui-theme';
import { PreviewColorMenu } from './PreviewColorMenu';
import { PreviewEntryMenu } from './PreviewEntryMenu';
import './DatabaseDesignPreviewToolbar.css';

export interface DatabaseDesignPreviewToolbarProps {
  /**
   * The ID of the database whose design is previewed.
   */
  databaseId: string;

  /**
   * The ID of the previewed entry.
   */
  entryId?: string;

  /**
   * The colour the preview is rendered with, or null while it
   * follows the previewed entry's own colour.
   */
  color?: ContentColor | null;

  /**
   * The previewed entry's own colour, shown on the option
   * following it.
   */
  entryColor?: ContentColor | null;

  /**
   * Callback fired with the picked entry's ID.
   */
  onEntryChange: (entryId: string) => void;

  /**
   * Callback fired with the picked colour, or null when the
   * preview is set to follow the entry's own colour.
   */
  onColorChange: (color: ContentColor | null) => void;
}

/**
 * Renders the controls for previewing a database design against
 * one of the database's entries: the colour the preview renders
 * with and the entry it renders.
 */
export const DatabaseDesignPreviewToolbar: React.FC<
  DatabaseDesignPreviewToolbarProps
> = ({
  databaseId,
  entryId,
  color,
  entryColor,
  onEntryChange,
  onColorChange,
}) => {
  const database = Databases.use(databaseId);
  const entries = DatabaseEntries.useAll(databaseId);

  return (
    <FloatingToolbar size="md" visible>
      <PreviewColorMenu
        color={color}
        entryColor={entryColor}
        onColorChange={onColorChange}
      />

      {/* An empty database has no entry to pick, but its designs
          are still previewed in a colour */}
      {entries.length > 0 && (
        <PreviewEntryMenu
          databaseId={databaseId}
          entries={entries}
          entryId={entryId}
          icon={database?.icon}
          onEntryChange={onEntryChange}
        />
      )}
    </FloatingToolbar>
  );
};
