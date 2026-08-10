import { useMemo } from 'react';
import { Query } from '@minddrop/queries';
import { ContentIcon, Group, Icon, Stack, Text } from '@minddrop/ui-primitives';
import { SOURCE_FALLBACK_ICON } from '../constants';
import { getQueryMismatchedSourceDatabases } from '../utils';
import './QueryNodeMismatchWarning.css';

export interface QueryNodeMismatchWarningProps {
  /**
   * The query containing the node.
   */
  query: Query;

  /**
   * The ID of the node whose inputs are checked.
   */
  nodeId: string;
}

/**
 * Renders a warning listing the sources connected to a node
 * whose entries lack the node's configured property. Renders
 * nothing when every input contains the property.
 */
export const QueryNodeMismatchWarning: React.FC<
  QueryNodeMismatchWarningProps
> = ({ query, nodeId }) => {
  // Sources connected to the node whose entries lack the
  // node's property
  const mismatchedDatabases = useMemo(
    () => getQueryMismatchedSourceDatabases(query, nodeId),
    [query, nodeId],
  );

  // All inputs contain the property
  if (mismatchedDatabases.length === 0) {
    return null;
  }

  return (
    <Stack gap={2} className="queries-node-mismatch-warning">
      <Group gap={1} className="queries-node-mismatch-warning-message">
        <Icon name="triangle-alert" color="warning" />
        <Text
          size="xs"
          color="warning"
          text="queries.editor.propertyMismatch"
        />
      </Group>

      {/* The sources whose entries lack the property */}
      <Stack gap={1} className="queries-node-mismatch-warning-sources">
        {mismatchedDatabases.map((database) => (
          <Group key={database.id} gap={1}>
            <ContentIcon
              icon={database.icon || SOURCE_FALLBACK_ICON}
              className="queries-node-mismatch-warning-source-icon"
            />
            <Text size="xs" color="regular" stringText={database.name} />
          </Group>
        ))}
      </Stack>
    </Stack>
  );
};
