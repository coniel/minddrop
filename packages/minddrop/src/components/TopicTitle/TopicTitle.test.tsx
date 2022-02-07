import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { setup as setupApp, cleanup } from '../../tests/setup-tests';
import { tNavigation, tSailing, tUntitled } from '../../tests/topics.data';
import { TopicTitle } from './TopicTitle';
import { Topics } from '@minddrop/topics';

describe('<TopicTitle />', () => {
  beforeEach(() => {
    setupApp();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const setup = () => {
    const utils = render(<TopicTitle topic={tSailing} />);
    const label = i18n.t('topicName');
    const input = utils.getByLabelText(label);

    return { ...utils, input };
  };

  it('sets the topic title as the value', () => {
    const { input } = setup();

    expect(input).toHaveValue(tSailing.title);
  });

  it('updates the input value on change', () => {
    const { input } = setup();

    act(() => {
      fireEvent.change(input, { target: { value: 'New value' } });
    });

    expect(input).toHaveValue('New value');
  });

  it('updates the value when the topic chnages', () => {
    const { input, rerender } = setup();

    rerender(<TopicTitle topic={tNavigation} />);

    expect(input).toHaveValue(tNavigation.title);
  });

  it('does not update the value from topic prop when focused', () => {
    const { input, rerender } = setup();

    act(() => {
      fireEvent.focus(input);
    });

    rerender(<TopicTitle topic={{ ...tSailing, title: 'Updated title' }} />);

    expect(input).toHaveValue(tSailing.title);
  });

  it('updates the topic title on change using debounce', () => {
    const { input } = setup();
    jest.useFakeTimers();

    act(() => {
      fireEvent.change(input, { target: { value: 'New value' } });
      // Should not change immediately
      expect(Topics.get(tSailing.id).title).toEqual(tSailing.title);
      jest.advanceTimersByTime(1000);
      expect(Topics.get(tSailing.id).title).toEqual('New value');
    });
  });

  it('cancels topic update debounce when topic changes', () => {
    const { input, rerender } = setup();
    jest.useFakeTimers();

    act(() => {
      fireEvent.change(input, { target: { value: 'New value' } });
    });

    rerender(<TopicTitle topic={tNavigation} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(Topics.get(tSailing.id).title).toEqual(tSailing.title);
    expect(Topics.get(tNavigation.id).title).toEqual(tNavigation.title);
  });

  it('should auto-focus if empty', () => {
    const { input, rerender } = setup();
    jest.useFakeTimers();

    expect(input).not.toHaveFocus();

    rerender(<TopicTitle topic={tUntitled} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(input).toHaveFocus();
  });
});
