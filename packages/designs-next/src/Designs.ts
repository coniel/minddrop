import {
  CardAspectRatios,
  MaxDesignRows,
  MinDesignRows,
  SnapPresets,
  UnitPixelSize,
} from './constants';
import { DesignNotFoundError } from './errors';
import {
  DesignCreatedEvent,
  DesignDeletedEvent,
  DesignUpdatedEvent,
  DesignsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: DesignCreatedEvent,
  Updated: DesignUpdatedEvent,
  Deleted: DesignDeletedEvent,
  Loaded: DesignsLoadedEvent,
} as const;

export const errors = {
  NotFound: DesignNotFoundError,
};

export const constants = {
  UnitPixelSize,
  MinRows: MinDesignRows,
  MaxRows: MaxDesignRows,
  CardAspectRatios,
  SnapPresets,
};

export { DesignsStore as Store } from './DesignsStore';
export { createDesign as create } from './createDesign';
export { createDesignElement as createElement } from './createDesignElement';
export { deleteDesign as delete } from './deleteDesign';
export { getDesign as get } from './getDesign';
export { getOwnedDesigns as getByOwner } from './getOwnedDesigns';
export { initializeDesigns as initialize } from './initializeDesigns';
export { loadDesigns as load } from './loadDesigns';
export { readDesign as read } from './readDesign';
export { serializeDesign as serialize } from './serializeDesign';
export { updateDesign as update } from './updateDesign';
export { writeDesign as write } from './writeDesign';
export {
  useDesign as use,
  useDesigns as useAll,
  useDesignsOfType as useOfType,
} from './DesignsStore';
export {
  applyElementDrag,
  applyElementSettings,
  isElementPinOverridden,
  isElementVerticalPinOverridden,
  resolveAspectRatioValue,
  resolveAspectRows,
  resolveElementRect,
  resolveRowLayout,
  resolveVerticalElementRect,
  snapToMultiple,
} from './utils';
