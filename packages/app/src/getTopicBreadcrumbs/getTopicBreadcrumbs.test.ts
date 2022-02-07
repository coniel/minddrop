// import { initializeCore } from '@minddrop/core';
// import { PersistentStore } from '@minddrop/persistent-store';
// import { act } from '@minddrop/test-utils';
// import { Topic, Topics } from '@minddrop/topics';
// import { useAppStore } from '../useAppStore';
// import { getTopicBreadcrumbs } from './getTopicBreadcrumbs';

// const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe.skip('openTopicView', () => {
  //   afterEach(() => {
  //     act(() => {
  //       PersistentStore.clearLocalCache();
  //       useAppStore.getState().clear();
  //       Topics.clear(core);
  //     });
  //   });
  it('opens the view of the given topic', () => {
    //     let grandparent: Topic;
    //     let parent: Topic;
    //     let topic: Topic;
    //     act(() => {
    //       grandparent = Topics.create(core, { title: 'Grandparent' });
    //       parent = Topics.create(core, { title: 'Parent' });
    //       topic = Topics.create(core, { title: 'My topic' });
    //       Topics.addSubtopics(core, parent.id, [topic.id]);
    //       Topics.addSubtopics(core, grandparent.id, [parent.id]);
    //     });
    //     const breadcrumbs = getTopicBreadcrumbs(topic.id);
    //     expect(breadcrumbs).toEqual([
    //       {
    //         id: 'topic',
    //         resource: { id: grandparent.id, type: 'topic' },
    //         title: 'Grandparent',
    //       },
    //       {
    //         id: 'topic',
    //         resource: { id: parent.id, type: 'topic' },
    //         title: 'Parent',
    //       },
    //       {
    //         id: 'topic',
    //         resource: { id: topic.id, type: 'topic' },
    //         title: 'My topic',
    //       },
    //     ]);
  });
});
