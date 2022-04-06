import { addFilesToRichTextElement } from '../addFilesToRichTextElement';
import { addParentsToRichTextElement } from '../addParentsToRichTextElement';
import { clearRegisteredRichTextElementTypes } from '../clearRegisteredRichTextElementTypes';
import { clearRichTextElements } from '../clearRichTextElements';
import { convertRichTextElement } from '../convertRichTextElement';
import { createRichTextElement } from '../createRichTextElement';
import { createRichTextElementOfType } from '../createRichTextElementOfType';
import { deleteRichTextElement } from '../deleteRichTextElement';
import { filterRichTextElements } from '../filterRichTextElements';
import { getAllRichTextElements } from '../getAllRichTextElements';
import { getRichTextElement } from '../getRichTextElement';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { getRichTextElements } from '../getRichTextElements';
import { initializeRichTextElementData } from '../initializeRichTextElementData';
import { loadRichTextElements } from '../loadRichTextElements';
import { nestRichTextElements } from '../nestRichTextElements';
import { permanentlyDeleteRichTextElement } from '../permanentlyDeleteRichTextElement';
import { registerRichTextElementType } from '../registerRichTextElementType';
import { removeFilesFromRichTextElement } from '../removeFilesFromRichTextElement';
import { removeParentsFromRichTextElement } from '../removeParentsFromRichTextElement';
import { replaceFilesInRichTextElement } from '../replaceFilesInRichTextElement';
import { restoreRichTextElement } from '../restoreRichTextElement';
import { toPlainText } from '../toPlainText';
import { RichTextElementsApi } from '../types';
import { unnestRichTextElements } from '../unnestRichTextElements';
import { unregisterRichTextElementType } from '../unregisterRichTextElementType';
import { updateRichTextElement } from '../updateRichTextElement';

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
  createOfType: createRichTextElementOfType,
  update: updateRichTextElement,
  delete: deleteRichTextElement,
  restore: restoreRichTextElement,
  deletePermanently: permanentlyDeleteRichTextElement,
  addParents: addParentsToRichTextElement,
  removeParents: removeParentsFromRichTextElement,
  nest: nestRichTextElements,
  unnest: unnestRichTextElements,
  addFiles: addFilesToRichTextElement,
  removeFiles: removeFilesFromRichTextElement,
  replaceFiles: replaceFilesInRichTextElement,
  toPlainText,
  initializeData: initializeRichTextElementData,
  convert: convertRichTextElement,
  load: loadRichTextElements,
  clearElements: clearRichTextElements,
  clearRegistered: clearRegisteredRichTextElementTypes,
  addEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
  removeEventListener: (core, type, callback) =>
    core.removeEventListener(type, callback),
};
