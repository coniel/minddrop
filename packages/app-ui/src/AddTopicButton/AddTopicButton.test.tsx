import React from 'react';
import { render, screen, act, fireEvent } from '@minddrop/test-utils';
import { TopicViewInstanceData, Topics } from '@minddrop/topics';
import { AddTopicButton } from './AddTopicButton';
import { setup, cleanup, core } from '../test-utils';
import { App } from '@minddrop/app';

describe('<AddTopicButton />', () => {
  beforeEach(() => {
    act(() => {
      setup();
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('creates a topic', (done) => {
    render(<AddTopicButton />);

    Topics.addEventListener(core, 'topics:topic:create', () => {
      done();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });
  });

  it('adds the topic to the root level', (done) => {
    render(<AddTopicButton />);

    Topics.addEventListener(core, 'topics:topic:create', (payload) => {
      // Get root topics
      const rootTopics = App.getRootTopics();

      // Topic should be included as a root topic
      expect(
        rootTopics.find((topic) => topic.id === payload.data.id),
      ).toBeDefined();
      done();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });
  });

  it('opens the topic', (done) => {
    render(<AddTopicButton />);

    Topics.addEventListener(core, 'topics:topic:create', (payload) => {
      expect(App.getCurrentView<TopicViewInstanceData>().instance.topic).toBe(
        payload.data.id,
      );
      done();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });
  });
});
