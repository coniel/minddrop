import { DatabaseEntries, Databases } from '@minddrop/databases';
import { ViewRenderer } from '@minddrop/feature-views';
import {
  ContentIcon,
  Heading,
  IconButton,
  Panel,
  Toolbar,
  useToggle,
} from '@minddrop/ui-primitives';
import { View, Views } from '@minddrop/views';
import { DatabaseConfigurationPanel } from '../DatabaseConfigurationPanel';
import './DatabaseView.css';

export interface DatabaseViewProps {
  /**
   * The ID of the database to display.
   */
  databaseId: string;

  /**
   * Whether the properties panel is open by default.
   *
   * @default false
   */
  configurationPanelOpen?: boolean;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  databaseId,
  configurationPanelOpen: configPanelOpen = false,
}) => {
  const database = Databases.use(databaseId);
  const entryIds = DatabaseEntries.useIds(databaseId);
  const databaseViews = Views.useDataSourceViews('database', databaseId);
  const view = databaseViews[0] ?? null;
  const [configurationPanelOpen, toggleConfigurationPanel] =
    useToggle(configPanelOpen);

  async function handleClickNewEntry() {
    if (!database) {
      return;
    }

    DatabaseEntries.create(database.id);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    Databases.handleDrop(databaseId, event);
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
              color="neutral"
              onClick={handleClickNewEntry}
            />
            <IconButton
              icon={
                configurationPanelOpen
                  ? 'panel-right-close'
                  : 'panel-right-open'
              }
              label="Properties"
              color="neutral"
              onClick={toggleConfigurationPanel}
            />
          </Toolbar>
        </div>
        {view && <ViewRenderer key={view.id} view={view} entries={entryIds} />}
      </Panel>
      {configurationPanelOpen && (
        <DatabaseConfigurationPanel databaseId={databaseId} />
      )}
    </div>
  );
};
