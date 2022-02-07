import { getView } from './getView';
import { getViewInstance } from './getViewInstance';
import { getViewInstances } from './getViewInstances';
import { registerView } from './registerView';
import { ViewsApi } from './types';
import { unregisterView } from './unregisterView';
import { updateViewInstance } from './updateViewInstance';
import { createViewInstance } from './createViewInstance';
import { deleteViewInstance } from './deleteViewInstance';
import { loadViewInstances } from './loadViewInstances';
import { clear } from './clear';

export const Views: ViewsApi = {
  get: getView,
  getInstance: getViewInstance,
  getInstances: getViewInstances,
  register: registerView,
  unregister: unregisterView,
  createInstance: createViewInstance,
  updateInstance: updateViewInstance,
  deleteInstance: deleteViewInstance,
  loadInstances: loadViewInstances,
  clear,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
