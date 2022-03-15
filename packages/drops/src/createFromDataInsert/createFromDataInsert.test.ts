import { DataInsert, initializeCore } from '@minddrop/core';
import { imageFile, textFile } from '@minddrop/test-utils';
import { getDrops } from '../getDrops';
import { createFromDataInsert } from './createFromDataInsert';
import { clearDrops } from '../clearDrops';
import { htmlDropConfig, imageDropConfig, textDropConfig } from '../test-utils';
import { registerDropType } from '../registerDropType';
import { getDrop } from '../getDrop';

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

const textData: DataInsert = {
  action: 'insert',
  types: ['text/plain', 'text/html'],
  data: {
    'text/plain': 'Hello world',
    'text/html': '<p>Hello world</p>',
  },
  files: [],
};

const filesData: DataInsert = {
  action: 'insert',
  types: ['files'],
  data: {},
  files: [imageFile, textFile],
};

const multiTextFilesData: DataInsert = {
  action: 'insert',
  types: ['files'],
  data: {},
  files: [textFile, textFile],
};

describe('createFromDataInsert', () => {
  beforeAll(() => {
    registerDropType(core, textDropConfig);
    registerDropType(core, htmlDropConfig);
    registerDropType(core, imageDropConfig);
  });

  beforeEach(() => {
    clearDrops(core);
  });

  it('creates a drop from the first drop config to match the data type', async () => {
    const drops = await createFromDataInsert(core, textData, [
      imageDropConfig,
      textDropConfig,
      htmlDropConfig,
    ]);

    // Should only create a single drop
    expect(Object.keys(drops).length).toBe(1);

    const [drop] = Object.values(drops);

    // Should create a 'text' drop
    expect(drop.type).toBe('text');
    // Should save the drop
    expect(getDrop(drop.id)).toEqual(drop);
  });

  it('creates a drop from each file using the first drop config to match the file type', async () => {
    const drops = await createFromDataInsert(core, filesData, [
      imageDropConfig,
      textDropConfig,
      htmlDropConfig,
    ]);

    // Should create 2 drops
    expect(Object.keys(drops).length).toBe(2);
    // Should create an 'image' drop
    expect(
      Object.values(drops).find((drop) => drop.type === 'image'),
    ).toBeDefined();
    // Should create a 'text' drop
    expect(
      Object.values(drops).find((drop) => drop.type === 'text'),
    ).toBeDefined();
    // Should save the drops
    expect(getDrops(Object.keys(drops))).toEqual(drops);
  });

  it('creates a single drop from multiple files if drop type supports multiFile', async () => {
    const drops = await createFromDataInsert(core, multiTextFilesData, [
      textDropConfig,
      htmlDropConfig,
    ]);

    // Should create 1 drop
    expect(Object.keys(drops).length).toBe(1);

    const [drop] = Object.values(drops);

    // Should create a 'text' drop
    expect(drop.type).toBe('text');
    // Should save the drop
    expect(getDrop(drop.id)).toEqual(drop);
  });
});
