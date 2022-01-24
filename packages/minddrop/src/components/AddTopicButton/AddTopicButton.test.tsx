import React from 'react';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { PersistentStore } from '@minddrop/persistent-store';
import { AddTopicButton } from './AddTopicButton';
import { Topics } from '@minddrop/topics';
import { initializeCore } from '@minddrop/core';

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('<AddTopicButton />', () => {
  afterEach(() => {
    cleanup();
    Topics.clear(core);
    PersistentStore.clearGlobalCache();
  });

  it('creates a topic', () => {
    render(<AddTopicButton core={core} />);

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });

    expect(Object.keys(Topics.getAll()).length).toBe(1);
  });

  it('adds the topic to the root level', () => {
    render(<AddTopicButton core={core} />);

    act(() => {
      fireEvent.click(screen.getByTestId('button'));
    });

    expect(PersistentStore.getGlobalValue(core, 'topics', []).length).toBe(1);
  });
});
