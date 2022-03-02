import React from 'react';
import { render, screen, act, fireEvent } from '@minddrop/test-utils';
import { AddTopicButton } from './AddTopicButton';
import { setup, cleanup, core } from '../test-utils';
import { TopicViewInstance } from '@minddrop/topics';
import { App } from '@minddrop/app';

describe('<AddTopicButton />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a topic', (done) => {
    render(<AddTopicButton />);

    core.addEventListener('topics:create', () => {
      done();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });
  });

  it('adds the topic to the root level', (done) => {
    render(<AddTopicButton />);

    core.addEventListener('topics:create', (payload) => {
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

    core.addEventListener('topics:create', (payload) => {
      expect(App.getCurrentView<TopicViewInstance>().instance.topic).toBe(
        payload.data.id,
      );
      done();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });
  });
});
