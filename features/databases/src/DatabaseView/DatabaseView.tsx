import { Databases } from '@minddrop/databases';
import {
  Button,
  ContentIcon,
  Heading,
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
  const [propertiesPanelOpen, togglePropertiesPanel] = useToggle(false);

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
            <Button
              variant="outlined"
              label="Configure"
              onClick={togglePropertiesPanel}
            />
          </Toolbar>
        </div>
      </Panel>
      {propertiesPanelOpen && (
        <DatabasePropertiesEditor databaseId={databaseId} />
      )}
    </div>
  );
};
