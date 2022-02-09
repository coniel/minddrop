import { createDrop } from '../createDrop';
import { Drop } from '../types';
import { insertData } from './insertData';
import { DropTypeNotRegisteredError } from '../errors';
import { unregisterDropType } from '../unregisterDropType';
import {
  cleanup,
  core,
  setup,
  textData,
  textDropConfig,
  unregisteredDropConfig,
} from '../test-utils';
import { registerDropType } from '../registerDropType';

describe('insertData', () => {
  let textDrop: Drop;
  let imageDrop: Drop;
  let unregisteredDrop: Drop;

  beforeAll(() => {
    setup();
    registerDropType(core, unregisteredDropConfig);
    textDrop = createDrop(core, { type: 'text', markdown: '' });
    imageDrop = createDrop(core, { type: 'image' });
    unregisteredDrop = createDrop(core, { type: 'unregistered' });
    unregisterDropType(core, unregisteredDropConfig.type);
  });

  afterAll(() => {
    cleanup();
  });

  it("calls the drop config's insertData method", () => {
    const spy = jest.spyOn(textDropConfig, 'insertData');

    insertData(core, textDrop.id, textData);

    expect(spy).toHaveBeenCalledWith(core, textDrop, textData);

    spy.mockClear();
  });

  it('returns the updated drop', async () => {
    const drop = await insertData(core, textDrop.id, textData);

    expect(drop.id).toEqual(textDrop.id);
    expect(drop.markdown).toEqual(textData.data['text/plain']);
  });

  it('returns the original drop if data insert is not supported', async () => {
    const drop = await insertData(core, imageDrop.id, textData);

    expect(drop).toEqual(imageDrop);
  });

  it('throws a DropTypeNotRegisteredError if the drop type is not registered', async () => {
    await expect(() =>
      insertData(core, unregisteredDrop.id, textData),
    ).rejects.toThrowError(DropTypeNotRegisteredError);
  });
});
