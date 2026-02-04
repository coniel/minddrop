import { DatabaseEntries, Databases } from '@minddrop/databases';
import {
  ContentIcon,
  Heading,
  IconButton,
  Panel,
  Toolbar,
  useToggle,
} from '@minddrop/ui-primitives';
import './DatabaseView.css';
import { DatabasePropertiesEditor } from '../DatabasePropertiesEditor';

export interface DatabaseViewProps {
  /**
   * The ID of the database to display.
   */
  databaseId: string;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ databaseId }) => {
  const database = Databases.use(databaseId);
  const entries = DatabaseEntries.useAll(databaseId);
  const [propertiesPanelOpen, togglePropertiesPanel] = useToggle(false);

  function handleClickNewEntry() {
    DatabaseEntries.create(databaseId);
  }

  if (!database) {
    return <div className="database-view">Database not found.</div>;
  }

  return (
    <div className="database-view">
      <Panel className="database">
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
                propertiesPanelOpen ? 'panel-right-close' : 'panel-right-open'
              }
              label="Properties"
              color="light"
              onClick={togglePropertiesPanel}
            />
          </Toolbar>
        </div>
        <div>
          {entries.map((entry) => (
            <div key={entry.id}>{entry.title}</div>
          ))}
        </div>
      </Panel>
      {propertiesPanelOpen && (
        <DatabasePropertiesEditor databaseId={databaseId} />
      )}
    </div>
  );
};
