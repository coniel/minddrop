import { DataTypes, DatabaseEntries, Databases } from '@minddrop/databases';
import { Fs } from '@minddrop/file-system';
import {
  ContentIcon,
  Heading,
  IconButton,
  Panel,
  Toolbar,
  useToggle,
} from '@minddrop/ui-primitives';
import { DatabaseConfigurationPanel } from '../DatabaseConfigurationPanel';
import './DatabaseView.css';
import { ViewRenderer } from '@minddrop/feature-views';

export interface DatabaseViewProps {
  /**
   * The ID of the database to display.
   */
  databaseId: string;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ databaseId }) => {
  const database = Databases.use(databaseId);
  const entries = DatabaseEntries.useAll(databaseId);
  const [configurationPanelOpen, toggleConfigurationPanel] = useToggle(false);

  async function handleClickNewEntry() {
    if (!database) {
      return;
    }

    const dataType = DataTypes.get(database.dataType);

    if (dataType.file) {
      const result = await Fs.openFilePicker({
        accept: dataType.fileExtensions,
        multiple: true,
      });

      if (result) {
        result.forEach(async (filePath) => {
          DatabaseEntries.createFromFilePath(database.id, filePath);
        });
      }
    } else {
      DatabaseEntries.create(database.id);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();

    if (!database) {
      return;
    }

    const { validFiles } = Databases.filterFiles(
      database.id,
      Array.from(event.dataTransfer.files),
    );

    validFiles.forEach(async (file) => {
      DatabaseEntries.createFromFile(database.id, file);
    });
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (!database) {
    return <div className="database-view">Database not found.</div>;
  }

  return (
    <div className="database-view">
      <Panel
        className="database"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="header">
          <div className="title">
            <ContentIcon icon={database.icon} />
            <Heading noMargin>{database.name}</Heading>
          </div>
          <Toolbar>
            <IconButton
              icon="plus"
              label="New"
              color="light"
              onClick={handleClickNewEntry}
            />
            <IconButton
              icon={
                configurationPanelOpen
                  ? 'panel-right-close'
                  : 'panel-right-open'
              }
              label="Properties"
              color="light"
              onClick={toggleConfigurationPanel}
            />
          </Toolbar>
        </div>
        <div className="view">
          {/* <ViewRenderer */}
          {/*   view={database.views[0]} */}
          {/*   elements={entries.map((entry) => entry.id)} */}
          {/* /> */}
        </div>
      </Panel>
      {configurationPanelOpen && (
        <DatabaseConfigurationPanel databaseId={databaseId} />
      )}
    </div>
  );
};
