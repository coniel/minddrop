import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  act,
  fireEvent,
} from '@minddrop/test-utils';
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

describe('<TopicView />', () => {
  beforeEach(() => {
    setupApp();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
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
      App.selectDrops(core, [drop1.id]);
    });

    act(() => {
      // Fire Delete keydown
      fireEvent.keyDown(document, { key: 'Delete' });
    });

    // Get the drop
    const drop = Drops.get(drop1.id);
    // Should be deleted
    expect(drop.deleted).toBe(true);
    // Should unselect drops
    expect(App.getSelectedDrops()).toEqual({});
  });

  it('deletes selected drops on Backspace keydown', () => {
    setup();

    act(() => {
      // Select a drop
      App.selectDrops(core, [drop1.id]);
    });

    act(() => {
      // Fire Delete keydown
      fireEvent.keyDown(document, { key: 'Backspace' });
    });

    // Get the drop
    const drop = Drops.get(drop1.id);
    // Should be deleted
    expect(drop.deleted).toBe(true);
    // Should unselect drops
    expect(App.getSelectedDrops()).toEqual({});
  });

  it('archives selected drops on Shift+Delete keydown', () => {
    setup();

    act(() => {
      // Select a drop
      App.selectDrops(core, [drop1.id]);
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
    // Should unselect drops
    expect(App.getSelectedDrops()).toEqual({});
  });

  it('archives selected drops on Shift+Backspace keydown', () => {
    setup();

    act(() => {
      // Select a drop
      App.selectDrops(core, [drop1.id]);
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
    // Should unselect drops
    expect(App.getSelectedDrops()).toEqual({});
  });

  it('adds selected drops and action to clipboardData on copy', () => {
    setup();

    const clipboardData = {
      types: [],
      data: {},
      getData: (key) => clipboardData.data[key],
    };
    const event = {
      clipboardData: {
        clearData: jest.fn(),
        setData: (key, value) => {
          clipboardData.data[key] = value;
          clipboardData.types.push(key);
        },
      },
    };

    act(() => {
      // Select a drop
      App.selectDrops(core, [drop1.id]);
    });

    act(() => {
      // Fire copy event
      fireEvent.copy(document, event);
    });

    const dataInsert = createDataInsertFromDataTransfer(
      clipboardData as unknown as DataTransfer,
    );

    // Should set action
    expect(dataInsert.action).toEqual('copy');
    // Should set drops
    expect(dataInsert.drops).toEqual([drop1.id]);
  });

  it('adds selected drops and action to clipboardData and removes drops from topic on cut', () => {
    setup();

    const event = {
      clipboardData: {
        types: [],
        data: {},
        getData: (key) => event.clipboardData.data[key],
        clearData: jest.fn(),
        setData: (key, value) => {
          event.clipboardData.data[key] = value;
          event.clipboardData.types.push(key);
        },
      },
    };

    act(() => {
      // Select a drop
      App.selectDrops(core, [drop1.id]);
    });

    act(() => {
      // Fire cut event
      fireEvent.cut(document, event);
    });

    const dataInsert = createDataInsertFromDataTransfer(
      event.clipboardData as unknown as DataTransfer,
    );

    // Should set action
    expect(dataInsert.action).toEqual('cut');
    // Should set drops
    expect(dataInsert.drops).toEqual([drop1.id]);
    // Should remove drops from topic
    const topic = Topics.get(tSixDropsView.topic);
    expect(topic.drops.includes(drop1.id)).toBe(false);
  });

  it('inserts data on paste', () => {
    jest.spyOn(App, 'insertDataIntoTopic');
    setup();

    const clipboardData = {
      types: [],
      data: {},
      getData: (key) => clipboardData.data[key],
    };
    const event = {
      target: {
        tagName: 'BODY',
      },
      clipboardData: {
        types: [],
        data: {},
        getData: (key) => event.clipboardData.data[key],
        clearData: jest.fn(),
        setData: (key, value) => {
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
      // Fire a paste event using the clipboard event
      fireEvent.paste(document, event);
    });

    // Should insert data into topic
    expect(App.insertDataIntoTopic).toHaveBeenCalled();
    // @ts-ignore
    const params = App.insertDataIntoTopic.mock.calls[0];
    expect(params[1]).toBe(tSixDropsView.topic);
    expect(params[2].drops).toEqual([drop1.id]);
  });

  it('ignores data pasted into INPUT and SPAN', () => {
    jest.spyOn(App, 'insertDataIntoTopic');
    setup();

    const clipboardData = {
      types: [],
      data: {},
      getData: (key) => clipboardData.data[key],
    };
    const event = {
      target: {
        tagName: 'INPUT',
      },
      clipboardData: {
        types: [],
        data: {},
        getData: (key) => event.clipboardData.data[key],
        clearData: jest.fn(),
        setData: (key, value) => {
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
      App.selectDrops(core, [drop1.id]);
    });

    act(() => {
      // Fire metaKey+D keydown
      fireEvent.keyDown(document, { key: 'D', metaKey: true });
    });

    act(() => {
      // Select another drop
      App.clearSelectedDrops(core);
      App.selectDrops(core, [drop2.id]);
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
    let selected = Object.keys(App.getSelectedDrops());

    // All of the topic's drops should be selected
    expect(isEqual(tSixDrops.drops, selected)).toBeTruthy();

    act(() => {
      // Clear selected drops
      App.clearSelectedDrops(core);
    });

    act(() => {
      // Fire metaKey+a keydown
      fireEvent.keyDown(document, { key: 'a', metaKey: true });
    });

    // Get selected drop IDs
    selected = Object.keys(App.getSelectedDrops());

    // All of the topic's drops should be selected
    expect(isEqual(tSixDrops.drops, selected)).toBeTruthy();
  });
});
