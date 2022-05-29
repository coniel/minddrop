import { getViewConfig } from './getViewConfig';
import { registerView } from './registerView';
import { ViewsApi } from './types';
import { unregisterView } from './unregisterView';
import { ViewConfigsStore } from './ViewConfigsStore';

export const Views: ViewsApi = {
  get: getViewConfig,
  register: registerView,
  unregister: unregisterView,
  clear: ViewConfigsStore.clear,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
