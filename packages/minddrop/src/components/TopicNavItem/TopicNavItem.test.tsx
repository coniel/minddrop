import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { TopicNavItem } from './TopicNavItem';
import {
  tSailing,
  tNavigation,
  tBoats,
  tAnchoring,
} from '../../tests/topics.data';
import '../../tests/initialize-app';

describe('<TopicNavItem />', () => {
  afterEach(cleanup);

  it('renders the title', () => {
    render(<TopicNavItem id={tSailing.id} />);

    screen.getByText(tSailing.title);
  });

  it('renders subtopics', () => {
    render(<TopicNavItem defaultExpanded id={tSailing.id} />);

    screen.getByText(tNavigation.title);
    screen.getByText(tBoats.title);
    screen.getByText(tAnchoring.title);
  });
});
