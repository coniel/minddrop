import React from 'react';
import { generateId } from '@minddrop/utils';
import { initializeCore } from '@minddrop/core';
import { AppCore } from '../types';
import { Slot, UiComponentConfigMap } from '../Slot';
import { useAppStore } from '../useAppStore';

interface InitializeAppConig {
  componentMap: UiComponentConfigMap;
}

export function initializeApp({ componentMap }: InitializeAppConig): AppCore {
  const core = initializeCore('app');
  const app: AppCore = {
    ...core,
    Slot: (props) => <Slot {...props} components={componentMap} />,

    extendUi: (source, location, element) => {
      const type = typeof element === 'object' ? 'config' : 'component';
      useAppStore.getState().addUiExtension({
        source,
        type,
        location,
        element,
        id: generateId(),
      });
    },
  };

  return app;
}
