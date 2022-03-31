import { mapById } from '@minddrop/utils';
import {
  Files,
  FileReferenceNotFoundError,
  FILES_TEST_DATA,
} from '@minddrop/files';
import { addFilesToDrop } from './addFilesToDrop';
import { cleanup, core, setup, textDrop1 } from '../test-utils';
import { getDrop } from '../getDrop';

const { textFileRef1 } = FILES_TEST_DATA;

describe('addFilesToDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds files to the drop', async () => {
    // Add a file to a drop
    addFilesToDrop(core, textDrop1.id, [textFileRef1.id]);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Drop should contain the file ID
    expect(drop.files).toContain(textFileRef1.id);
  });

  it('adds the drop as parent on the files', async () => {
    // Add a file to a drop
    addFilesToDrop(core, textDrop1.id, [textFileRef1.id]);

    // Get the updated file reference
    const file = Files.get(textFileRef1.id);

    // File should have the drop as a parent
    expect(file.attachedTo).toContain(textDrop1.id);
  });

  it('throws if file attachement does not exist', async () => {
    // Attempt to add a non-existent file to a drop. Should
    // throw a `FileReferenceNotFoundError`.
    expect(() =>
      addFilesToDrop(core, textDrop1.id, ['missing-file-id']),
    ).toThrowError(FileReferenceNotFoundError);
  });

  it('dispatches a `drops:add-files` event', (done) => {
    // Listen to 'drops:add-files' events
    core.addEventListener('drops:add-files', (payload) => {
      // Get the updated drop
      const drop = getDrop(textDrop1.id);
      // Get the updated file reference
      const file = Files.get(textFileRef1.id);

      // Payload data should contain the updated drop
      expect(payload.data.drop).toEqual(drop);
      // Payload data should contain the added files
      expect(payload.data.files).toEqual(mapById([file]));
      done();
    });

    // Add a file to a drop
    addFilesToDrop(core, textDrop1.id, [textFileRef1.id]);
  });
});
