import { ContentViewEntityType, ContentViewsIcon } from './constants';
import { ContentViewNotFoundError } from './errors';
import {
  ContentViewCreatedEvent,
  ContentViewDeletedEvent,
  ContentViewUpdatedEvent,
  ContentViewsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: ContentViewCreatedEvent,
  Updated: ContentViewUpdatedEvent,
  Deleted: ContentViewDeletedEvent,
  Loaded: ContentViewsLoadedEvent,
} as const;

export const errors = {
  NotFound: ContentViewNotFoundError,
};

export const constants = {
  EntityType: ContentViewEntityType,
  Icon: ContentViewsIcon,
};

export { initializeContentViews as initialize } from './initializeContentViews';
export { loadWorkspaceContentViews as loadWorkspace } from './loadWorkspaceContentViews';
export { createContentView as create } from './createContentView';
export { createVirtualContentView as createVirtual } from './createVirtualContentView';
export { loadVirtualContentViews as loadVirtual } from './loadVirtualContentViews';
export { unloadContentView as unload } from './unloadContentView';
export { deleteContentView as delete } from './deleteContentView';
export { getContentView as get } from './getContentView';
export { getDataSourceContentViews as getByDataSource } from './getDataSourceContentViews';
export { getContentViewsOfType as getOfType } from './getContentViewsOfType';
export { getOwnedContentViews as getByOwner } from './getOwnedContentViews';
export { getReferencingContentViews as getReferencing } from './getReferencingContentViews';
export { removeContentViewReferences as removeReferences } from './removeContentViewReferences';
export { readContentView as read } from './readContentView';
export {
  searchContentViews as search,
  resolveContentViewFilePath as resolveFilePath,
  isStoredContentView as isStored,
} from './utils';
export { serializeContentView as serialize } from './serializeContentView';
export { deserializeContentView as deserialize } from './deserializeContentView';
export { serializeContentViewConfig as serializeConfig } from './serializeContentViewConfig';
export { resolveContentViewConfig as resolveConfig } from './resolveContentViewConfig';
export { updateContentView as update } from './updateContentView';
export { updateContentViewOptions as updateOptions } from './updateContentViewOptions';
export { updateContentViewData as updateData } from './updateContentViewData';
export { writeContentView as write } from './writeContentView';
export {
  ContentViewsStore as Store,
  useContentView as use,
  useContentViews as useAll,
  useContentViewsOfType as useOfType,
  useDataSourceContentViews,
} from './ContentViewsStore';
export { getRecentContentViews as getRecent } from './utils';
