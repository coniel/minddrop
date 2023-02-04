import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { Selection } from '@minddrop/selection';
import { setup as setupApp, cleanup, core } from '../test-utils';
import { TopicView } from './TopicView';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { App } from '@minddrop/app';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import {
  createDataInsertFromDataTransfer,
  isEqual,
  setDataTransferData,
} from '@minddrop/utils';

const { tSixDropsView, tSixDrops } = TOPICS_TEST_DATA;
const { drop1, drop2 } = DROPS_TEST_DATA;

const clipboardEvent = {
  clipboardData: {
    clearData: jest.fn(),
    setData: jest.fn(),
  },
  target: {
    tagName: 'BODY',
  },
};

describe('<TopicView />', () => {
  beforeEach(() => {
    setupApp();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
    jest.clearAllMocks();
  });

  const setup = () => {
    const utils = render(
      <TopicView topicId={tSixDrops.id}>
        <div>children</div>
      </TopicView>,
    );

    return { ...utils };
  };

  it('renders children', () => {
    const { getByText } = setup();

    getByText('children');
  });

  it('deletes selected drops on Delete keydown', () => {
    setup();

    act(() => {
      // Select a drop
      Selection.select(core, [Selection.item(drop1)]);
    });

    act(() => {
      // Fire Delete keydown
      fireEvent.keyDown(document, { key: 'Delete' });
    });

    // Get the drop
    const drop = Drops.get(drop1.id);
    // Should be deleted
    expect(drop.deleted).toBe(true);
    // Should clear selection
    expect(Selection.get()).toEqual([]);
  });

  it('deletes selected drops on Backspace keydown', () => {
    setup();

    act(() => {
      // Select a drop
      Selection.select(core, [Selection.item(drop1)]);
    });

    act(() => {
      // Fire Delete keydown
      fireEvent.keyDown(document, { key: 'Backspace' });
    });

    // Get the drop
    const drop = Drops.get(drop1.id);
    // Should be deleted
    expect(drop.deleted).toBe(true);
    // Should clear selection
    expect(Selection.get()).toEqual([]);
  });

  it('archives selected drops on Shift+Delete keydown', () => {
    setup();

    act(() => {
      // Select a drop
      Selection.select(core, [Selection.item(drop1)]);
    });

    act(() => {
      // Fire Shift+Delete keydown
      fireEvent.keyDown(document, { key: 'Delete', shiftKey: true });
    });

    // Get the updated topic
    const topic = Topics.get(tSixDropsView.topic);
    // Get the drop
    const drop = Drops.get(drop1.id);

    // Drop should be archived in the topic
    expect(topic.archivedDrops.includes(drop1.id)).toBe(true);
    // Drop should not be deleted
    expect(drop.deleted).toBeFalsy();
    // Should clear selection
    expect(Selection.get()).toEqual([]);
  });

  it('archives selected drops on Shift+Backspace keydown', () => {
    setup();

    act(() => {
      // Select a drop
      Selection.select(core, [Selection.item(drop1)]);
    });

    act(() => {
      // Fire Shift+Delete keydown
      fireEvent.keyDown(document, { key: 'Backspace', shiftKey: true });
    });

    // Get the updated topic
    const topic = Topics.get(tSixDropsView.topic);
    // Get the drop
    const drop = Drops.get(drop1.id);

    // Drop should be archived in the topic
    expect(topic.archivedDrops.includes(drop1.id)).toBe(true);
    // Drop should not be deleted
    expect(drop.deleted).toBeFalsy();
    // Should clear selection
    expect(Selection.get()).toEqual([]);
  });

  describe('on copy', () => {
    it('sets selection data to clipboard', () => {
      jest.spyOn(Selection, 'copy');
      setup();

      act(() => {
        // Select a drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      act(() => {
        // Fire copy event
        fireEvent.copy(document, clipboardEvent);
      });

      // Should copy selection
      expect(Selection.copy).toHaveBeenCalled();
    });

    it('ignores events with INPUT as target', () => {
      jest.spyOn(Selection, 'copy');
      setup();

      act(() => {
        // Fire copy event with an INPUT at its target
        fireEvent.copy(document, {
          ...clipboardEvent,
          target: { tagName: 'INPUT' },
        });
      });

      // Should not copy selection
      expect(Selection.copy).not.toHaveBeenCalled();
    });

    it('ignores events with SPAN as target', () => {
      jest.spyOn(Selection, 'copy');
      setup();

      act(() => {
        // Fire copy event with an SPAN at its target
        fireEvent.copy(document, {
          ...clipboardEvent,
          target: { tagName: 'SPAN' },
        });
      });

      // Should not copy selection
      expect(Selection.copy).not.toHaveBeenCalled();
    });
  });

  describe('on cut', () => {
    it('sets selection data to clipboard on cut', () => {
      jest.spyOn(Selection, 'cut');

      setup();

      act(() => {
        // Select a drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      act(() => {
        // Fire cut event
        fireEvent.cut(document, clipboardEvent);
      });

      // Should cut selection
      expect(Selection.cut).toHaveBeenCalled();
    });

    it('removes drops from the topic', () => {
      setup();

      act(() => {
        // Select a drop
        Selection.select(core, [Selection.item(drop1)]);
      });

      act(() => {
        // Fire cut event
        fireEvent.cut(document, clipboardEvent);
      });

      // Should remove drops from topic
      const topic = Topics.get(tSixDropsView.topic);
      expect(topic.drops.includes(drop1.id)).toBe(false);
    });

    it('ignores events with INPUT as target', () => {
      jest.spyOn(Selection, 'cut');
      setup();

      act(() => {
        // Fire cut event with an INPUT at its target
        fireEvent.cut(document, {
          ...clipboardEvent,
          target: { tagName: 'INPUT' },
        });
      });

      // Should not cut selection
      expect(Selection.cut).not.toHaveBeenCalled();
    });

    it('ignores events with SPAN as target', () => {
      jest.spyOn(Selection, 'cut');
      setup();

      act(() => {
        // Fire cut event with an SPAN at its target
        fireEvent.cut(document, {
          ...clipboardEvent,
          target: { tagName: 'SPAN' },
        });
      });

      // Should not cut selection
      expect(Selection.cut).not.toHaveBeenCalled();
    });
  });

  it('inserts data on paste', () => {
    jest.spyOn(App, 'insertDataIntoTopic');
    setup();

    const clipboardData = {
      types: [] as string[],
      data: {},
      getData: (key: string) => clipboardData.data[key],
    };
    const event = {
      target: {
        tagName: 'BODY',
      },
      preventDefault: jest.fn(),
      clipboardData: {
        types: [] as string[],
        data: {},
        getData: (key: string) => event.clipboardData.data[key],
        clearData: jest.fn(),
        setData: (key: string, value: string) => {
          event.clipboardData.data[key] = value;
          event.clipboardData.types.push(key);
        },
      },
    };

    act(() => {
      // Select a drop
      Selection.select(core, [Selection.item(drop1)]);
    });

    act(() => {
      // Copy the selection
      Selection.copy(core, event as unknown as ClipboardEvent);
    });

    act(() => {
      // Fire a paste event using the clipboard event
      fireEvent.paste(document, event);
    });

    // Create data insert
    const dataInsert = createDataInsertFromDataTransfer(
      event.clipboardData as unknown as DataTransfer,
    );

    // Should insert data into topic
    expect(App.insertDataIntoTopic).toHaveBeenCalledWith(
      expect.anything(),
      tSixDropsView.topic,
      dataInsert,
    );
  });

  it('ignores data pasted into INPUT and SPAN', () => {
    jest.spyOn(App, 'insertDataIntoTopic');
    setup();

    const clipboardData = {
      types: [],
      data: {},
      getData: (key: string) => clipboardData.data[key],
    };
    const event = {
      target: {
        tagName: 'INPUT',
      },
      clipboardData: {
        types: [] as string[],
        data: {},
        getData: (key: string) => event.clipboardData.data[key],
        clearData: jest.fn(),
        setData: (key: string, value: string) => {
          event.clipboardData.data[key] = value;
          event.clipboardData.types.push(key);
        },
      },
    };

    act(() => {
      // Add the new drop to the clipboard event data
      setDataTransferData(event as unknown as ClipboardEvent, {
        action: 'copy',
        drops: [drop1.id],
      });
      // Fire a paste event into INPUT using the clipboard event
      fireEvent.paste(document, event);
      // Fire a paste event into SPAN using the clipboard event
      event.target.tagName = 'SPAN';
      fireEvent.paste(document, event);
    });

    // Should not insert data into topic
    expect(App.insertDataIntoTopic).not.toHaveBeenCalled();
  });

  it('duplicates selected drops on metaKey+D/d keypress', () => {
    setup();

    act(() => {
      // Select a drop
      Selection.select(core, [Selection.item(drop1)]);
    });

    act(() => {
      // Fire metaKey+D keydown
      fireEvent.keyDown(document, { key: 'D', metaKey: true });
    });

    act(() => {
      // Select another drop
      Selection.select(core, [Selection.item(drop2)]);
    });

    act(() => {
      // Fire metaKey+d keydown
      fireEvent.keyDown(document, { key: 'd', metaKey: true });
    });

    // Topic should have two new drops
    const topic = Topics.get(tSixDropsView.topic);
    expect(topic.drops.length).toEqual(8);
    // Should have duplicated the first drop
    const duplicate1Id = topic.drops[6];
    const duplicate1 = Drops.get(duplicate1Id);
    expect(duplicate1.duplicatedFrom).toBe(drop1.id);
    // Should have duplicated the first drop
    const duplicate2Id = topic.drops[7];
    const duplicate2 = Drops.get(duplicate2Id);
    expect(duplicate2.duplicatedFrom).toBe(drop2.id);
  });

  it('selects all drops on metaKey+A/a keypress', () => {
    setup();

    act(() => {
      // Fire metaKey+A keydown
      fireEvent.keyDown(document, { key: 'A', metaKey: true });
    });

    // Get selected drop IDs
    let selected = Selection.get('drops:drop').map((item) => item.id);

    // All of the topic's drops should be selected
    expect(isEqual(tSixDrops.drops, selected)).toBeTruthy();

    act(() => {
      // Clear selected drops
      Selection.clear(core);
    });

    act(() => {
      // Fire metaKey+a keydown
      fireEvent.keyDown(document, { key: 'a', metaKey: true });
    });

    // Get selected drop IDs
    selected = Selection.get('drops:drop').map((item) => item.id);

    // All of the topic's drops should be selected
    expect(isEqual(tSixDrops.drops, selected)).toBeTruthy();
  });
});
