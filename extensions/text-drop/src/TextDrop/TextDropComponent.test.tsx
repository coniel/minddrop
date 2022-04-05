import React from 'react';
import { cleanup, render } from '@minddrop/test-utils';
import { Drops, generateDrop } from '@minddrop/drops';
import { TextDropComponent } from './TextDropComponent';
import { core, setup } from '../test-utils';
import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { CreateTextDropData } from '../types';

const { richTextDocument1, headingElement1PlainText } = RICH_TEXT_TEST_DATA;

const drop = generateDrop<CreateTextDropData>({
  type: 'text',
  richTextDocument: richTextDocument1.id,
});

describe('<TextDrop />', () => {
  beforeEach(() => {
    setup();
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
    getByText(headingElement1PlainText);
  });
});
