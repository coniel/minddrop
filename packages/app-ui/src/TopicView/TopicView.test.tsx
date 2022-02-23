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
  setDataTransferData,
} from '@minddrop/utils';

const { tSixDropsView } = TOPICS_TEST_DATA;
const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

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
      <TopicView {...tSixDropsView}>
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
      App.selectDrops(core, [textDrop1.id]);
    });

    act(() => {
      // Fire Delete keydown
      fireEvent.keyDown(document, { key: 'Delete' });
    });

    // Get the drop
    const drop = Drops.get(textDrop1.id);
    // Should be deleted
    expect(drop.deleted).toBe(true);
  });

  it('deletes selected drops on Backspace keydown', () => {
    setup();

    act(() => {
      // Select a drop
      App.selectDrops(core, [textDrop1.id]);
    });

    act(() => {
      // Fire Delete keydown
      fireEvent.keyDown(document, { key: 'Backspace' });
    });

    // Get the drop
    const drop = Drops.get(textDrop1.id);
    // Should be deleted
    expect(drop.deleted).toBe(true);
  });

  it('archives selected drops on Shift+Delete keydown', () => {
    setup();

    act(() => {
      // Select a drop
      App.selectDrops(core, [textDrop1.id]);
    });

    act(() => {
      // Fire Shift+Delete keydown
      fireEvent.keyDown(document, { key: 'Delete', shiftKey: true });
    });

    // Get the drop
    const drop = Drops.get(textDrop1.id);
    // Should be archived
    expect(drop.archived).toBe(true);
    // Should not be deleted
    expect(drop.deleted).toBeFalsy();
  });

  it('archives selected drops on Shift+Backspace keydown', () => {
    setup();

    act(() => {
      // Select a drop
      App.selectDrops(core, [textDrop1.id]);
    });

    act(() => {
      // Fire Shift+Delete keydown
      fireEvent.keyDown(document, { key: 'Backspace', shiftKey: true });
    });

    // Get the drop
    const drop = Drops.get(textDrop1.id);
    // Should be archived
    expect(drop.archived).toBe(true);
    // Should not be deleted
    expect(drop.deleted).toBeFalsy();
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
      App.selectDrops(core, [textDrop1.id]);
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
    expect(dataInsert.drops).toEqual([textDrop1.id]);
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
      App.selectDrops(core, [textDrop1.id]);
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
    expect(dataInsert.drops).toEqual([textDrop1.id]);
    // Should remove drops from topic
    const topic = Topics.get(tSixDropsView.topic);
    expect(topic.drops.includes(textDrop1.id)).toBe(false);
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
        drops: [textDrop1.id],
      });
      // Fire a paste event using the clipboard event
      fireEvent.paste(document, event);
    });

    // Should insert data into topic
    expect(App.insertDataIntoTopic).toHaveBeenCalled();
    // @ts-ignore
    const params = App.insertDataIntoTopic.mock.calls[0];
    expect(params[1]).toBe(tSixDropsView.topic);
    expect(params[2].drops).toEqual([textDrop1.id]);
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
        drops: [textDrop1.id],
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
      App.selectDrops(core, [textDrop1.id]);
    });

    act(() => {
      // Fire metaKey+D keydown
      fireEvent.keyDown(document, { key: 'D', metaKey: true });
    });

    act(() => {
      // Select another drop
      App.clearSelectedDrops(core);
      App.selectDrops(core, [textDrop2.id]);
    });

    act(() => {
      // Fire metaKey+d keydown
      fireEvent.keyDown(document, { key: 'd', metaKey: true });
    });

    // Topic should have two new drops
    const topic = Topics.get(tSixDropsView.topic);
    expect(topic.drops.length).toEqual(8);
    // Should have duplicated the first drop
    const dropId = topic.drops[6];
    const drop = Drops.get(dropId);
    expect(drop.duplicatedFrom).toBe(textDrop1.id);
    // Should have duplicated the first drop
    const dropId2 = topic.drops[7];
    const drop2 = Drops.get(dropId2);
    expect(drop2.duplicatedFrom).toBe(textDrop2.id);
  });
});
