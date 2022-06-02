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
import { TOPICS_TEST_DATA, Topics } from '@minddrop/topics';
import * as ViewsExtension from '@minddrop/views';
import * as TopicsExtension from '@minddrop/topics';
import {
  onDisable,
  onRun,
  localPersistentDataSchema,
  globalPersistentDataSchema,
} from './app-extension';
import { App } from '../App';
import { act, renderHook } from '@minddrop/test-utils';
import { useAppStore } from '../useAppStore';
import { core } from '../test-utils';

const { rootTopicIds, topics } = TOPICS_TEST_DATA;
const { viewInstance1, instanceViewConfig, viewInstance2, staticViewConfig } =
  VIEWS_TEST_DATA;

export const homeViewConfig: ViewConfig = {
  id: 'app:home',
  type: 'static',
  component: jest.fn(),
};

describe('app-extension', () => {
  beforeEach(() => {
    ViewsExtension.onRun(core);
    TopicsExtension.onRun(core);

    Views.register(core, instanceViewConfig);
    Views.register(core, staticViewConfig);
    Views.register(core, homeViewConfig);
    ViewInstances.store.load(core, [viewInstance1, viewInstance2]);
    Topics.store.load(core, topics);
  });

  afterEach(() => {
    GlobalPersistentStore.store.clear();
    GlobalPersistentStore.typeConfigsStore.clear();
    LocalPersistentStore.store.clear();
    LocalPersistentStore.typeConfigsStore.clear();
  });

  describe('onRun', () => {
    afterEach(() => onDisable(core));

    it('loads the root topics from the global persistent store', () => {
      GlobalPersistentStore.initialize(core, globalPersistentDataSchema, {
        rootTopics: rootTopicIds,
        archivedRootTopics: [],
      });
      useAppStore.getState().clear();

      onRun(core);

      expect(App.getRootTopics().map((topic) => topic.id)).toEqual(
        rootTopicIds,
      );
    });

    it('loads current view from the local persistent store', () => {
      // Initialize the persistent stores
      LocalPersistentStore.initialize(core, localPersistentDataSchema, {
        view: 'app:home',
        viewInstance: null,
        topicViews: {},
        topicTrail: [],
        expandedTopics: [],
        sidebarWidth: 300,
      });
      LocalPersistentStore.set(core, 'view', staticViewConfig.id);
      LocalPersistentStore.set(core, 'viewInstance', null);

      onRun(core);

      expect(App.getCurrentView()).toEqual({
        view: Views.get(staticViewConfig.id),
        instance: null,
      });
    });

    it('loads current view instance ID from the local persistent store', () => {
      // Initialize the persistent stores
      LocalPersistentStore.initialize(core, localPersistentDataSchema, {
        view: 'app:home',
        viewInstance: null,
        topicViews: {},
        topicTrail: [],
        expandedTopics: [],
        sidebarWidth: 300,
      });
      LocalPersistentStore.set(core, 'view', viewInstance1.type);
      LocalPersistentStore.set(core, 'viewInstance', viewInstance1.id);

      onRun(core);

      expect(App.getCurrentView()).toEqual({
        view: Views.get(instanceViewConfig.id),
        instance: viewInstance1,
      });
    });

    it('updates the current view in the local persistent on change', (done) => {
      // Initialize the persistent stores
      LocalPersistentStore.initialize(core, localPersistentDataSchema, {
        view: 'app:home',
        viewInstance: null,
        topicViews: {},
        topicTrail: [],
        expandedTopics: [],
        sidebarWidth: 300,
      });
      LocalPersistentStore.set(core, 'view', viewInstance1.type);
      LocalPersistentStore.set(core, 'viewInstance', viewInstance1.id);

      onRun(core);

      act(() => {
        App.openViewInstance(core, viewInstance2.id);
      });

      core.addEventListener('persistent-stores:local:update', () => {
        expect(LocalPersistentStore.get(core, 'view')).toEqual(
          viewInstance2.type,
        );
        expect(LocalPersistentStore.get(core, 'viewInstance')).toEqual(
          viewInstance2.id,
        );
        done();
      });
    });
  });

  describe('onDisable', () => {
    it('resets the store', () => {
      onRun(core);
      const { result } = renderHook(() => useAppStore());

      act(() => {
        App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', {
          type: 'icon-button',
          label: 'Button',
          icon: 'settings',
          onClick: jest.fn(),
        });
        onDisable(core);
      });

      expect(result.current.uiExtensions.length).toBe(0);
      expect(result.current.view).not.toBe('initial-view-id');
    });

    it('removes event listeners', () => {
      onRun(core);

      act(() => {
        App.addEventListener(core, 'app:view:open', jest.fn());

        onDisable(core);
      });

      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
