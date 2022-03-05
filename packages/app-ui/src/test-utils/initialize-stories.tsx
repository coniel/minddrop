import { initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { PersistentStore } from '@minddrop/persistent-store';
import {
  onRun as onRunApp,
  useDraggableDrop,
  useSelectableDrop,
} from '@minddrop/app';
import { onRun as onRunTags } from '@minddrop/tags';
import { onRun as onRunFiles } from '@minddrop/files';
import {
  onRun as onRunTopics,
  Topics,
  TOPICS_TEST_DATA,
} from '@minddrop/topics';
import { Drop, DropConfig, Drops, onRun as onRunDrops } from '@minddrop/drops';
import { Views, VIEWS_TEST_DATA } from '@minddrop/views';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import '../app.css';
import { Drop as DropComponent, DropNote } from '@minddrop/ui';
import React from 'react';

const { viewInstances, viewConfigs } = VIEWS_TEST_DATA;
const {
  dropTypeConfigs,
  drops,
  textDrop1,
  textDrop2,
  textDrop3,
  htmlDrop1,
  textDropConfig,
} = DROPS_TEST_DATA;
const {
  topics,
  rootTopicIds,
  topicViewInstances,
  tCoastalNavigationView,
  tSailingView,
  topicViewConfigs,
} = TOPICS_TEST_DATA;

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });
export const viewsCore = initializeCore({
  appId: 'app-id',
  extensionId: 'views',
});
export const topicsCore = initializeCore({
  appId: 'app-id',
  extensionId: 'topics',
});

export const globalPersistentStore = { rootTopics: rootTopicIds };
export const localPersistentStore = {
  sidebarWidth: 302,
  expandedTopics: [],
  view: 'topics:columns-view',
  viewInstance: tCoastalNavigationView.id,
};

export const columnViewInstance = {
  ...tSailingView,
  view: 'topics:columns-view',
  columns: [[textDrop1.id, textDrop2.id], [textDrop3.id], [htmlDrop1.id], []],
};

const TextDrop: React.FC<Drop> = ({ id, markdown, color }) => {
  const { selectedClass, onClick } = useSelectableDrop(id);
  const { onDragStart } = useDraggableDrop(id);

  return (
    <DropComponent
      draggable
      color={color}
      className={selectedClass}
      onClick={onClick}
      onDragStart={onDragStart}
    >
      <DropNote>{markdown}</DropNote>
    </DropComponent>
  );
};

const customTextDropConfig: DropConfig = {
  ...textDropConfig,
  type: 'text-2',
  component: TextDrop,
};

initializeI18n();

PersistentStore.setGlobalStore(core, globalPersistentStore);
PersistentStore.setLocalStore(core, localPersistentStore);

viewConfigs.forEach((view) => Views.register(viewsCore, view));
[...dropTypeConfigs, customTextDropConfig].forEach((config) =>
  Drops.register(core, {
    ...config,
    component: TextDrop,
  }),
);
Views.loadInstances(core, [
  ...viewInstances,
  ...topicViewInstances,
  columnViewInstance,
]);
Drops.load(core, drops);
topicViewConfigs.forEach((config) => Topics.registerView(core, config));
Topics.load(core, topics);

onRunApp(core);
onRunFiles(core);
onRunTags(core);
onRunDrops(core);
onRunTopics(core);
