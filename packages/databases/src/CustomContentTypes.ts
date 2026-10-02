import {
  CustomContentTypeEntityType,
  CustomContentTypeKinds,
} from './constants';
import { CustomContentTypeNotFoundError } from './errors';

export const errors = {
  NotFound: CustomContentTypeNotFoundError,
};

export const constants = {
  EntityType: CustomContentTypeEntityType,
  Kinds: CustomContentTypeKinds,
};

export { createCustomContentType as create } from './createCustomContentType';
export { getCustomContentType as get } from './getCustomContentType';
export { getCustomContentTypes as getAll } from './getCustomContentTypes';
export { updateCustomContentType as update } from './updateCustomContentType';
export type { CustomContentTypeChanges } from './updateCustomContentType';
export { deleteCustomContentType as delete } from './deleteCustomContentType';
export { useCustomContentTypes as useAll } from './DatabaseSettingsStore';
export {
  findContentTypeMatcherOwner as findMatcherOwner,
  normalizeContentTypeMatcher as normalizeMatcher,
} from './utils';
