import React from 'react';
import { render, cleanup as cleanupRender } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { TopicViewColumns } from './TopicViewColumns';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { htmlDrop1, textDrop1, textDrop2, textDrop3 } = DROPS_TEST_DATA;
const { tSailingView } = TOPICS_TEST_DATA;

describe('<TopicViewColumns />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = () => {
    const utils = render(<TopicViewColumns {...tSailingView} />);

    return utils;
  };

  it('renders all drops', () => {
    const { getByText } = init();

    getByText(textDrop1.markdown);
    getByText(textDrop2.markdown);
    getByText(textDrop3.markdown);
    getByText(htmlDrop1.markdown);
  });
});
