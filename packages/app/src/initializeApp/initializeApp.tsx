import React from 'react';
import { AppApi, UiExtensionConfig } from '../types';
import { Slot, UiComponentConfigMap } from '../Slot';
import { addTopics } from '../addTopics';
import { useAppStore } from '../useAppStore';

interface InitializeAppConig {
  componentMap: UiComponentConfigMap;
}

export function initializeApp({ componentMap }: InitializeAppConig): AppApi {
  const app: AppApi = {
    addTopics,
    Slot: (props) => <Slot {...props} components={componentMap} />,

    openView: (core, view) => {
      useAppStore.getState().setView(view);

      core.dispatch('app:open-view', view);
    },

    addUiExtension: (core, location, element) => {
      const type = typeof element === 'object' ? 'config' : 'component';
      useAppStore.getState().addUiExtension({
        source: core.extensionId,
        type,
        location,
        element,
      } as UiExtensionConfig);
    },

    removeUiExtension: (location, element) => {
      useAppStore.getState().removeUiExtension(location, element);
    },

    removeAllUiExtensions: (core, location) =>
      useAppStore.getState().removeAllUiExtensions(core.extensionId, location),

    addEventListener: (core, event, callback) =>
      core.addEventListener(event, callback),

    removeEventListener: (core, event, callback) =>
      core.removeEventListener(event, callback),
  };

  return app;
}
