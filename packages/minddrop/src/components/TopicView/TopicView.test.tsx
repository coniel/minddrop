import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { TopicView } from './TopicView';
import {
  tCoastalNavigationView,
  tNavigationView,
  tSailingView,
} from '../../tests/topics.data';

describe('<TopicView />', () => {
  afterEach(cleanup);

  const setup = () => {
    const utils = render(
      <TopicView
        resource={tCoastalNavigationView.resource}
        breadcrumbs={[tSailingView, tNavigationView, tCoastalNavigationView]}
      />,
    );

    return { ...utils };
  };

  it('renders the className', () => {
    // render(<TopicView className="my-class">content</TopicView>);
    // expect(screen.getByText('content')).toHaveClass('my-class');
  });
});
