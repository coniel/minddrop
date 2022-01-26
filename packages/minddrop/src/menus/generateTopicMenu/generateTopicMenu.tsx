// import React from 'react';
// import { App, Slot } from '@minddrop/app';
import { Topic, Topics } from '@minddrop/topics';
import { MenuContents } from '@minddrop/ui';
import { Core } from '@minddrop/core';
import { i18n } from '@minddrop/i18n';

function addSubtopic(core: Core, topic: Topic) {
  // Create the subtopic
  const subtopic = Topics.create(core);

  // Add the new subtopic to the topic
  Topics.addSubtopics(core, topic.id, [subtopic.id]);
}

export function generateTopicMenu(core: Core, topic: Topic): MenuContents {
  return [
    {
      type: 'menu-item',
      label: 'Add subtopic',
      onSelect: () => addSubtopic(core, topic),
      icon: 'inside',
    },
    {
      type: 'menu-item',
      label: i18n.t('delete'),
      onSelect: () => Topics.delete(core, topic.id),
      icon: 'trash',
    },
  ];
}
