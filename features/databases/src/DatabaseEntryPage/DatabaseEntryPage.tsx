import { Panel } from '@minddrop/ui-primitives';
import {
  DatabaseEntryRenderer,
  DatabaseEntryRendererProps,
} from '../DatabaseEntryRenderer';
import './DatabaseEntryPage.css';

export const DatabaseEntryPage: React.FC<DatabaseEntryRendererProps> = (
  props,
) => {
  return (
    <Panel className="database-entry-page">
      <DatabaseEntryRenderer {...props} />
    </Panel>
  );
};
