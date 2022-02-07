import React from 'react';
import { render, cleanup as cleanupRender } from '@minddrop/test-utils';
import { setup as setupApp, cleanup } from '../tests';
import { TopicView } from './TopicView';
import { tCoastalNavigationView } from '../tests/topics.data';

describe('<TopicView />', () => {
  beforeEach(() => {
    setupApp();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const setup = () => {
    const utils = render(<TopicView {...tCoastalNavigationView} />);

    return { ...utils };
  };

  it('renders the className', () => {
    // render(<TopicView className="my-class">content</TopicView>);
    // expect(screen.getByText('content')).toHaveClass('my-class');
  });
});
