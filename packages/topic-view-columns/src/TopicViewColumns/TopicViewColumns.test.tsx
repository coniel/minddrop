import React from 'react';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { cleanup, core, setup, topicViewColumnsInstance } from '../test-utils';
import { TopicViewColumns } from './TopicViewColumns';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { Topics } from '@minddrop/topics';
import { Views } from '@minddrop/views';
import { TopicViewColumnsInstance } from '../types';

const { textDrop1 } = DROPS_TEST_DATA;

describe('<TopicViewColumns />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  const init = () => {
    const viewInstance = Views.getInstance<TopicViewColumnsInstance>(
      topicViewColumnsInstance.id,
    );
    const utils = render(<TopicViewColumns {...viewInstance} />);

    return utils;
  };

  it('renders drops', () => {
    const { getByText } = init();

    getByText(textDrop1.markdown);
  });

  it('inserts drop at end of column when data is dropped there', (done) => {
    Drops.addEventListener(core, 'drops:create', ({ data: drop }) => {
      const viewInstance = Views.getInstance<TopicViewColumnsInstance>(
        topicViewColumnsInstance.id,
      );
      const topic = Topics.get(viewInstance.topic);

      expect(viewInstance.columns[0].slice(-1)[0].id).toBe(drop.id);
      expect(topic.drops.includes(drop.id)).toBeTruthy();
      done();
    });

    const { getByTestId } = init();

    act(() => {
      fireEvent.drop(getByTestId('column-end-0'), {
        dataTransfer: {
          types: ['text/plain'],
          getData: () => 'Hello world',
        },
      });
    });
  });

  it('inserts drops at a specified index when data is dropped on a spacer', (done) => {
    const { getByTestId } = init();

    Drops.addEventListener(core, 'drops:create', ({ data: drop }) => {
      const viewInstance = Views.getInstance<TopicViewColumnsInstance>(
        topicViewColumnsInstance.id,
      );
      const topic = Topics.get(viewInstance.topic);

      expect(viewInstance.columns[2][1].id).toBe(drop.id);
      expect(topic.drops.includes(drop.id)).toBeTruthy();
      done();
    });

    act(() => {
      // Insert at column 2 between the first two drops
      fireEvent.drop(getByTestId('spacer-2:1'), {
        dataTransfer: {
          types: ['text/plain'],
          getData: () => 'Hello world',
        },
      });
    });
  });

  it("moves drops when data insert action === 'sort'", () => {
    const { getByTestId } = init();
    const movedDropId = topicViewColumnsInstance.columns[0][0].id;

    act(() => {
      // Insert from col 0:0 to col 2:1 (between the first two drops)
      fireEvent.drop(getByTestId('spacer-2:1'), {
        dataTransfer: {
          types: ['minddrop/action', 'minddrop/drops'],
          getData: (key) => {
            switch (key) {
              case 'minddrop/action':
                return 'sort';
              case 'minddrop/drops':
                return `["${movedDropId}"]`;
              default:
                return undefined;
            }
          },
        },
      });
    });

    const viewInstance = Views.getInstance<TopicViewColumnsInstance>(
      topicViewColumnsInstance.id,
    );

    expect(viewInstance.columns[2][1].id).toBe(movedDropId);
  });
});
