import React, { useEffect } from 'react';
import { initializeCore } from '@minddrop/core';
import { Drops, useDrop } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { Resources } from '@minddrop/resources';
import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { onRunTextDrop } from '../onRunTextDrop';
import { TextDropComponent } from './TextDropComponent';
import { TextDropData } from '../types';

const { richTextDocument1 } = RICH_TEXT_TEST_DATA;

export default {
  title: 'drops/Text',
  component: TextDropComponent,
};

const { tSixDrops } = TOPICS_TEST_DATA;

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop/text-drop',
});

const drop = Resources.generateDocument('drops:drop', {
  type: 'text',
  richTextDocument: richTextDocument1.id,
});

Drops.store.load(core, [drop]);

export const Default: React.FC = () => {
  useEffect(() => {
    onRunTextDrop(core);
  }, []);

  const liveDrop = useDrop<TextDropData>(drop.id);

  return (
    <div style={{ maxWidth: 300 }}>
      <TextDropComponent
        {...liveDrop}
        currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
      />
    </div>
  );
};
