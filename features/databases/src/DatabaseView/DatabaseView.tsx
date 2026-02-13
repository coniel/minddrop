import { DatabaseEntries, Databases } from '@minddrop/databases';
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
          <ViewRenderer
            view={database.views[0]}
            elements={entries.map((entry) => entry.id)}
          />
        </div>
      </Panel>
      {configurationPanelOpen && (
        <DatabaseConfigurationPanel databaseId={databaseId} />
      )}
    </div>
  );
};
