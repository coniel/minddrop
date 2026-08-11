import { useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { useTranslation } from '@minddrop/i18n';
import {
  Queries,
  Query,
  QueryCollectionFilterNode,
  QueryNodeCounts,
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
  Select,
  SelectOption,
  Stack,
} from '@minddrop/ui-primitives';
import { QueryNodeShell } from '../QueryNodeShell';

export interface QueryCollectionFilterNodeCardProps {
  /**
   * The query being edited.
   */
  query: Query;

  /**
   * The collection filter node rendered by the card.
   */
  node: QueryCollectionFilterNode;

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

// Option value of the any-collection pick, which has no
// collection ID of its own
const ANY_COLLECTION_VALUE = 'any-collection';

// The membership operators offered by the card
const OPERATOR_OPTIONS: SelectOption<QueryCollectionFilterNode['operator']>[] =
  [
    { label: 'queries.collectionOperators.is-in', value: 'is-in' },
    { label: 'queries.collectionOperators.is-not-in', value: 'is-not-in' },
  ];

/**
 * Renders a collection filter node with membership operator and
 * collection inputs. Applies to any input, as membership does
 * not depend on the upstream databases.
 */
export const QueryCollectionFilterNodeCard: React.FC<
  QueryCollectionFilterNodeCardProps
> = ({
  query,
  node,
  counts,
  onConnect,
  onConnectRelease,
  resolveConnectTarget,
}) => {
  const allCollections = Collections.useAll();
  const { t } = useTranslation({ keyPrefix: 'queries.collectionPicker' });

  // The any-collection option, kept in its own unlabelled group
  // above the named collections
  const anyCollectionGroup = useMemo<ComboboxOptionGroup>(
    () => ({
      value: 'any',
      items: [
        {
          label: t('anyCollection'),
          value: ANY_COLLECTION_VALUE,
          icon: 'library',
        },
      ],
    }),
    [t],
  );

  // Virtual collections belong to individual entries' collection
  // properties, too numerous and granular to pick by name. The
  // any-collection option spans them regardless.
  const collectionGroup = useMemo<ComboboxOptionGroup>(
    () => ({
      value: 'collections',
      label: 'queries.collectionPicker.groups.collections',
      items: allCollections
        .filter((collection) => !collection.virtual)
        .map((collection) => ({
          label: collection.name,
          value: collection.id,
          icon: 'library' as const,
        }))
        .sort((optionA, optionB) => optionA.label.localeCompare(optionB.label)),
    }),
    [allCollections],
  );

  // Skip the collections group while there are none, leaving the
  // any-collection option on its own
  const groups = collectionGroup.items.length
    ? [anyCollectionGroup, collectionGroup]
    : [anyCollectionGroup];

  // The picked option, shown in the trigger
  const selectedOption = groups
    .flatMap((group) => group.items)
    .find((option) =>
      node.source === 'any-collection'
        ? option.value === ANY_COLLECTION_VALUE
        : option.value === node.collection,
    );

  // Persist an operator change
  function handleOperatorChange(operator: 'is-in' | 'is-not-in'): void {
    Queries.update(query.id, {
      nodes: updateQueryNode<QueryCollectionFilterNode>(query.nodes, node.id, {
        operator,
      }),
    });
  }

  // Persist a collection change, treating a cleared pick as
  // unset
  function handleCollectionChange(
    picked: ComboboxOption | ComboboxOption[] | null,
  ): void {
    // Multi values never occur in single-select mode
    if (Array.isArray(picked)) {
      return;
    }

    // The any-collection option spans every collection instead
    // of naming one
    const anyCollection = picked?.value === ANY_COLLECTION_VALUE;

    Queries.update(query.id, {
      nodes: updateQueryNode<QueryCollectionFilterNode>(query.nodes, node.id, {
        source: anyCollection ? 'any-collection' : 'collection',
        collection: anyCollection ? '' : picked?.value || '',
      }),
    });
  }

  return (
    <QueryNodeShell
      queryId={query.id}
      node={node}
      title="queries.nodes.collectionFilter"
      inputCount={counts?.input}
      totalInputCount={counts?.inputTotal}
      outputCount={counts?.output}
      hasInputPort
      hasOutputPort
      onConnect={onConnect}
      onConnectRelease={onConnectRelease}
      resolveConnectTarget={resolveConnectTarget}
    >
      <Stack gap={2}>
        {/* Membership operator picker */}
        <Select<'is-in' | 'is-not-in'>
          options={OPERATOR_OPTIONS}
          value={node.operator}
          onValueChange={handleOperatorChange}
        />

        {/* Collection picker */}
        <Combobox
          size="md"
          valueVariant="text"
          groups={groups}
          placeholder={t('select')}
          searchPlaceholder="queries.collectionPicker.searchPlaceholder"
          emptyText={t('empty')}
          value={selectedOption ?? null}
          onValueChange={handleCollectionChange}
        />
      </Stack>
    </QueryNodeShell>
  );
};
