/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { RenameTopicPopover } from './RenameTopicPopover';
import { core, cleanup } from '../../tests/setup-tests';
import { Topic, Topics } from '@minddrop/topics';
import { Popover, PopoverTrigger } from '@minddrop/ui';

describe('<RenameTopicPopover />', () => {
  let topic: Topic;
  const onClose = jest.fn();

  afterEach(() => {
    cleanupRender();
    cleanup();
    onClose.mockClear();
  });

  beforeEach(() => {
    topic = Topics.create(core, { title: 'My topic' });
  });

  const setup = () => {
    const utils = render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <button type="button">trigger</button>
        </PopoverTrigger>
        <RenameTopicPopover onClose={onClose} topic={topic} />
        <button type="button">blur trigger</button>
      </Popover>,
    );
    const input = utils.getByLabelText('Topic name');
    const blurTrigger = utils.getByText('blur trigger');

    return {
      input,
      blurTrigger,
      ...utils,
    };
  };

  it('renames the topic on submit', () => {
    const { input, getByTestId } = setup();

    fireEvent.change(input, { target: { value: 'Edited topic name' } });
    act(() => {
      fireEvent.submit(getByTestId('form'));
    });

    const t = Topics.get(topic.id);
    expect(t.title).toBe('Edited topic name');
    expect(onClose).toHaveBeenCalled();
  });

  it('cancels rename on escape', () => {
    const { input } = setup();

    fireEvent.change(input, { target: { value: 'Edited topic name' } });
    act(() => {
      fireEvent.keyDown(input, {
        key: 'Escape',
        code: 'Escape',
        charCode: 27,
      });
    });

    expect(Topics.get(topic.id).title).toBe('My topic');
    expect(onClose).toHaveBeenCalled();
  });
});
