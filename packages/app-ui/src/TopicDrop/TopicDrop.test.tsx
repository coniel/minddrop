import React from 'react';
import {
  render,
  act,
  fireEvent,
  cleanup as cleanupRender,
} from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { TOPICS_TEST_DATA, TopicViewInstanceData } from '@minddrop/topics';
import { cleanup, setup } from '../test-utils';
import { TopicDrop } from './TopicDrop';
import { App } from '@minddrop/app';

const { tSailing, tNavigation, tCoastalNavigation } = TOPICS_TEST_DATA;

const trail = [tSailing.id, tNavigation.id, tCoastalNavigation.id];

describe('<TopicDrop />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = () => {
    const utils = render(<TopicDrop trail={trail} />);

    return utils;
  };

  it('renders the topic title', () => {
    const { getByText } = init();

    // Should render the topic title
    getByText(tCoastalNavigation.title);
  });

  it('opens the topic view when clicked', () => {
    const { getByText } = init();

    act(() => {
      // Click the topic drop
      fireEvent.click(getByText(tCoastalNavigation.title));
    });

    // Get the current view
    const { view, instance } = App.getCurrentView<TopicViewInstanceData>();

    // Shold open the topic view
    expect(view.id).toBe('minddrop:topic-view:columns');
    expect(instance.topic).toBe(tCoastalNavigation.id);
  });

  it('opens the rename popover when clicking on Rename menu option', async () => {
    const { getByText, getByLabelText } = render(<TopicDrop trail={trail} />);

    act(() => {
      // Open context menu
      fireEvent.contextMenu(getByText(tCoastalNavigation.title));
    });

    act(() => {
      // Click "Rename" menu item
      const rename = i18n.t('rename');
      fireEvent.click(getByText(rename));
    });

    // Check for rename popover input
    const input = i18n.t('topicName');
    getByLabelText(input);
  });
});
