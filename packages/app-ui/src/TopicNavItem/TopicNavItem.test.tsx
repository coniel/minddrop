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
import { setup, cleanup, core } from '../test-utils';
import { i18n } from '@minddrop/i18n';
import { App } from '@minddrop/app';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';

const {
  tSailing,
  tNavigation,
  tBoats,
  tAnchoring,
  tCoastalNavigationView,
  tCoastalNavigation,
  trail,
} = TOPICS_TEST_DATA;

describe('<TopicNavItem />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the title', () => {
    render(<TopicNavItem trail={trail} />);

    screen.getByText(tCoastalNavigation.title);
  });

  it('renders subtopics when expanded', () => {
    render(<TopicNavItem trail={[tSailing.id]} />);

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
    render(<TopicNavItem trail={trail} />);

    act(() => {
      fireEvent.click(screen.getByText(tCoastalNavigation.title));
    });

    const { view, instance } = App.getCurrentView();
    expect(view.id).toBe('minddrop:topic-view:columns');
    expect(instance.id).toBe(tCoastalNavigationView.id);
  });

  it('expands subtopics when adding a subtopic', async () => {
    render(<TopicNavItem trail={[tSailing.id]} />);

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
    render(<TopicNavItem trail={trail} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tCoastalNavigation.title));

    // Wait for menu to open
    const addSubtopic = i18n.t('addSubtopic');
    await waitFor(() => screen.getAllByText(addSubtopic));
    // Click 'Add subtopic'
    act(() => {
      fireEvent.click(screen.getByText(addSubtopic));
    });

    const { view, instance } = App.getCurrentView();
    const subtopicId = Topics.get(tCoastalNavigation.id).subtopics.slice(-1)[0];
    const subtopic = Topics.get(subtopicId);
    expect(view.id).toBe('minddrop:topic-view:columns');
    expect(instance.id).toBe(subtopic.views[0]);
  });

  it('opens the rename popover when clicking on Rename menu option', async () => {
    render(<TopicNavItem trail={trail} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tCoastalNavigation.title));

    // Click "Rename" menu item
    const rename = i18n.t('rename');
    await waitFor(() => screen.getAllByText(rename));
    fireEvent.click(screen.getByText(rename));

    // Check for rename popover input
    const input = i18n.t('topicName');
    screen.getByLabelText(input);
  });

  it('has active state if releveant topic view is open', () => {
    App.openTopicView(core, [tSailing.id]);

    render(<TopicNavItem trail={[tSailing.id]} />);

    screen.getByRole('button', { current: true });
  });
});
