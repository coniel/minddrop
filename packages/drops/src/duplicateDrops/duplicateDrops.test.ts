import {
  setup,
  cleanup,
  core,
  textDrop1,
  textDrop2,
  imageDrop1,
} from '../test-utils';
import { getDrop } from '../getDrop';
import { duplicateDrops } from './duplicateDrops';
import { Files } from '@minddrop/files';

describe('duplicateDrops', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(cleanup);

  it('creates new drops', () => {
    const drops = duplicateDrops(core, [textDrop1.id, textDrop2.id]);
    const drop1Id = Object.values(drops).find(
      (drop) => drop.markdown === textDrop1.markdown,
    ).id;
    const drop2Id = Object.values(drops).find(
      (drop) => drop.markdown === textDrop2.markdown,
    ).id;

    const drop1 = getDrop(drop1Id);
    const drop2 = getDrop(drop2Id);

    expect(drop1).toBeDefined();
    expect(drop2).toBeDefined();
  });

  it('adds the `duplicatedFrom` property', () => {
    const drops = duplicateDrops(core, [textDrop1.id, textDrop2.id]);
    const drop1Id = Object.values(drops).find(
      (drop) => drop.markdown === textDrop1.markdown,
    ).id;
    const drop2Id = Object.values(drops).find(
      (drop) => drop.markdown === textDrop2.markdown,
    ).id;

    const drop1 = getDrop(drop1Id);
    const drop2 = getDrop(drop2Id);

    expect(drop1.duplicatedFrom).toBe(textDrop1.id);
    expect(drop2.duplicatedFrom).toBe(textDrop2.id);
  });

  it('adds new drops as attachment to file references', () => {
    const drops = duplicateDrops(core, [imageDrop1.id]);
    const [newDrop] = Object.values(drops);

    const fileRef = Files.get(imageDrop1.files[0]);

    expect(fileRef.attachedTo.includes(newDrop.id));
  });
});
