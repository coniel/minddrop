import {
  DefaultQueryIcon,
  MULTISELECT_QUERY_OPERATORS,
  QUERY_OPERATORS_BY_PROPERTY_TYPE,
  QueriesIcon,
  VALUE_LESS_QUERY_OPERATORS,
} from './constants';
import { QueryNotFoundError } from './errors';
import {
  QueriesLoadedEvent,
  QueryCreatedEvent,
  QueryDeletedEvent,
  QueryUpdatedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: QueryCreatedEvent,
  Updated: QueryUpdatedEvent,
  Deleted: QueryDeletedEvent,
  Loaded: QueriesLoadedEvent,
} as const;

export const errors = {
  NotFound: QueryNotFoundError,
};

export const constants = {
  Icon: QueriesIcon,
  EntityDefaultIcon: DefaultQueryIcon,
  MultiselectOperators: MULTISELECT_QUERY_OPERATORS,
  OperatorsByPropertyType: QUERY_OPERATORS_BY_PROPERTY_TYPE,
  ValueLessOperators: VALUE_LESS_QUERY_OPERATORS,
};

export { createQuery as create } from './createQuery';
export { deleteQuery as delete } from './deleteQuery';
export { getQuery as get } from './getQuery';
export { writeQuery as write } from './writeQuery';
export { readQuery as read } from './readQuery';
export {
  QueriesStore as Store,
  useQuery as use,
  useQueries as useAll,
} from './QueriesStore';
export { updateQuery as update } from './updateQuery';
export { initializeQueries as initialize } from './initializeQueries';
export { runQuery as run } from './runQuery';
export { runQueryNode as runNode } from './runQueryNode';
export {
  searchQueries as search,
  createQueryNode as createNode,
  updateQueryNode as updateNode,
  removeQueryNode as removeNode,
  addQueryConnection as addConnection,
  removeQueryConnection as removeConnection,
  removeQueryNodeConnections as removeNodeConnections,
  getQueryDatabases as getDatabases,
} from './utils';
export { useQueryResults as useResults } from './useQueryResults';
export { useQueryNodeResults as useNodeResults } from './useQueryNodeResults';
export { getQueryNodeCounts as getNodeCounts } from './getQueryNodeCounts';
export { useQueryNodeCounts as useNodeCounts } from './useQueryNodeCounts';
