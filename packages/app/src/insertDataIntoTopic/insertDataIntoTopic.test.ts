import { DataInsert, initializeCore } from '@minddrop/core';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { Extensions, EXTENSIONS_TEST_DATA } from '@minddrop/extensions';
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

const { textDropConfig, imageDropConfig, textDrop1, textDrop2 } =
  DROPS_TEST_DATA;
const { tCoastalNavigation, tOffshoreNavigation, tEmpty } = TOPICS_TEST_DATA;
const { topicExtensionConfig } = EXTENSIONS_TEST_DATA;

const sourceTopic: Topic = {
  ...tEmpty,
  id: 'target',
  drops: [textDrop1.id, textDrop2.id],
  subtopics: [tCoastalNavigation.id, tOffshoreNavigation.id],
};

const copyDropsDataInsert: DataInsert = {
  types: [],
  data: {},
  source: {
    type: 'topic',
    id: sourceTopic.id,
  },
  action: 'copy',
  drops: [textDrop1.id, textDrop2.id],
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

describe('insertData', () => {
  beforeEach(() => {
    setup();
    Topics.load(core, [sourceTopic]);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("creates drops using the topic's extensions and adds them to the topic", async () => {
    Extensions.clear(core);
    Drops.clearRegisteredDropTypes(core);
    jest.spyOn(Topics, 'addDrops');

    // Set up extension 1, which is enabled on the topic and
    // is tied to the 'text' drop type
    const core1 = initializeCore({ appId: 'app', extensionId: 'extension-1' });
    Extensions.register(core, {
      ...topicExtensionConfig,
      id: 'extension-1',
    });
    Drops.register(core1, textDropConfig);
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
    await insertDataIntoTopic(
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
    expect(drop.type).toBe(textDropConfig.type);
    // Passes metadata to addDrops
    expect(Topics.addDrops).toHaveBeenCalledWith(
      core,
      tEmpty.id,
      [drop.id],
      metadata,
    );
  });

  describe("action === 'copy'", () => {
    it('duplicates the drops and adds new drops to the topic', async () => {
      jest.spyOn(Topics, 'addDrops');

      await insertDataIntoTopic(core, tEmpty.id, copyDropsDataInsert, metadata);

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

    it('does nothing if the data contains no drops', async () => {
      jest.spyOn(Topics, 'addDrops');

      await insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...copyDropsDataInsert, drops: [] },
        metadata,
      );
      await insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...copyDropsDataInsert, drops: undefined },
        metadata,
      );

      expect(Topics.addDrops).not.toHaveBeenCalled();
    });
  });

  describe("action === 'cut'", () => {
    it('adds drops to the topic', async () => {
      const addDrops = jest.spyOn(Topics, 'addDrops');

      // Add textDrop1 to the topic
      Topics.addDrops(core, tEmpty.id, [textDrop1.id]);

      // Insert the cut data into the topic
      await insertDataIntoTopic(core, tEmpty.id, cutDropsDataInsert, metadata);

      // Adds textDrop2 as is
      expect(addDrops.mock.calls[1][2].includes(textDrop2.id)).toBeTruthy();
      // Adds a duplicate of textDrop1
      const [duplicateDropId] = addDrops.mock.calls[1][2].filter(
        (id) => id !== textDrop2.id,
      );
      const duplicateDrop = Drops.get(duplicateDropId);
      expect(duplicateDrop.duplicatedFrom).toBe(textDrop1.id);
    });

    it('duplicates drops which are already in the topic', async () => {
      jest.spyOn(Topics, 'addDrops');

      await insertDataIntoTopic(core, tEmpty.id, cutDropsDataInsert, metadata);

      // Calls Topics.onAddDrops with drops and metadata
      expect(Topics.addDrops).toHaveBeenCalledWith(
        core,
        tEmpty.id,
        cutDropsDataInsert.drops,
        metadata,
      );
    });

    it('does nothing if the data contains no drops', async () => {
      jest.spyOn(Topics, 'addDrops');

      await insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...cutDropsDataInsert, drops: [] },
        metadata,
      );
      await insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...cutDropsDataInsert, drops: undefined },
        metadata,
      );

      expect(Topics.addDrops).not.toHaveBeenCalled();
    });
  });

  describe("action === 'move'", () => {
    it('moves drops to the topic', async () => {
      jest.spyOn(Topics, 'moveDrops');

      await insertDataIntoTopic(core, tEmpty.id, moveDropsDataInsert, metadata);

      // Calls Topics.onAddDrops with drops and metadata
      expect(Topics.moveDrops).toHaveBeenCalledWith(
        core,
        sourceTopic.id,
        tEmpty.id,
        moveDropsDataInsert.drops,
        metadata,
      );
    });

    it('removes drops from the source topic', async () => {
      await insertDataIntoTopic(core, tEmpty.id, moveDropsDataInsert, metadata);

      const topic = Topics.get(sourceTopic.id);

      expect(topic.drops.length).toBe(0);
    });

    it('does not attempt to remove drops from the source if source is missing or not a topic', async () => {
      // No source, should not handle the insert
      const handledNoSource = await insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...moveDropsDataInsert, source: undefined },
        metadata,
      );

      // Source not a topic, should not remove drops
      const handledNotTopic = await insertDataIntoTopic(
        core,
        tEmpty.id,
        {
          ...moveDropsDataInsert,
          source: { type: 'something-else', id: sourceTopic.id },
        },
        metadata,
      );

      const topic = Topics.get(sourceTopic.id);

      expect(topic.drops.length).toBe(2);
      expect(handledNoSource).toBe(false);
      expect(handledNotTopic).toBe(false);
    });
  });

  it('does nothing if the data contains no drops', async () => {
    jest.spyOn(Topics, 'addDrops');

    await insertDataIntoTopic(
      core,
      tEmpty.id,
      { ...moveDropsDataInsert, drops: [] },
      metadata,
    );
    await insertDataIntoTopic(
      core,
      tEmpty.id,
      { ...moveDropsDataInsert, drops: undefined },
      metadata,
    );

    expect(Topics.addDrops).not.toHaveBeenCalled();
  });

  describe("action === 'add'", () => {
    it('adds drops to the topic', async () => {
      jest.spyOn(Topics, 'addDrops');

      await insertDataIntoTopic(core, tEmpty.id, addDropsDataInsert, metadata);

      // Calls Topics.onAddDrops with drops and metadata
      expect(Topics.addDrops).toHaveBeenCalledWith(
        core,
        tEmpty.id,
        addDropsDataInsert.drops,
        metadata,
      );
    });

    it('does nothing if the data contains no drops', async () => {
      jest.spyOn(Topics, 'addDrops');

      await insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...addDropsDataInsert, drops: [] },
        metadata,
      );
      await insertDataIntoTopic(
        core,
        tEmpty.id,
        { ...addDropsDataInsert, drops: undefined },
        metadata,
      );

      expect(Topics.addDrops).not.toHaveBeenCalled();
    });
  });
});
