import React from 'react';
import { DropDropdownMenu } from './DropDropdownMenu';
import { DROPS_TEST_DATA, useDrop } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { textDrop1 } = DROPS_TEST_DATA;
const { tUntitled } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/DropDropdownMenu',
  component: DropDropdownMenu,
};

export const Default: React.FC = () => {
  const drop = useDrop(textDrop1.id);

  return (
    <DropDropdownMenu
      dropId={drop.id}
      topicId={tUntitled.id}
      onSelectEdit={() => null}
    />
  );
};
