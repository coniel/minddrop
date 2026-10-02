import { AutomationEntityType } from './constants';
import { AutomationNotFoundError } from './errors';
import {
  AutomationCreatedEvent,
  AutomationDeletedEvent,
  AutomationUpdatedEvent,
  AutomationsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: AutomationCreatedEvent,
  Updated: AutomationUpdatedEvent,
  Deleted: AutomationDeletedEvent,
  Loaded: AutomationsLoadedEvent,
} as const;

export const errors = {
  NotFound: AutomationNotFoundError,
};

// Const-asserted so the entity type keeps its literal type. IDs
// minted from it are then typed by it.
export const constants = {
  EntityType: AutomationEntityType,
} as const;

export { createAutomation as create } from './createAutomation';
export { createVirtualAutomation as createVirtual } from './createVirtualAutomation';
export { loadVirtualAutomations as loadVirtual } from './loadVirtualAutomations';
export { deleteAutomation as delete } from './deleteAutomation';
export { getAutomation as get } from './getAutomation';
export { writeAutomation as write } from './writeAutomation';
export { readAutomation as read } from './readAutomation';
export {
  AutomationsStore as Store,
  useAutomation as use,
  useAutomations as useAll,
} from './AutomationsStore';
export { updateAutomation as update } from './updateAutomation';
export { initializeAutomations as initialize } from './initializeAutomations';
export { searchAutomations as search } from './utils';
