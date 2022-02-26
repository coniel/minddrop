import { act, renderHook, textFile } from '@minddrop/test-utils';
import { deleteDropPermanently } from './deleteDropPermanently';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { addFilesToDrop } from '../addFilesToDrop';
import { useAllDrops } from '../useAllDrops';
import { cleanup, core, setup } from '../test-utils';
import { Files } from '@minddrop/files';

describe('deleteDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the deleted drop', () => {
    let drop: Drop;
    let deletedDrop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      deletedDrop = deleteDropPermanently(core, drop.id);
    });

    expect(deletedDrop).toEqual(drop);
  });

  it('removes the drop from the store', () => {
    const { result } = renderHook(() => useAllDrops());
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      deleteDropPermanently(core, drop.id);
    });

    expect(result.current[drop.id]).not.toBeDefined();
  });

  it("dispatches a 'drops:delete-permanently' event", () => {
    let drop: Drop;

    function callback(payload) {
      expect(payload.data).toEqual(drop);
    }

    core.addEventListener('drops:delete-permanently', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
      deleteDropPermanently(core, drop.id);
    });
  });

  it('removes the drop from attached file referenes', async () => {
    // Create a drop
    const drop = createDrop(core, { type: 'text' });
    // Create a file reference
    let file = await Files.create(core, textFile, ['attachment-id']);

    // Add the file reference to the drop
    addFilesToDrop(core, drop.id, [file.id]);

    // Permanently delete the drop
    deleteDropPermanently(core, drop.id);

    // Get the updated file reference
    file = Files.get(file.id);

    // Should remove drop ID from file reference
    expect(file.attachedTo.includes(drop.id)).toBeFalsy();
  });
});
