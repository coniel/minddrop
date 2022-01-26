/* eslint-disable class-methods-use-this */
import React from 'react';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { core } from '../../tests/initialize-app';
import { DropdownMenuContent, DropdownMenu } from '@minddrop/ui';
import { Topic, Topics } from '@minddrop/topics';
import { generateTopicMenu } from './generateTopicMenu';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

describe('<TopicNavItem />', () => {
  let Menu;
  let topic: Topic;

  afterEach(() => {
    cleanup();
    Topics.clear(core);
  });

  beforeEach(() => {
    topic = Topics.create(core);
    Menu = () => (
      <DropdownMenu defaultOpen>
        <DropdownMenuContent content={generateTopicMenu(core, topic)} />
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
    expect(updatedTopic.subtopics.length).toBe(1);
    expect(Topics.get(updatedTopic.subtopics[0])).toBeDefined();
  });

  it('allows deleting topics', () => {
    render(<Menu />);
    const label = i18n.t('delete');

    act(() => {
      fireEvent.click(screen.getByText(label));
    });

    expect(Topics.get(topic.id).deleted).toBe(true);
  });
});
