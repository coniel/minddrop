import React, { useEffect } from 'react';
import { DropDropdownMenu } from './DropDropdownMenu';
import { DROPS_TEST_DATA, useDrop } from '@minddrop/drops';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { initializeCore } from '@minddrop/core';

const { textDrop1 } = DROPS_TEST_DATA;
const { tUntitled, tNoDrops } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

export default {
  title: 'app/DropDropdownMenu',
  component: DropDropdownMenu,
};

export const Default: React.FC = () => {
  const drop = useDrop(textDrop1.id);

  useEffect(() => {
    Topics.addDrops(core, tUntitled.id, [textDrop1.id]);
    Topics.addDrops(core, tNoDrops.id, [textDrop1.id]);
  }, []);

  return (
    <DropDropdownMenu
      dropId={drop.id}
      topicId={tUntitled.id}
      onSelectEdit={() => null}
    />
  );
};
