import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  screen,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { TopicBreadcrumb } from './TopicBreadcrumb';
import { setup, cleanup } from '../../tests/setup-tests';
import { tSailing, tUntitled } from '../../tests/topics.data';
import { App } from '@minddrop/app';
import { i18n } from '@minddrop/i18n';

describe('<TopicBreadcrumb />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the topic name', () => {
    render(<TopicBreadcrumb topicId={tSailing.id} />);

    screen.getByText(tSailing.title);
  });

  it('opens the topic view when onClick="open-view"', () => {
    render(<TopicBreadcrumb topicId={tSailing.id} onClick="open-view" />);

    act(() => {
      fireEvent.click(screen.getByText(tSailing.title));
    });

    expect(App.getCurrentView().instance.id).toEqual(tSailing.views[0]);
  });

  it('opens the rename popover when onClick="rename"', () => {
    render(<TopicBreadcrumb topicId={tSailing.id} onClick="open-rename" />);

    act(() => {
      fireEvent.click(screen.getByText(tSailing.title));
    });

    const label = i18n.t('topicName');
    screen.getByLabelText(label);
  });

  it('renders Untitled for topics with no title', () => {
    render(
      <div>
        <TopicBreadcrumb topicId={tUntitled.id} onClick="open-rename" />
        <TopicBreadcrumb topicId={tUntitled.id} onClick="open-view" />
      </div>,
    );

    const label = i18n.t('untitled');
    expect(screen.getAllByText(label).length).toBe(2);
  });
});
