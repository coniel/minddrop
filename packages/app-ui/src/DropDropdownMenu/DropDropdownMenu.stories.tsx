import React from 'react';
import { DropDropdownMenu } from './DropDropdownMenu';
import { DROPS_TEST_DATA, useDrop } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { textDrop1 } = DROPS_TEST_DATA;
const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app/DropDropdownMenu',
  component: DropDropdownMenu,
};

export const Default: React.FC = () => {
  const drop = useDrop(textDrop1.id);

  return (
    <DropDropdownMenu
      drop={drop.id}
      topic={tSailing.id}
      onSelectEdit={() => null}
    />
  );
};
