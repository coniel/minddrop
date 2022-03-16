import React from 'react';
import { render, cleanup } from '@minddrop/test-utils';
import { Drops, generateDrop } from '@minddrop/drops';
import { TextDropComponent } from './TextDropComponent';
import { core } from '../test-utils';

const drop = generateDrop({
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'title' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'content',
        },
      ],
    },
  ]),
});

describe('<TextDrop />', () => {
  beforeEach(() => {
    Drops.load(core, [drop]);
  });

  afterEach(() => {
    cleanup();
    Drops.clearDrops(core);
  });

  const init = () => {
    const utils = render(<TextDropComponent {...drop} />);

    return utils;
  };

  it('renders the content', () => {
    const { getByText } = init();

    // Should render the content
    getByText('content');
  });
});
