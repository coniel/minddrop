import { clearExtensions } from './clearExtensions';
import { disableExtensionOnTopics } from './disableExtensionOnTopics';
import { enableExtensionOnTopics } from './enableExtensionOnTopics';
import { getEnabledExtensions } from './getEnabledExtensions';
import { getExtension } from './getExtension';
import { getRegisteredExtensions } from './getRegisteredExtensions';
import { getTopicExtensions } from './getTopicExtensions';
import { initializeExtensions } from './initializeExtensions';
import { registerExtension } from './registerExtension';
import { ExtensionsApi } from './types';
import { unregisterExtension } from './unregisterExtension';

export const Extensions: ExtensionsApi = {
  get: getExtension,
  getRegistered: getRegisteredExtensions,
  getEnabled: getEnabledExtensions,
  register: registerExtension,
  unregister: unregisterExtension,
  enableOnTopics: enableExtensionOnTopics,
  disableOnTopics: disableExtensionOnTopics,
  getTopicExtensions,
  initialize: initializeExtensions,
  clear: clearExtensions,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
