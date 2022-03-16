import React, { useEffect } from 'react';
import { initializeCore } from '@minddrop/core';
import { Drops, generateDrop, useDrop } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { onRunTextDrop } from '../onRunTextDrop';
import { TextDropComponent } from './TextDropComponent';
import { TextDrop } from '../types';

export default {
  title: 'drops/Text',
  component: TextDropComponent,
};

const { tSixDrops } = TOPICS_TEST_DATA;

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop/text-drop',
});

const drop = generateDrop({
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Position and its derivatives' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'The position of a point particle is defined in relation to a coordinate system centred on an arbitrary fixed reference point in space called the origin O. A simple coordinate system might describe the position of a particle P with a vector notated by an arrow labeled r that points from the origin O to point P.',
        },
      ],
    },
  ]),
});

Drops.load(core, [drop]);

export const Default: React.FC = () => {
  useEffect(() => {
    onRunTextDrop(core);
  }, []);

  const liveDrop = useDrop<TextDrop>(drop.id);

  return (
    <div style={{ maxWidth: 300 }}>
      <TextDropComponent
        {...liveDrop}
        parent={{ type: 'topic', id: tSixDrops.id }}
      />
    </div>
  );
};
