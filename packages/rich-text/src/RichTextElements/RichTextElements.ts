import { createRichTextElement } from '../createRichTextElement';
import { deleteRichTextElement } from '../deleteRichTextElement';
import { filterRichTextElements } from '../filterRichTextElements';
import { getAllRichTextElements } from '../getAllRichTextElements';
import { getRichTextElement } from '../getRichTextElement';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { getRichTextElements } from '../getRichTextElements';
import { permanentlyDeleteRichTextElement } from '../permanentlyDeleteRichTextElement';
import { registerRichTextElementType } from '../registerRichTextElementType';
import { restoreRichTextElement } from '../restoreRichTextElement';
import { RichTextElementsApi } from '../types';
import { unregisterRichTextElementType } from '../unregisterRichTextElementType';
import { updateRichTextElement } from '../updateRichTextElement';
import { validateUpdateRichTextElementData } from '../validateUpdateRichTextElementData';

export const RichTextElements: RichTextElementsApi = {
  register: registerRichTextElementType,
  unregister: unregisterRichTextElementType,
  getConfig: getRichTextElementConfig,
  get: (elementId, filters = {}) =>
    Array.isArray(elementId)
      ? getRichTextElements(elementId, filters)
      : getRichTextElement(elementId),
  getAll: getAllRichTextElements,
  filter: filterRichTextElements,
  create: createRichTextElement,
  update: (core, elementId, data) => {
    // Prevents special fields like `parents` from being updated directly
    // via the public API.
    validateUpdateRichTextElementData(data);

    // Update the element
    return updateRichTextElement(core, elementId, data);
  },
  delete: deleteRichTextElement,
  restore: restoreRichTextElement,
  deletePermanently: permanentlyDeleteRichTextElement,
  addEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
  removeEventListener: (core, type, callback) =>
    core.removeEventListener(type, callback),
};
