/* eslint-disable class-methods-use-this */
import React from 'react';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { core } from '../../tests/initialize-app';
import { DropdownMenuContent, DropdownMenu } from '@minddrop/ui';
import { Topic, Topics } from '@minddrop/topics';
import { generateTopicMenu, TopicMenuOptions } from './generateTopicMenu';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

const options: TopicMenuOptions = {
  onAddSubtopic: jest.fn(),
  onDelete: jest.fn(),
  onRename: jest.fn(),
};

describe('generateTopicMenu', () => {
  let Menu;
  let topic: Topic;

  afterEach(() => {
    cleanup();
    Topics.clear(core);
    Object.values(options).forEach((mock) => {
      mock.mockClear();
    });
  });

  beforeEach(() => {
    topic = Topics.create(core);
    Menu = () => (
      <DropdownMenu defaultOpen>
        <DropdownMenuContent
          content={generateTopicMenu(core, topic, options)}
        />
      </DropdownMenu>
    );
  });

  beforeAll(() => {
    // @ts-ignore
    window.DOMRect = { fromRect: () => ({}) };
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  });

  it('allows creating subtopics', () => {
    render(<Menu />);
    const label = i18n.t('addSubtopic');

    act(() => {
      fireEvent.click(screen.getByText(label));
    });

    const updatedTopic = Topics.get(topic.id);
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

    const deletedTopic = Topics.get(topic.id);

    // Deletes to the topic
    expect(deletedTopic.deleted).toBe(true);
    // Calls the onDelete callback
    expect(options.onDelete).toHaveBeenCalledWith(deletedTopic);
  });

  it('calls options.onRename when clicking rename option', () => {
    render(<Menu />);
    const label = i18n.t('rename');

    act(() => {
      fireEvent.click(screen.getByText(label));
    });

    expect(options.onRename).toHaveBeenCalledWith(topic);
  });
});