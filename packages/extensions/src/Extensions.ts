import { disableExtensionOnTopics } from './disableExtensionOnTopics';
import { enableExtensionOnTopics } from './enableExtensionOnTopics';
import { ExtensionConfigsStore } from './ExtensionConfigsStore';
import { ExtensionsResource } from './ExtensionsResource';
import { getEnabledExtensions } from './getEnabledExtensions';
import { getExtension } from './getExtension';
import { getAllExtensions } from './getAllExtensions';
import { getTopicExtensions } from './getTopicExtensions';
import { initializeExtensions } from './initializeExtensions';
import { registerExtension } from './registerExtension';
import { ExtensionsApi } from './types';
import { unregisterExtension } from './unregisterExtension';

export const Extensions: ExtensionsApi = {
  get: getExtension,
  getAll: getAllExtensions,
  getEnabled: getEnabledExtensions,
  register: registerExtension,
  unregister: unregisterExtension,
  enableOnTopics: enableExtensionOnTopics,
  disableOnTopics: disableExtensionOnTopics,
  getTopicExtensions,
  initialize: initializeExtensions,
  store: ExtensionsResource.store,
  configsStore: ExtensionConfigsStore,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
