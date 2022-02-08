import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  screen,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { TopicBreadcrumb } from './TopicBreadcrumb';
import { setup, cleanup } from '../tests';
import {
  tCoastalNavigation,
  tNavigation,
  tSailing,
  tUntitled,
} from '../tests/topics.data';
import { App } from '@minddrop/app';
import { i18n } from '@minddrop/i18n';

const trail = [tSailing.id, tNavigation.id, tCoastalNavigation.id];

describe('<TopicBreadcrumb />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the topic name', () => {
    render(<TopicBreadcrumb trail={trail} />);

    screen.getByText(tCoastalNavigation.title);
  });

  it('opens the topic view when onClick="open-view"', () => {
    render(<TopicBreadcrumb trail={trail} onClick="open-view" />);

    act(() => {
      fireEvent.click(screen.getByText(tCoastalNavigation.title));
    });

    expect(App.getCurrentView().instance.id).toEqual(
      tCoastalNavigation.views[0],
    );
  });

  it('opens the rename popover when onClick="rename"', () => {
    render(<TopicBreadcrumb trail={trail} onClick="open-rename" />);

    act(() => {
      fireEvent.click(screen.getByText(tCoastalNavigation.title));
    });

    const label = i18n.t('topicName');
    screen.getByLabelText(label);
  });

  it('renders Untitled for topics with no title', () => {
    render(
      <div>
        <TopicBreadcrumb trail={[tUntitled.id]} onClick="open-rename" />
        <TopicBreadcrumb trail={[tUntitled.id]} onClick="open-view" />
      </div>,
    );

    const label = i18n.t('untitled');
    expect(screen.getAllByText(label).length).toBe(2);
  });
});
