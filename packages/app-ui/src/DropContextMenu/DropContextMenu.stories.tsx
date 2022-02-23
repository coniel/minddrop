import React from 'react';
import { Drop, DropNote } from '@minddrop/ui';
import { DropContextMenu } from './DropContextMenu';
import { DROPS_TEST_DATA, useDrop } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { textDrop1 } = DROPS_TEST_DATA;
const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app/DropContextMenu',
  component: DropContextMenu,
};

export const Default: React.FC = () => {
  const drop = useDrop(textDrop1.id);

  return (
    <DropContextMenu
      drop={drop.id}
      topic={tSailing.id}
      onSelectEdit={() => null}
    >
      <Drop color={drop.color} style={{ maxWidth: 300 }}>
        <DropNote>{drop.markdown}</DropNote>
      </Drop>
    </DropContextMenu>
  );
};
