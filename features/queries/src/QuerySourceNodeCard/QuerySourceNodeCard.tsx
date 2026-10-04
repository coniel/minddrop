import { useMemo } from 'react';
import { Databases } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import {
  Queries,
  QueryNodeCounts,
  QuerySourceNode,
  QuerySourceReference,
} from '@minddrop/queries';
import {
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasNodeConnection,
  CanvasPoint,
} from '@minddrop/ui-canvas';
import {
  Combobox,
  ComboboxOption,
  ComboboxOptionGroup,
} from '@minddrop/ui-primitives';
import { QueryNodeShell } from '../QueryNodeShell';
import { reconcileQueryNodesWithProperties } from '../utils';

export interface QuerySourceNodeCardProps {
  /**
   * The ID of the query containing the node.
   */
  queryId: string;

  /**
   * The source node rendered by the card.
   */
  node: QuerySourceNode;

  /**
   * The node's entry flow counts.
   */
  counts?: QueryNodeCounts;

  /**
   * Callback fired when a connection drag from the node's
   * output port is dropped on a target node.
   */
  onConnect?(connection: CanvasNodeConnection): void;

  /**
   * Callback fired when a connection drag from the node's
   * output port is released with no target node.
   */
  onConnectRelease?(point: CanvasPoint, from: CanvasConnectionEnd): void;

  /**
   * Resolves connection drag drop targets against the graph's
   * validity rules, re-anchoring accepted targets onto their
   * input port.
   */
  resolveConnectTarget?(
    from: CanvasConnectionEnd,
    target: CanvasConnectionDragTarget,
  ): CanvasConnectionDragTarget | null;
}

/**
 * Renders a source node with a picker for the database or query
 * whose entries it emits into the graph.
 */
export const QuerySourceNodeCard: React.FC<QuerySourceNodeCardProps> = ({
  queryId,
  node,
  counts,
  onConnect,
  onConnectRelease,
  resolveConnectTarget,
}) => {
  const query = Queries.use(queryId);
  const allDatabases = Databases.useAll();
  const allQueries = Queries.useAll();
  const { t } = useTranslation({ keyPrefix: 'queries.sourcePicker' });

  // The selectable sources, grouped by kind, with each option
  // value mapped back onto the source it stands for. Option
  // values are prefixed since a database and a query could
  // share an ID.
  const { groups, sources } = useMemo(() => {
    const optionGroups: ComboboxOptionGroup[] = [];
    const sourceMap = new Map<string, QuerySourceReference>();

    // Databases emit all of their entries
    const databaseOptions = allDatabases.map((database) => {
      const value = sourceOptionValue({ type: 'database', id: database.id });

      sourceMap.set(value, { type: 'database', id: database.id });

      return {
        label: database.name,
        value,
        contentIcon: database.icon,
      };
    });

    if (databaseOptions.length) {
      optionGroups.push({
        value: 'databases',
        label: 'queries.sourcePicker.groups.databases',
        items: databaseOptions,
      });
    }

    // Queries emit their results. The query itself, and queries
    // whose source chain leads back to it, would form a source
    // cycle, so they are left out.
    const queryOptions = allQueries
      .filter(
        (sourceQuery) =>
          sourceQuery.id !== queryId &&
          !Queries.getReferencedQueryIds(sourceQuery).includes(queryId),
      )
      .map((sourceQuery) => {
        const value = sourceOptionValue({ type: 'query', id: sourceQuery.id });

        sourceMap.set(value, { type: 'query', id: sourceQuery.id });

        return {
          label: sourceQuery.name,
          value,
          icon: Queries.constants.Icon,
        };
      });

    if (queryOptions.length) {
      optionGroups.push({
        value: 'queries',
        label: 'queries.sourcePicker.groups.queries',
        items: queryOptions,
      });
    }

    return { groups: optionGroups, sources: sourceMap };
  }, [allDatabases, allQueries, queryId]);

  // The picked source's option, shown in the trigger
  const pickedValue = sourceOptionValue(node.source);
  const selectedOption = groups
    .flatMap((group) => group.items)
    .find((option) => option.value === pickedValue);

  // Persist the picked source, treating a cleared pick as unset,
  // and fit the filter and sort nodes to the new source's
  // database properties.
  function handleSourceChange(
    picked: ComboboxOption | ComboboxOption[] | null,
  ): void {
    // Multi values never occur in single-select mode
    if (Array.isArray(picked) || !query) {
      return;
    }

    const nodes = Queries.updateNode<QuerySourceNode>(query.nodes, node.id, {
      source: (picked && sources.get(picked.value)) || {
        type: 'database',
        id: '',
      },
    });

    // The properties of the database the new source resolves to
    const databaseId = Queries.getDatabase({ ...query, nodes });
    const database = databaseId ? Databases.get(databaseId, false) : null;
    const properties = database
      ? Databases.withImplicitMetadataProperties(database.properties)
      : [];

    Queries.update(queryId, {
      nodes: reconcileQueryNodesWithProperties(nodes, properties),
    });
  }

  return (
    <QueryNodeShell
      queryId={queryId}
      node={node}
      title="queries.nodes.source"
      outputCount={counts?.output}
      hasInputPort={false}
      hasOutputPort
      onConnect={onConnect}
      onConnectRelease={onConnectRelease}
      resolveConnectTarget={resolveConnectTarget}
    >
      <Combobox
        size="md"
        valueVariant="text"
        groups={groups}
        placeholder={t('select')}
        searchPlaceholder="queries.sourcePicker.searchPlaceholder"
        emptyText={t('empty')}
        value={selectedOption ?? null}
        onValueChange={handleSourceChange}
      />
    </QueryNodeShell>
  );
};

/**
 * Builds a source's option value. Values carry the source's
 * type since a database and a query could share an ID.
 */
function sourceOptionValue(source: QuerySourceReference): string {
  return `${source.type}:${source.id}`;
}
