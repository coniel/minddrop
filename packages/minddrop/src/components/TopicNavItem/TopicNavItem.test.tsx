import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@minddrop/test-utils';
import { TopicNavItem } from './TopicNavItem';
import {
  tSailing,
  tNavigation,
  tBoats,
  tAnchoring,
  tSailingView,
} from '../../tests/topics.data';
import { setup, cleanup } from '../../tests/setup-tests';
import { i18n } from '@minddrop/i18n';
import { App } from '@minddrop/app';
import { Topics } from '@minddrop/topics';

describe('<TopicNavItem />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the title', () => {
    render(<TopicNavItem id={tSailing.id} />);

    screen.getByText(tSailing.title);
  });

  it('renders subtopics when expanded', () => {
    render(<TopicNavItem id={tSailing.id} />);

    act(() => {
      // Expand topic by clicking on toggle button
      const label = i18n.t('expandSubtopics');
      fireEvent.click(screen.getByLabelText(label));
    });

    screen.getByText(tNavigation.title);
    screen.getByText(tBoats.title);
    screen.getByText(tAnchoring.title);
  });

  it('opens topic view when clicked', () => {
    render(<TopicNavItem id={tSailing.id} />);

    act(() => {
      fireEvent.click(screen.getByText(tSailing.title));
    });

    const { view, instance } = App.getCurrentView();
    expect(view.id).toBe('app:topic');
    expect(instance.id).toBe(tSailingView.id);
  });

  it('expands subtopics when adding a subtopic', async () => {
    render(<TopicNavItem id={tSailing.id} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tSailing.title));

    // Wait for menu to open
    const addSubtopic = i18n.t('addSubtopic');
    await waitFor(() => screen.getAllByText(addSubtopic));
    // Click 'Add subtopic'
    act(() => {
      fireEvent.click(screen.getByText(addSubtopic));
    });

    screen.getByText(tNavigation.title);
  });

  it('opens the new suptopic view when adding a subtopic', async () => {
    render(<TopicNavItem id={tSailing.id} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tSailing.title));

    // Wait for menu to open
    const addSubtopic = i18n.t('addSubtopic');
    await waitFor(() => screen.getAllByText(addSubtopic));
    // Click 'Add subtopic'
    act(() => {
      fireEvent.click(screen.getByText(addSubtopic));
    });

    const { view, instance } = App.getCurrentView();
    const subtopicId = Topics.get(tSailing.id).subtopics.slice(-1)[0];
    const subtopic = Topics.get(subtopicId);
    expect(view.id).toBe('app:topic');
    expect(instance.id).toBe(subtopic.views[0]);
  });

  it('opens the rename popover when clicking on Rename menu option', async () => {
    render(<TopicNavItem id={tSailing.id} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tSailing.title));

    // Click "Rename" menu item
    const rename = i18n.t('rename');
    await waitFor(() => screen.getAllByText(rename));
    fireEvent.click(screen.getByText(rename));

    // Check for rename popover input
    const input = i18n.t('topicName');
    screen.getByLabelText(input);
  });
});
