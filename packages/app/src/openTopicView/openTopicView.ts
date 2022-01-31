import { Core } from '@minddrop/core';
import { i18n } from '@minddrop/i18n';
import { Topics } from '@minddrop/topics';
import { App } from '../App';

/**
 * Opens the view of a given topic.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to open.
 */
export function openTopicView(core: Core, topicId: string): void {
  const topic = Topics.get(topicId);

  App.openView(core, {
    id: 'topic',
    title: topic.title || i18n.t('untitled'),
    resource: {
      type: 'topic',
      id: topicId,
    },
  });
}
