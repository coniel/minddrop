import { AppApi, UiExtensionConfig } from '../types';
import { Views, ViewInstances } from '@minddrop/views';
import { Slot } from '../Slot';
import { addRootTopics } from '../addRootTopics';
import { useAppStore } from '../useAppStore';
import { openTopicView } from '../openTopicView';
import { createTopic } from '../createTopic';
import { insertDataIntoTopic } from '../insertDataIntoTopic';
import { getRootTopics } from '../getRootTopics';
import { removeRootTopics } from '../removeRootTopics';
import { archiveRootTopics } from '../archiveRootTopics';
import { unarchiveRootTopics } from '../unarchiveRootTopics';
import { getArchivedRootTopics } from '../getArchivedRootTopics';
import { moveSubtopicsToRoot } from '../moveSubtopicsToRoot';
import { getTopicDropConfigs } from '../getTopicDropConfigs';
import { moveRootTopicsToParentTopic } from '../moveRootTopicsToParentTopic';
import { renderDrop } from '../renderDrop';

export const App: AppApi = {
  addRootTopics,
  removeRootTopics,
  moveSubtopicsToRoot,
  moveRootTopicsToParentTopic,
  getRootTopics,
  archiveRootTopics,
  unarchiveRootTopics,
  getArchivedRootTopics,
  getTopicDropConfigs,
  openTopicView,
  createTopic,
  insertDataIntoTopic,
  renderDrop,
  Slot,

  openView: (core, viewId) => {
    const view = Views.get(viewId);

    useAppStore.getState().setView(viewId);
    useAppStore.getState().setViewInstance(null);

    core.dispatch('app:view:open', { view, instance: null });
  },

  openViewInstance: (core, viewInstanceId) => {
    const instance = ViewInstances.get(viewInstanceId);
    const view = Views.get(instance.type);

    useAppStore.getState().setView(view.id);
    useAppStore.getState().setViewInstance(instance.id);

    core.dispatch('app:view:open', { view, instance });
  },

  getCurrentView: () => {
    const view = Views.get(useAppStore.getState().view);
    const instanceId = useAppStore.getState().viewInstance;

    if (instanceId) {
      return {
        view,
        instance: ViewInstances.get(instanceId),
      };
    }

    return { view, instance: null };
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
