import React from 'react';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { Topics, TopicViewInstanceData } from '@minddrop/topics';
import { ViewInstances } from '@minddrop/views';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { cleanup, core, setup, topicViewColumnsInstance } from '../test-utils';
import { TopicViewColumns } from './TopicViewColumns';
import { TopicViewColumnsData } from '../types';

const { drop1 } = DROPS_TEST_DATA;

const getViewInstance = () =>
  ViewInstances.get<TopicViewInstanceData<TopicViewColumnsData>>(
    topicViewColumnsInstance.id,
  );

describe('<TopicViewColumns />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  const init = () => {
    const utils = render(
      <TopicViewColumns instanceId={topicViewColumnsInstance.id} />,
    );

    return utils;
  };

  it('renders drops', () => {
    const { getByText } = init();

    getByText(drop1.text);
  });

  it('inserts drop at end of column when data is dropped there', (done) => {
    const { getByTestId } = init();

    Drops.addEventListener(core, 'drops:drop:create', ({ data: drop }) => {
      // Get the updated view instance
      const viewInstance = getViewInstance();
      // Get the updated topic
      const topic = Topics.get(viewInstance.topic);

      // Should add drop to the end of 1
      const { items } = viewInstance.columns[1];
      expect(items.slice(-1)[0].id).toBe(drop.id);
      // Should add drop to the topic
      expect(topic.drops.includes(drop.id)).toBeTruthy();
      done();
    });

    act(() => {
      // Drop plain text data at the end of 1
      fireEvent.drop(getByTestId('column-end-1'), {
        dataTransfer: {
          types: ['text/plain'],
          getData: () => 'Hello world',
        },
      });
    });
  });

  it('inserts drops at a specified index when data is dropped on a spacer', (done) => {
    const { getByTestId } = init();

    Drops.addEventListener(core, 'drops:drop:create', ({ data: drop }) => {
      // Get updated view instance
      const viewInstance = getViewInstance();
      // Get updated topics
      const topic = Topics.get(viewInstance.topic);

      // Should add drop to index 1 of 1
      const { items } = viewInstance.columns[1];
      expect(items[1].id).toBe(drop.id);
      // Should add drop to topic
      expect(topic.drops.includes(drop.id)).toBeTruthy();
      done();
    });

    act(() => {
      // Insert plain text data at column 1, index 1
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
    // Move drop from 1, index 1
    const movedDropId = topicViewColumnsInstance.columns[1].items[1].id;

    act(() => {
      // Insert to column 0, index 0
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

    // Get the updated view instance
    const viewInstance = getViewInstance();

    // Should add drop to column 0, index 0
    expect(viewInstance.columns[0].items[0].id).toBe(movedDropId);
    // Should remove drop from 1, index 1
    const movedDrop = Drops.get(movedDropId);
    expect(viewInstance.columns[1].items[1]).not.toEqual(movedDrop);
  });

  describe('vertical drop zone', () => {
    it('inserts drops into a new column at the specified index', (done) => {
      const { getByTestId } = init();

      Drops.addEventListener(core, 'drops:drop:create', ({ data: drop }) => {
        // Get the updated view instance
        const viewInstance = getViewInstance();
        // Get the updated topic
        const topic = Topics.get(viewInstance.topic);

        // Should have an extra column
        expect(viewInstance.columns.length).toBe(
          topicViewColumnsInstance.columns.length + 1,
        );
        //
        expect(viewInstance.columns[1].items[0].id).toBe(drop.id);
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
      const movedDropId = topicViewColumnsInstance.columns[2].items[0].id;

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

      const viewInstance = ViewInstances.get<
        TopicViewInstanceData<TopicViewColumnsData>
      >(topicViewColumnsInstance.id);

      expect(viewInstance.columns[0].items[0].id).toBe(movedDropId);
    });
  });
});
