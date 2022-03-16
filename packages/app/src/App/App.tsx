import { AppApi, UiExtensionConfig } from '../types';
import { Views } from '@minddrop/views';
import { Slot } from '../Slot';
import { addRootTopics } from '../addRootTopics';
import { useAppStore } from '../useAppStore';
import { openTopicView } from '../openTopicView';
import { createTopic } from '../createTopic';
import { insertDataIntoTopic } from '../insertDataIntoTopic';
import { selectDrops } from '../selectDrops';
import { getSelectedDrops } from '../getSelectedDrops';
import { clearSelectedDrops } from '../clearSelectedDrops';
import { unselectDrops } from '../unselectDrops';
import { getRootTopics } from '../getRootTopics';
import { removeRootTopics } from '../removeRootTopics';
import { archiveRootTopics } from '../archiveRootTopics';
import { unarchiveRootTopics } from '../unarchiveRootTopics';
import { getArchivedRootTopics } from '../getArchivedRootTopics';
import { moveSubtopicsToRoot } from '../moveSubtopicsToRoot';
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
  openTopicView,
  createTopic,
  insertDataIntoTopic,
  selectDrops,
  unselectDrops,
  clearSelectedDrops,
  getSelectedDrops,
  renderDrop,
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
    useAppStore.getState().setViewInstance(instance.id);

    core.dispatch('app:open-view', { view, instance });
  },

  getCurrentView: () => {
    const view = Views.get(useAppStore.getState().view);
    const instanceId = useAppStore.getState().viewInstance;

    if (instanceId) {
      return {
        view,
        instance: Views.getInstance(instanceId),
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
