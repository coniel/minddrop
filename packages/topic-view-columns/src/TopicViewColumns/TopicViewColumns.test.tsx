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

      expect(viewInstance.columns[1][1].id).toBe(drop.id);
      expect(topic.drops.includes(drop.id)).toBeTruthy();
      done();
    });

    act(() => {
      // Insert at column 2 between the first two drops
      fireEvent.drop(getByTestId('spacer-1:1'), {
        dataTransfer: {
          types: ['text/plain'],
          getData: () => 'Hello world',
        },
      });
    });
  });

  it("moves drops when data insert action === 'sort'", () => {
    const { getByTestId } = init();
    const movedDropId = topicViewColumnsInstance.columns[1][1].id;

    act(() => {
      // Insert from col 1:1 to col 0:0 (between the first two drops)
      fireEvent.drop(getByTestId('spacer-0:0'), {
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

    expect(viewInstance.columns[0][0].id).toBe(movedDropId);
    expect(viewInstance.columns[1][1]).not.toBeDefined();
  });

  describe('vertical drop zone', () => {
    it('inserts drops into a new column at the specified index', (done) => {
      const { getByTestId } = init();

      Drops.addEventListener(core, 'drops:create', ({ data: drop }) => {
        const viewInstance = Views.getInstance<TopicViewColumnsInstance>(
          topicViewColumnsInstance.id,
        );
        const topic = Topics.get(viewInstance.topic);

        expect(viewInstance.columns.length).toBe(
          topicViewColumnsInstance.columns.length + 1,
        );
        expect(viewInstance.columns[1][0].id).toBe(drop.id);
        expect(topic.drops.includes(drop.id)).toBeTruthy();
        done();
      });

      act(() => {
        // Insert between column 0 and 1
        fireEvent.drop(getByTestId('vertical-drop-zone-1'), {
          dataTransfer: {
            types: ['text/plain'],
            getData: () => 'Hello world',
          },
        });
      });
    });

    it("moves drops into new column when data insert action === 'sort'", () => {
      const { getByTestId } = init();
      const movedDropId = topicViewColumnsInstance.columns[2][0].id;

      act(() => {
        // Insert from col 2:0 to new col 0
        fireEvent.drop(getByTestId('vertical-drop-zone-0'), {
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

      expect(viewInstance.columns[0][0].id).toBe(movedDropId);
    });
  });
});
