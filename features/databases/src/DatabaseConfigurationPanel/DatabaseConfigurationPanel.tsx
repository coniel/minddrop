import { Panel } from '@minddrop/ui-primitives';
import { DatabaseDesignsMenu } from '../DatabaseDesignsMenu';
import { DatabasePropertiesEditor } from '../DatabasePropertiesEditor';
import './DatabaseConfigurationPanel.css';

export interface DatabaseConfigurationPanelProps {
  /**
   * The database ID.
   */
  databaseId: string;
}

export const DatabaseConfigurationPanel: React.FC<
  DatabaseConfigurationPanelProps
> = ({ databaseId }) => {
  return (
    <Panel className="database-configuration-panel">
      <DatabasePropertiesEditor databaseId={databaseId} />
      <DatabaseDesignsMenu databaseId={databaseId} />
    </Panel>
  );
};
