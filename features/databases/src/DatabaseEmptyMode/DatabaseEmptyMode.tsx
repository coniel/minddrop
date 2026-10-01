import { DatabaseEntries } from '@minddrop/databases';
import { DragAndDrop, DropEventData } from '@minddrop/drag-and-drop';
import { useTranslation } from '@minddrop/i18n';
import { Icon, Stack, Text } from '@minddrop/ui-primitives';
import './DatabaseEmptyMode.css';

// The data types the placeholder takes drops of from drags within
// the app. None, since it takes content from outside the app only.
const ACCEPTED_DATA_TYPES: string[] = [];

export interface DatabaseEmptyModeProps {
  /**
   * The ID of the database the placeholder is shown for.
   */
  databaseId: string;
}

/**
 * Renders the placeholder shown in place of the views while the
 * database has no entries: an illustration and the ways to add one.
 */
export const DatabaseEmptyMode: React.FC<DatabaseEmptyModeProps> = ({
  databaseId,
}) => {
  const { t } = useTranslation();

  // Make the placeholder a drop target
  const { droppableProps } = DragAndDrop.useDroppable({
    type: 'database-empty-mode',
    id: databaseId,
    accepts: ACCEPTED_DATA_TYPES,
    nativeAccepts: DatabaseEntries.constants.TransferDataTypes,
    onDrop: handleDrop,
  });

  // Create entries in the database from content dropped in from
  // outside the app.
  function handleDrop(drop: DropEventData) {
    DatabaseEntries.createFromTransferData(drop.data, databaseId);
  }

  return (
    <div className="database-empty-mode" {...droppableProps}>
      <Stack align="center" gap={4}>
        {/* Concentric rings illustration with scattered icons */}
        <div className="database-empty-mode-illustration">
          <div className="database-empty-mode-ring database-empty-mode-ring-1" />
          <div className="database-empty-mode-ring database-empty-mode-ring-2" />
          <div className="database-empty-mode-ring database-empty-mode-ring-3" />
          <div className="database-empty-mode-ring database-empty-mode-ring-4" />
          <div className="database-empty-mode-ring database-empty-mode-ring-5" />

          {/* Central icon */}
          <div className="database-empty-mode-center-icon">
            <Icon name="file-text" />
          </div>

          {/* Icons on the second ring */}
          <div
            className="database-empty-mode-orbit-icon"
            style={{ top: '25%', left: '43%' }}
          >
            <Icon name="file" />
          </div>
          <div
            className="database-empty-mode-orbit-icon"
            style={{ top: '56%', left: '27%' }}
          >
            <Icon name="table" />
          </div>
          <div
            className="database-empty-mode-orbit-icon"
            style={{ top: '50%', left: '65%' }}
          >
            <Icon name="folder" />
          </div>

          {/* Icons on the fourth ring */}
          <div
            className="database-empty-mode-orbit-icon database-empty-mode-orbit-icon-outer"
            style={{ top: '14%', left: '68%' }}
          >
            <Icon name="layout-grid" />
          </div>
          <div
            className="database-empty-mode-orbit-icon database-empty-mode-orbit-icon-outer"
            style={{ top: '18%', left: '18%' }}
          >
            <Icon name="image" />
          </div>
          <div
            className="database-empty-mode-orbit-icon database-empty-mode-orbit-icon-outer"
            style={{ top: '73%', left: '15%' }}
          >
            <Icon name="text" />
          </div>
          <div
            className="database-empty-mode-orbit-icon database-empty-mode-orbit-icon-outer"
            style={{ top: '70%', left: '72%' }}
          >
            <Icon name="link" />
          </div>
        </div>

        {/* Text content */}
        <Text size="lg" weight="semibold" color="muted">
          {t('databases.empty.title')}
        </Text>
        <Text
          size="sm"
          color="subtle"
          style={{ maxWidth: 380, textAlign: 'center' }}
        >
          {t('databases.empty.addViaButton')}
        </Text>
        <Text
          size="sm"
          color="subtle"
          style={{ maxWidth: 380, textAlign: 'center' }}
        >
          {t('databases.empty.drop')}
        </Text>
      </Stack>
    </div>
  );
};
