import { useStore } from './useStore';
import { generateTopic } from './api';
import { App } from './types';
import { ExtensionAppApi } from './types/ExtensionAppApi.types';

export function initializeExtension(
  extensionId: string,
  app: App,
): ExtensionAppApi {
  return {
    ...app,

    addEventListener: (type, callback) =>
      app.addEventListener(extensionId, type, callback),

    dispatch: (type, data) => app.dispatch(extensionId, type, data),

    extendUi: (location, element) =>
      app.extendUi(extensionId, location, element),

    openView: (view) => app.dispatch(extensionId, 'open-view', view),
  };
}
