import React from 'react';
import { render, cleanup as cleanupRender, screen } from '@minddrop/test-utils';
import { TopicBreadcrumbs } from './TopicBreadcrumbs';
import { cleanup, setup } from '../test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { tCoastalNavigation, tNavigation, trail, tSailing } = TOPICS_TEST_DATA;

describe('<TopicBreadcrumbs />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the breadcrumb trail', () => {
    render(<TopicBreadcrumbs trail={trail} />);

    screen.getByText(tSailing.title);
    screen.getByText(tNavigation.title);
    screen.getByText(tCoastalNavigation.title);
  });
});
