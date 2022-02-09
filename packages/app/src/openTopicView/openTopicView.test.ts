import { initializeCore } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { act } from '@minddrop/test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { App } from '../App';
import { cleanup, setup } from '../test-utils';
import { openTopicView } from './openTopicView';

const {
  view,
  tCoastalNavigation,
  tNavigation,
  tSailing,
  tCoastalNavigationView,
  tCoastalNavigationView2,
} = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });
const trail = [tSailing.id, tNavigation.id, tCoastalNavigation.id];

describe('openTopicView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens the default view of the given topic if not opened before', () => {
    act(() => {
      openTopicView(core, trail);
    });

    const currentView = App.getCurrentView();

    // tCoastalNavigation has tCoastalNavigationView as its first view
    expect(currentView.view).toEqual(view);
    expect(currentView.instance).toEqual(tCoastalNavigationView);
  });

  it('opens the previously opened view if no view instance is specified', () => {
    act(() => {
      openTopicView(core, trail, tCoastalNavigationView2.id);
      openTopicView(core, trail);
    });

    const currentView = App.getCurrentView();

    expect(currentView.view).toEqual(view);
    expect(currentView.instance).toEqual(tCoastalNavigationView2);
  });

  it('opens the speficied view instance', () => {
    act(() => {
      openTopicView(core, trail, tCoastalNavigationView2.id);
    });

    const currentView = App.getCurrentView();

    expect(currentView.view).toEqual(view);
    expect(currentView.instance).toEqual(tCoastalNavigationView2);
  });

  it("saves the view as the topic's last opened view in the local persistent store", () => {
    act(() => {
      openTopicView(core, trail, tCoastalNavigationView2.id);
    });

    expect(
      PersistentStore.getLocalValue(core, 'topicViews', {})[
        tCoastalNavigation.id
      ],
    ).toBe(tCoastalNavigationView2.id);
  });

  it('saves the trail in the local persitent store', () => {
    act(() => {
      openTopicView(core, trail);
    });

    expect(PersistentStore.getLocalValue(core, 'topicTrail', [])).toEqual(
      trail,
    );
  });
});
