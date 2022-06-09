import React from 'react';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { cleanup, render } from '@minddrop/test-utils';
import { Resources } from '@minddrop/resources';
import { Drops } from '@minddrop/drops';
import { TextDropComponent } from './TextDropComponent';
import { core, setup } from '../test-utils';
import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { CreateTextDropData } from '../types';

const { richTextDocument1, headingElement1PlainText } = RICH_TEXT_TEST_DATA;

const drop = Resources.generateDocument<CreateTextDropData>('drops:drop', {
  type: 'text',
  richTextDocument: richTextDocument1.id,
});

describe('<TextDrop />', () => {
  beforeEach(() => {
    setup();

    // Load a test drop
    Drops.store.load(core, [drop]);
  });

  afterEach(() => {
    cleanup();
    cleanupRender();

    // Clear the drops store
    Drops.store.clear();
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
