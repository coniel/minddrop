import React from 'react';
import { render, screen, act, fireEvent } from '@minddrop/test-utils';
import { PersistentStore } from '@minddrop/persistent-store';
import { AddTopicButton } from './AddTopicButton';
import { setup, cleanup, core } from '../test-utils';
import { Topics } from '@minddrop/topics';
import { App, TopicViewInstance } from '@minddrop/app';

describe('<AddTopicButton />', () => {
  beforeEach(() => {
    setup();
    act(() => {
      Topics.clear(core);
    });
  });

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
      expect(
        PersistentStore.getGlobalValue(core, 'topics', []).includes(
          payload.data.id,
        ),
      ).toBe(true);
      done();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });
  });

  it('opens the topic', (done) => {
    render(<AddTopicButton />);

    core.addEventListener('topics:create', (payload) => {
      expect(App.getCurrentView<TopicViewInstance>().instance.topicId).toBe(
        payload.data.id,
      );
      done();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });
  });
});
