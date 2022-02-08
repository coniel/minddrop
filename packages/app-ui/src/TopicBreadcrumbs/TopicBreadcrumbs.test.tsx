import React from 'react';
import { render, cleanup as cleanupRender, screen } from '@minddrop/test-utils';
import { TopicBreadcrumbs } from './TopicBreadcrumbs';
import {
  cleanup,
  setup,
  tCoastalNavigation,
  tNavigation,
  topicTrail,
  tSailing,
} from '../tests';

describe('<TopicBreadcrumbs />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the breadcrumb trail', () => {
    render(<TopicBreadcrumbs trail={topicTrail} />);

    screen.getByText(tSailing.title);
    screen.getByText(tNavigation.title);
    screen.getByText(tCoastalNavigation.title);
  });
});
