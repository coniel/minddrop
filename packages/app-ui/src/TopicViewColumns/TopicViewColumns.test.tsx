import React from 'react';
import { render, cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  cleanup,
  htmlDrop1,
  setup,
  textDrop1,
  textDrop2,
  textDrop3,
  tSailingView,
} from '../tests';
import { TopicViewColumns, TopicViewColumnsProps } from './TopicViewColumns';

const viewInstance: TopicViewColumnsProps = {
  ...tSailingView,
  view: 'topics:columns',
  columns: [[textDrop1.id, textDrop2.id], [textDrop3.id], [htmlDrop1.id], []],
};

describe('<TopicViewColumns />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = () => {
    const utils = render(<TopicViewColumns {...viewInstance} />);

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
