import React from 'react';
import { AppApi, UiExtensionConfig } from '../types';
import { Slot, UiComponentConfigMap } from '../Slot';
import { useAppStore } from '../useAppStore';

interface InitializeAppConig {
  componentMap: UiComponentConfigMap;
}

export function initializeApp({ componentMap }: InitializeAppConig): AppApi {
  const app: AppApi = {
    Slot: (props) => <Slot {...props} components={componentMap} />,

    openView: (core, view) => {
      useAppStore.getState().setView(view);

      core.dispatch('app:open-view', view);
    },

    addUiExtension: (core, location, element) => {
      const type = typeof element === 'object' ? 'config' : 'component';
      useAppStore.getState().addUiExtension({
        source: core.initializedFor,
        type,
        location,
        element,
      } as UiExtensionConfig);
    },

    removeUiExtension: (location, element) => {
      useAppStore.getState().removeUiExtension(location, element);
    },

    removeAllUiExtensions: (core, location) =>
      useAppStore
        .getState()
        .removeAllUiExtensions(core.initializedFor, location),

    addEventListener: (core, event, callback) =>
      core.addEventListener(event, callback),

    removeEventListener: (core, event, callback) =>
      core.removeEventListener(event, callback),
  };

  return app;
}
