import { DatabaseEntries, Databases } from '@minddrop/databases';
import { PanelView } from '@minddrop/ui-components';
import { ScrollArea } from '@minddrop/ui-primitives';
import {
  DatabaseEntryRenderer,
  DatabaseEntryRendererProps,
} from '../DatabaseEntryRenderer';
import './DatabaseEntryPage.css';

/**
 * Renders a database entry as a standalone page in a panel view.
 */
export const DatabaseEntryPage: React.FC<DatabaseEntryRendererProps> = (
  props,
) => {
  const entry = DatabaseEntries.use(props.entryId);
  const database = Databases.use(entry?.database ?? '');

  return (
    <PanelView
      className="database-entry-page-panel"
      stringTitle={entry?.title || ''}
      contentIcon={database?.icon}
    >
      {/* The layout scrolls within the panel, keeping the header
          in place */}
      <ScrollArea
        className="database-entry-page-content"
        stateKey="content"
        endPadding="lg"
      >
        <DatabaseEntryRenderer {...props} />
      </ScrollArea>
    </PanelView>
  );
};
