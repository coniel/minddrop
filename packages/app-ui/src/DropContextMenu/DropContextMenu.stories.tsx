import React, { useEffect } from 'react';
import { Drop, DropNote } from '@minddrop/ui';
import { DropContextMenu } from './DropContextMenu';
import { DROPS_TEST_DATA, useDrop } from '@minddrop/drops';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { initializeCore } from '@minddrop/core';

const { textDrop1 } = DROPS_TEST_DATA;
const { tSailing, tUntitled } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

export default {
  title: 'app-ui/DropContextMenu',
  component: DropContextMenu,
};

export const DropInSingleTopic: React.FC = () => {
  const drop = useDrop(textDrop1.id);

  return (
    <DropContextMenu
      dropId={drop.id}
      topicId={tSailing.id}
      onSelectEdit={() => null}
    >
      <Drop color={drop.color} style={{ maxWidth: 300 }}>
        <DropNote>{drop.markdown}</DropNote>
      </Drop>
    </DropContextMenu>
  );
};

export const DropInMultipleTopics: React.FC = () => {
  const drop = useDrop(textDrop1.id);

  useEffect(() => {
    Topics.addDrops(core, tSailing.id, [textDrop1.id]);
    Topics.addDrops(core, tUntitled.id, [textDrop1.id]);
  }, []);

  return (
    <DropContextMenu
      dropId={drop.id}
      topicId={tSailing.id}
      onSelectEdit={() => null}
    >
      <Drop color={drop.color} style={{ maxWidth: 300 }}>
        <DropNote>{drop.markdown}</DropNote>
      </Drop>
    </DropContextMenu>
  );
};
