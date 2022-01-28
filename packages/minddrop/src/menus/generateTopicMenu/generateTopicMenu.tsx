// import React from 'react';
// import { App, Slot } from '@minddrop/app';
import { Topic, Topics } from '@minddrop/topics';
import { MenuContents } from '@minddrop/ui';
import { Core } from '@minddrop/core';
import { i18n } from '@minddrop/i18n';
import { PersistentStore } from '@minddrop/persistent-store';
import { FieldValue } from '@minddrop/utils';

export interface TopicMenuOptions {
  /**
   * Callback fired after a subtopic is added using the
   * 'Add subtopic' menu item.
   *
   * @param topic The topic to which the new subtopic was added.
   * @param subtopic The newly created subtopic.
   */
  onAddSubtopic?(topic: Topic, subtopic: Topic): void;

  /**
   * Callback fired when the topic is deleted using the
   * 'Delete' option.
   *
   * @param topic The deleted topic.
   */
  onDelete?(topic: Topic): void;

  /**
   * Callback fired when the 'Rename' menu item is clicked.
   *
   * @param topic The topic to rename.
   */
  onRename(topic: Topic): void;
}

function handleAddSubtopic(
  core: Core,
  topic: Topic,
  callback?: TopicMenuOptions['onAddSubtopic'],
) {
  // Create the subtopic
  const subtopic = Topics.create(core);

  // Add the new subtopic to the topic
  const updatedTopic = Topics.addSubtopics(core, topic.id, [subtopic.id]);

  // Call the onAddSubtopic callback
  if (callback) {
    callback(updatedTopic, subtopic);
  }
}

function handleDelete(
  core: Core,
  topic: Topic,
  callback?: TopicMenuOptions['onDelete'],
) {
  // Delete the topic
  const deletedTopic = Topics.delete(core, topic.id);

  // Call the onDelete callback
  if (callback) {
    callback(deletedTopic);
  }
}

export function generateTopicMenu(
  core: Core,
  topic: Topic,
  options: TopicMenuOptions,
): MenuContents {
  return [
    {
      type: 'menu-item',
      label: 'Add subtopic',
      onSelect: () => handleAddSubtopic(core, topic, options.onAddSubtopic),
      icon: 'inside',
    },
    {
      type: 'menu-item',
      label: i18n.t('delete'),
      onSelect: () => handleDelete(core, topic, options.onDelete),
      icon: 'trash',
    },
    {
      type: 'menu-item',
      label: i18n.t('rename'),
      onSelect: () => options.onRename(topic),
      icon: 'edit',
    },
  ];
}
