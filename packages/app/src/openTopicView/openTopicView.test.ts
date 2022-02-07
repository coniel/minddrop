import { initializeCore } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { act } from '@minddrop/test-utils';
import { App } from '../App';
import {
  cleanup,
  instanceView,
  setup,
  topic1,
  viewInstance1,
  viewInstance2,
} from '../tests';
import { openTopicView } from './openTopicView';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('openTopicView', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanup();
  });

  it('opens the default view of the given topic if not opened before', () => {
    act(() => {
      openTopicView(core, topic1.id);
    });

    const currentView = App.getCurrentView();

    // topic1 has viewInstance1 as its first view
    expect(currentView.view).toEqual(instanceView);
    expect(currentView.instance).toEqual(viewInstance1);
  });

  it('opens the previously opened view if no view instance is specified', () => {
    act(() => {
      openTopicView(core, topic1.id, viewInstance2.id);
      openTopicView(core, topic1.id);
    });

    const currentView = App.getCurrentView();

    expect(currentView.view).toEqual(instanceView);
    expect(currentView.instance).toEqual(viewInstance2);
  });

  it('opens the speficied view instance', () => {
    act(() => {
      openTopicView(core, topic1.id, viewInstance2.id);
    });

    const currentView = App.getCurrentView();

    expect(currentView.view).toEqual(instanceView);
    expect(currentView.instance).toEqual(viewInstance2);
  });

  it("saves the view as the topic's last opened view", () => {
    act(() => {
      openTopicView(core, topic1.id, viewInstance2.id);
    });

    expect(
      PersistentStore.getLocalValue(core, 'topicViews', {})[topic1.id],
    ).toBe(viewInstance2.id);
  });
});
