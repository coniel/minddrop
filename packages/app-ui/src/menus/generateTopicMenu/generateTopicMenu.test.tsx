/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  screen,
  act,
  fireEvent,
  MockDate,
} from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { setup, cleanup, core } from '../../test-utils';
import { DropdownMenuContent, DropdownMenu } from '@minddrop/ui';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { generateTopicMenu, TopicMenuOptions } from './generateTopicMenu';
import { App } from '@minddrop/app';

const { trail, tCoastalNavigation, tNavigation, tSailing } = TOPICS_TEST_DATA;

const options: TopicMenuOptions = {
  onAddSubtopic: jest.fn(),
  onDelete: jest.fn(),
  onArchive: jest.fn(),
  onRename: jest.fn(),
};

describe('generateTopicMenu', () => {
  let Menu;

  beforeAll(() => {
    MockDate.set('01/01/2020');
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    setup();
    Menu = () => (
      <DropdownMenu defaultOpen>
        <DropdownMenuContent
          content={generateTopicMenu(core, trail, options)}
        />
      </DropdownMenu>
    );
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
    Object.values(options).forEach((mock) => {
      mock.mockClear();
    });
  });

  it('allows creating subtopics', () => {
    render(<Menu />);
    const label = i18n.t('addSubtopic');

    act(() => {
      fireEvent.click(screen.getByText(label));
    });

    const updatedTopic = Topics.get(tCoastalNavigation.id);
    const subtopic = Topics.get(updatedTopic.subtopics[0]);
    // Adds subtopic to topic
    expect(updatedTopic.subtopics.length).toBe(1);
    // Creates the subtopic
    expect(subtopic).toBeDefined();
    // Calls onAddSubtopic callback
    expect(options.onAddSubtopic).toHaveBeenCalledWith(updatedTopic, subtopic);
  });

  it('allows deleting topics', () => {
    render(<Menu />);
    const label = i18n.t('delete');

    act(() => {
      fireEvent.click(screen.getByText(label));
    });

    const deletedTopic = Topics.get(tCoastalNavigation.id);

    // Deletes to the topic
    expect(deletedTopic.deleted).toBe(true);
    // Calls the onDelete callback
    expect(options.onDelete).toHaveBeenCalledWith(deletedTopic);
  });

  it('allows archiving subtopics', () => {
    render(<Menu />);

    act(() => {
      // Click on the 'Archive' item
      const label = i18n.t('archive');
      fireEvent.click(screen.getByText(label));
    });

    // Get the parent topic
    const parent = Topics.get(tNavigation.id);

    // It archives the subtopic in the parent
    expect(
      parent.archivedSubtopics.includes(tCoastalNavigation.id),
    ).toBeTruthy();
    // Should call onArchive callback
    expect(options.onArchive).toHaveBeenCalled();
  });

  it('allows archiving root level topics', () => {
    // Render a root topic menu
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent
          content={generateTopicMenu(core, [tSailing.id], options)}
        />
      </DropdownMenu>,
    );

    act(() => {
      // Click on the 'Archive' item
      const label = i18n.t('archive');
      fireEvent.click(screen.getByText(label));
    });

    // Root topic should be archived
    expect(App.getArchivedRootTopics()).toEqual([tSailing]);
    // Should call onArchive callback
    expect(options.onArchive).toHaveBeenCalled();
  });

  it('calls options.onRename when clicking rename option', () => {
    render(<Menu />);
    const label = i18n.t('rename');

    act(() => {
      fireEvent.click(screen.getByText(label));
    });

    expect(options.onRename).toHaveBeenCalledWith(tCoastalNavigation);
  });

  it('does not incldue rename option if options.onRename is not defined', () => {
    const noRenameOptions = { ...options };
    delete noRenameOptions.onRename;

    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent
          content={generateTopicMenu(core, trail, noRenameOptions)}
        />
      </DropdownMenu>,
    );
    const label = i18n.t('rename');

    expect(screen.queryByText(label)).toBeNull();
  });
});
