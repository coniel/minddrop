import { DataInsert, initializeCore } from '@minddrop/core';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { Extensions, EXTENSIONS_TEST_DATA } from '@minddrop/extensions';
import { Selection } from '@minddrop/selection';
import { imageFile, textFile } from '@minddrop/test-utils';
import {
  AddDropsMetadata,
  Topic,
  Topics,
  TOPICS_TEST_DATA,
} from '@minddrop/topics';
export { EXTENSIONS_TEST_DATA } from '@minddrop/extensions';
import { cleanup, core, setup } from '../test-utils';
import { insertDataIntoTopic } from './insertDataIntoTopic';

const { dropConfig, drop1, drop2 } = DROPS_TEST_DATA;
const { tCoastalNavigation, tOffshoreNavigation, tEmpty } = TOPICS_TEST_DATA;
const { topicExtensionConfig } = EXTENSIONS_TEST_DATA;

const imageDropConfig = {
  ...dropConfig,
  files: ['image/jpeg'],
};

const sourceTopic: Topic = {
  ...tEmpty,
  id: 'target',
  drops: [drop1.id, drop2.id],
  subtopics: [tCoastalNavigation.id, tOffshoreNavigation.id],
};

const copyDropsDataInsert: DataInsert = {
  types: ['minddrop-selection/drops:drop'],
  data: {
    'minddrop-selection/drops:drop': JSON.stringify([
      Selection.item(drop1),
      Selection.item(drop2),
    ]),
  },
  action: 'copy',
};

const cutDropsDataInsert: DataInsert = {
  ...copyDropsDataInsert,
  action: 'cut',
};

const moveDropsDataInsert: DataInsert = {
  ...copyDropsDataInsert,
  action: 'move',
};

const addDropsDataInsert: DataInsert = {
  ...copyDropsDataInsert,
  action: 'add',
};

const metadata: AddDropsMetadata = {
  viewInstance: null,
};

describe('insertDataIntoTopic', () => {
  beforeEach(() => {
    setup();
    Topics.store.load(core, [sourceTopic]);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("creates drops using the topic's extensions and adds them to the topic", () => {
    Extensions.store.clear();
    Extensions.configsStore.clear();
    Drops.typeConfigsStore.clear();
    jest.spyOn(Topics, 'addDrops');

    // Set up extension 1, which is enabled on the topic and
    // is tied to the 'text' drop type
    const core1 = initializeCore({ appId: 'app', extensionId: 'extension-1' });
    Extensions.register(core, {
      ...topicExtensionConfig,
      id: 'extension-1',
    });
    Drops.register(core1, dropConfig);
    Extensions.enableOnTopics(core, 'extension-1', [tEmpty.id]);

    // Set up extension 2, which is not enabled on the topic and
    // is tied to the 'image' drop type
    const core2 = initializeCore({ appId: 'app', extensionId: 'extension-2' });
    Extensions.register(core, {
      ...topicExtensionConfig,
      id: 'extension-2',
    });
    Drops.register(core2, imageDropConfig);

    // Insert data contains a text file and an image file
    // 'text' drop handles text file
    // 'image' drop handles image file
    insertDataIntoTopic(
      core,
      tEmpty.id,
      {
        action: 'insert',
        types: [],
        data: {},
        files: [textFile, imageFile],
      },
      metadata,
    );

    const topic = Topics.get(tEmpty.id);
    const drops = Drops.get(topic.drops);
    const drop = Object.values(drops)[0];

    // Only a 'text' drop should be created because the
    // 'image' drop extension is not enabled on the topic
    expect(topic.drops.length).toBe(1);
    expect(drop.type).toBe(dropConfig.type);
    // Passes metadata to addDrops
    expect(Topics.addDrops).toHaveBeenCalledWith(
      core,
      tEmpty.id,
      [drop.id],
      metadata,
    );
  });

  describe("action === 'copy'", () => {
    it('duplicates the drops and adds new drops to the topic', () => {
      jest.spyOn(Topics, 'addDrops');

      insertDataIntoTopic(core, tEmpty.id, copyDropsDataInsert, metadata);

      const topic = Topics.get(tEmpty.id);

      // Added both drops to topic
      expect(topic.drops.length).toBe(2);
      // Added new drops to topic
      expect(!sourceTopic.drops.includes(topic.drops[0]));
      // Calls Topics.onAddDrops with metadata
      expect(Topics.addDrops).toHaveBeenCalledWith(
        core,
        tEmpty.id,
        topic.drops,
        metadata,
      );
    });

    it('does nothing if the data contains no drops', () => {
      jest.spyOn(Topics, 'addDrops');

      insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...copyDropsDataInsert, data: {}, types: [] },
        metadata,
      );

      expect(Topics.addDrops).not.toHaveBeenCalled();
    });
  });

  describe("action === 'cut'", () => {
    it('adds drops to the topic', () => {
      const addDrops = jest.spyOn(Topics, 'addDrops');

      // Add drop1 to the topic
      Topics.addDrops(core, tEmpty.id, [drop1.id]);

      // Insert the cut data into the topic
      insertDataIntoTopic(core, tEmpty.id, cutDropsDataInsert, metadata);

      // Adds drop2 as is
      expect(addDrops.mock.calls[1][2].includes(drop2.id)).toBeTruthy();
      // Adds a duplicate of drop1
      const [duplicateDropId] = addDrops.mock.calls[1][2].filter(
        (id) => id !== drop2.id,
      );
      const duplicateDrop = Drops.get(duplicateDropId);
      expect(duplicateDrop.duplicatedFrom).toBe(drop1.id);
    });

    it('duplicates drops which are already in the topic', () => {
      jest.spyOn(Topics, 'addDrops');

      insertDataIntoTopic(core, tEmpty.id, cutDropsDataInsert, metadata);

      // Calls Topics.onAddDrops with drops and metadata
      expect(Topics.addDrops).toHaveBeenCalledWith(
        core,
        tEmpty.id,
        [drop1.id, drop2.id],
        metadata,
      );
    });

    it('does nothing if the data contains no drops', () => {
      jest.spyOn(Topics, 'addDrops');

      insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...cutDropsDataInsert, data: {}, types: [] },
        metadata,
      );

      expect(Topics.addDrops).not.toHaveBeenCalled();
    });
  });

  describe("action === 'move'", () => {
    it('moves drops to the topic', () => {
      jest.spyOn(Topics, 'moveDrops');

      insertDataIntoTopic(core, tEmpty.id, moveDropsDataInsert, metadata);

      // Calls Topics.onAddDrops with drops and metadata
      expect(Topics.moveDrops).toHaveBeenCalledWith(
        core,
        sourceTopic.id,
        tEmpty.id,
        [drop1.id, drop2.id],
        metadata,
      );
    });

    it('removes drops from the source topic', () => {
      insertDataIntoTopic(core, tEmpty.id, moveDropsDataInsert, metadata);

      const topic = Topics.get(sourceTopic.id);

      expect(topic.drops.length).toBe(0);
    });

    it('does not attempt to remove drops from the source if source is missing or not a topic', () => {
      // No source, should not handle the insert
      const handledNoSource = insertDataIntoTopic(
        core,
        tEmpty.id,
        moveDropsDataInsert,
        metadata,
      );

      const topic = Topics.get(sourceTopic.id);

      expect(topic.drops.length).toBe(2);
      expect(handledNoSource).toBe(false);
    });
  });

  it('does nothing if the data contains no drops', () => {
    jest.spyOn(Topics, 'addDrops');

    insertDataIntoTopic(
      core,
      tEmpty.id,
      { ...moveDropsDataInsert, data: {}, types: [] },
      metadata,
    );

    expect(Topics.addDrops).not.toHaveBeenCalled();
  });

  describe("action === 'add'", () => {
    it('adds drops to the topic', () => {
      jest.spyOn(Topics, 'addDrops');

      insertDataIntoTopic(core, tEmpty.id, addDropsDataInsert, metadata);

      // Calls Topics.onAddDrops with drops and metadata
      expect(Topics.addDrops).toHaveBeenCalledWith(
        core,
        tEmpty.id,
        [drop1.id, drop2.id],
        metadata,
      );
    });

    it('does nothing if the data contains no drops', () => {
      jest.spyOn(Topics, 'addDrops');

      insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...addDropsDataInsert, data: {}, types: [] },
        metadata,
      );

      expect(Topics.addDrops).not.toHaveBeenCalled();
    });
  });
});
