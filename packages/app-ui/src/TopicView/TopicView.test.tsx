import React from 'react';
import { render, cleanup as cleanupRender } from '@minddrop/test-utils';
import { setup as setupApp, cleanup } from '../test-utils';
import { TopicView } from './TopicView';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { tCoastalNavigationView } = TOPICS_TEST_DATA;

describe('<TopicView />', () => {
  beforeEach(() => {
    setupApp();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const setup = () => {
    const utils = render(
      <TopicView {...tCoastalNavigationView}>
        <div>children</div>
      </TopicView>,
    );

    return { ...utils };
  };

  it('renders children', () => {
    const { getByText } = setup();

    getByText('children');
  });
});
