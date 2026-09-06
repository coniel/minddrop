import { DefaultSpaceIcon, SpacesIcon } from './constants';
import { SpaceNotFoundError } from './errors';
import {
  SpaceCreatedEvent,
  SpaceDeletedEvent,
  SpaceUpdatedEvent,
  SpacesLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: SpaceCreatedEvent,
  Updated: SpaceUpdatedEvent,
  Deleted: SpaceDeletedEvent,
  Loaded: SpacesLoadedEvent,
} as const;

export const errors = {
  NotFound: SpaceNotFoundError,
};

export const constants = {
  Icon: SpacesIcon,
  EntityDefaultIcon: DefaultSpaceIcon,
};

export { createSpace as create } from './createSpace';
export { deleteSpace as delete } from './deleteSpace';
export { getSpace as get } from './getSpace';
export { writeSpace as write } from './writeSpace';
export { readSpace as read } from './readSpace';
export {
  searchSpaces as search,
  resolveSpaceMediaDirPath as resolveMediaDirPath,
  setLayoutElementContent,
} from './utils';
export {
  SpacesStore as Store,
  useSpace as use,
  useSpaces as useSome,
  useAllSpaces as useAll,
} from './SpacesStore';
export { updateSpace as update } from './updateSpace';
export { initializeSpaces as initialize } from './initializeSpaces';
