import { act, renderHook } from '@minddrop/test-utils';
import {
  GlobalPersistentStore,
  LocalPersistentStore,
} from '@minddrop/persistent-store';
import {
  VIEWS_TEST_DATA,
  Views,
  ViewInstances,
  ViewConfig,
} from '@minddrop/views';
import { Selection } from '@minddrop/selection';
import { TOPICS_TEST_DATA, Topics } from '@minddrop/topics';
import { DROPS_TEST_DATA, Drops } from '@minddrop/drops';
import * as ViewsExtension from '@minddrop/views';
import * as TopicsExtension from '@minddrop/topics';
import * as DropsExtension from '@minddrop/drops';
import {
  onDisable,
  onRun,
  localPersistentDataSchema,
  globalPersistentDataSchema,
  LocalPersistentData,
  GlobalPersistentData,
} from './app-extension';
import { App } from '../App';
import { useAppStore } from '../useAppStore';
import { core } from '../test-utils';
import {} from '.';

const { rootTopicIds, topics, topicViewInstances } = TOPICS_TEST_DATA;
const { drops, drop1 } = DROPS_TEST_DATA;
const {
  instanceViewConfig,
  staticViewConfig,
  viewInstances,
  viewInstance1,
  viewInstance2,
} = VIEWS_TEST_DATA;

export const homeViewConfig: ViewConfig = {
  id: 'app:home',
  type: 'static',
  component: jest.fn(),
};

const localPersistentStoreInitalData: LocalPersistentData = {
  view: 'app:home',
  viewInstance: null,
  topicViews: {},
  topicTrail: [],
  expandedTopics: [],
  sidebarWidth: 300,
};

const globalPersistentStoreInitialData: GlobalPersistentData = {
  rootTopics: rootTopicIds,
  archivedRootTopics: [],
};

describe('app-extension', () => {
  beforeEach(() => {
    ViewsExtension.onRun(core);
    TopicsExtension.onRun(core);
    DropsExtension.onRun(core);

    Views.register(core, instanceViewConfig);
    Views.register(core, staticViewConfig);
    Views.register(core, homeViewConfig);
    ViewInstances.store.load(core, [...viewInstances, ...topicViewInstances]);
    Topics.store.load(core, topics);
    Drops.store.load(core, drops);
  });

  afterEach(() => {
    core.removeAllEventListeners();
    GlobalPersistentStore.store.clear();
    GlobalPersistentStore.typeConfigsStore.clear();
    LocalPersistentStore.store.clear();
    LocalPersistentStore.typeConfigsStore.clear();
    ViewsExtension.onDisable(core);
    TopicsExtension.onDisable(core);
    DropsExtension.onDisable(core);
  });

  describe('onRun', () => {
    beforeEach(() => {
      LocalPersistentStore.initialize(
        core,
        localPersistentDataSchema,
        localPersistentStoreInitalData,
      );
      GlobalPersistentStore.initialize(
        core,
        globalPersistentDataSchema,
        globalPersistentStoreInitialData,
      );
    });
    afterEach(() => onDisable(core));

    it('loads the root topics from the global persistent store', () => {
      // Run the extension
      onRun(core);

      // Root topics should be loaded
      expect(App.getRootTopics().map((topic) => topic.id)).toEqual(
        rootTopicIds,
      );
    });

    it('loads current view from the local persistent store', () => {
      // Set the current view in the local persistent to
      // a static view.
      LocalPersistentStore.set(core, 'view', staticViewConfig.id);
      LocalPersistentStore.set(core, 'viewInstance', null);

      // Run the extension
      onRun(core);

      // Should load the current view
      expect(App.getCurrentView()).toEqual({
        view: Views.get(staticViewConfig.id),
        instance: null,
      });
    });

    it('loads current view instance ID from the local persistent store', () => {
      // Set the current view in the local persistent to
      // a view instance.
      LocalPersistentStore.set(core, 'view', viewInstance1.type);
      LocalPersistentStore.set(core, 'viewInstance', viewInstance1.id);

      // Run the extension
      onRun(core);

      // Shoud load the current view instance ID
      expect(App.getCurrentView()).toEqual({
        view: Views.get(instanceViewConfig.id),
        instance: viewInstance1,
      });
    });

    it('removes deleted topics from root topics', (done) => {
      // Run the extension
      onRun(core);

      // The root topic ID to delete
      const deletedTopicId = rootTopicIds[0];

      // Listen to global persistent store updates
      core.addEventListener('persistent-stores:global:update', () => {
        // Should remove the deleted topic ID from root topics
        expect(GlobalPersistentStore.get(core, 'rootTopics')).not.toContain(
          deletedTopicId,
        );
        done();
      });

      // Delete a root topic
      Topics.delete(core, deletedTopicId);
    });

    it('updates the current view in the local persistent on change', async () => {
      // Set the current view in the local persistent to
      // a view instance.
      LocalPersistentStore.set(core, 'view', viewInstance1.type);
      LocalPersistentStore.set(core, 'viewInstance', viewInstance1.id);

      // Run the extension
      onRun(core);

      act(() => {
        // Open another view
        App.openViewInstance(core, viewInstance2.id);
      });

      // Wait for hooks to run
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      // Should set the view to the openened view
      expect(LocalPersistentStore.get(core, 'view')).toEqual(
        viewInstance2.type,
      );
      // Should set the view instance ID to the openened view instance ID
      expect(LocalPersistentStore.get(core, 'viewInstance')).toEqual(
        viewInstance2.id,
      );
    });

    it('clears selection when the view changes', async () => {
      // Run the extension
      onRun(core);

      act(() => {
        // Select a drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      act(() => {
        // Open a view
        App.openViewInstance(core, viewInstance2.id);
      });

      // Wait for hooks to run
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      // Drop should no longer be selected
      expect(Selection.get()).toEqual([]);
    });
  });

  describe('onDisable', () => {
    it('resets the store', () => {
      // Run the extension
      onRun(core);
      const { result } = renderHook(() => useAppStore());

      act(() => {
        // Add a UI extension
        App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', {
          type: 'icon-button',
          label: 'Button',
          icon: 'settings',
          onClick: jest.fn(),
        });

        // Disable the extension
        onDisable(core);
      });

      // Should clear all UI extesnions
      expect(result.current.uiExtensions.length).toBe(0);
      // Should reset current view
      expect(result.current.view).not.toBe('initial-view-id');
    });

    it('removes event listeners', () => {
      // Run the extension
      onRun(core);

      act(() => {
        // Add an even listener
        App.addEventListener(core, 'app:view:open', jest.fn());

        // Disable the extension
        onDisable(core);
      });

      // Should clear event listeners
      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
