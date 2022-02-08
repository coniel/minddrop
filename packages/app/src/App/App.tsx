import { AppApi, UiExtensionConfig } from '../types';
import { View, ViewInstance, Views } from '@minddrop/views';
import { Slot } from '../Slot';
import { addRootTopics } from '../addRootTopics';
import { useAppStore } from '../useAppStore';
import { openTopicView } from '../openTopicView';
import { createTopic } from '../createTopic';
import { permanentlyDeleteTopic } from '../permanentlyDeleteTopic';

export const App: AppApi = {
  addRootTopics,
  openTopicView,
  createTopic,
  permanentlyDeleteTopic,
  Slot,

  openView: (core, viewId) => {
    const view = Views.get(viewId);

    useAppStore.getState().setView(viewId);

    core.dispatch('app:open-view', { view, instance: null });
  },

  openViewInstance: (core, viewInstanceId) => {
    const instance = Views.getInstance(viewInstanceId);
    const view = Views.get(instance.view);

    useAppStore.getState().setView(view.id);
    useAppStore.getState().setViewInstance(instance);

    core.dispatch('app:open-view', { view, instance });
  },

  getCurrentView: <I extends ViewInstance = ViewInstance>(): {
    view: View;
    instance: I | null;
  } => {
    const view = Views.get(useAppStore.getState().view);
    const instance = useAppStore.getState().viewInstance;

    return { view, instance: instance as I };
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
