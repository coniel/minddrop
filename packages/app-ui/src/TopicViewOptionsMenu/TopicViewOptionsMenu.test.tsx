import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { TopicViewOptionsMenu } from './TopicViewOptionsMenu';
import { cleanup, core, setup } from '../test-utils';
import { i18n } from '@minddrop/i18n';
import { App } from '@minddrop/app';
import {
  CreateTopicEvent,
  CreateTopicEventData,
  DeleteTopicEvent,
  DeleteTopicEventData,
  TOPICS_TEST_DATA,
  TopicViewInstance,
} from '@minddrop/topics';

const { tNavigation, tSailing, tUntitled } = TOPICS_TEST_DATA;

describe('<TopicViewOptionsMenu />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = (topic = tNavigation, trail = [tSailing.id, tNavigation.id]) => {
    const utils = render(
      <TopicViewOptionsMenu defaultOpen topic={topic} trail={trail} />,
    );

    return utils;
  };

  it('opens subtopic when creating one', (done) => {
    const { getByText } = init();
    const label = i18n.t('addSubtopic');

    core.addEventListener<CreateTopicEvent, CreateTopicEventData>(
      'topics:create',
      (payload) => {
        expect(App.getCurrentView<TopicViewInstance>().instance.topic).toEqual(
          payload.data.id,
        );
        done();
      },
    );

    act(() => {
      fireEvent.click(getByText(label));
    });
  });

  it('opens parent topic view when deleted if it has one', (done) => {
    const { getByText } = init();
    const label = i18n.t('delete');

    core.addEventListener<DeleteTopicEvent, DeleteTopicEventData>(
      'topics:delete',
      () => {
        expect(App.getCurrentView<TopicViewInstance>().instance.topic).toEqual(
          tSailing.id,
        );
        done();
      },
    );

    act(() => {
      fireEvent.click(getByText(label));
    });
  });

  it('opens first root level topic when deleted if topic has no parent topic', (done) => {
    const { getByText } = init(tUntitled, [tUntitled.id]);
    const label = i18n.t('delete');

    core.addEventListener<DeleteTopicEvent, DeleteTopicEventData>(
      'topics:delete',
      () => {
        expect(App.getCurrentView<TopicViewInstance>().instance.topic).toEqual(
          tSailing.id,
        ); // tSailing is the first root topic
        done();
      },
    );

    act(() => {
      fireEvent.click(getByText(label));
    });
  });
});
