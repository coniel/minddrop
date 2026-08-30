import { useMemo } from 'react';
import { Databases } from '@minddrop/databases';
import { useTranslation } from '@minddrop/i18n';
import {
  Queries,
  QueriesIcon,
  QueryNodeCounts,
  QuerySourceNode,
  QuerySourceReference,
  updateQueryNode,
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
 * Renders a source node with a picker for the databases and
 * queries whose entries it emits into the graph. Several
 * sources emit their entries combined.
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

    // Queries emit their results. A query drawing from itself
    // would be a reference cycle, so it is left out.
    const queryOptions = allQueries
      .filter((sourceQuery) => sourceQuery.id !== queryId)
      .map((sourceQuery) => {
        const value = sourceOptionValue({ type: 'query', id: sourceQuery.id });

        sourceMap.set(value, { type: 'query', id: sourceQuery.id });

        return {
          label: sourceQuery.name,
          value,
          icon: QueriesIcon,
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

  // The picked sources' options, shown as chips in the trigger
  const pickedValues = node.sources.map(sourceOptionValue);
  const selectedOptions = groups
    .flatMap((group) => group.items)
    .filter((option) => pickedValues.includes(option.value));

  // Persist the picked sources
  function handleSourcesChange(
    picked: ComboboxOption | ComboboxOption[] | null,
  ): void {
    // Single values never occur in multi-select mode
    if (!Array.isArray(picked) || !query) {
      return;
    }

    Queries.update(queryId, {
      nodes: updateQueryNode<QuerySourceNode>(query.nodes, node.id, {
        sources: picked.flatMap((option) => {
          const source = sources.get(option.value);

          return source ? [source] : [];
        }),
      }),
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
        multiple
        size="md"
        groups={groups}
        placeholder={t('select')}
        searchPlaceholder="queries.sourcePicker.searchPlaceholder"
        emptyText={t('empty')}
        value={selectedOptions}
        onValueChange={handleSourcesChange}
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
