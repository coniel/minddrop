import { generateDrop } from '../generateDrop';
import { DropMap } from '../types';
import { filterDrops } from './filterDrops';

const activeDrop = generateDrop({ type: 'text' });
const deletedDrop = {
  ...generateDrop({ type: 'text' }),
  deleted: true,
  deletedAt: new Date(),
};

const drops: DropMap = {
  [activeDrop.id]: activeDrop,
  [deletedDrop.id]: deletedDrop,
};

describe('filterDrops', () => {
  it('returns only active drops by default', () => {
    const result = filterDrops(drops, {});

    expect(Object.keys(result).length).toBe(1);
    expect(result[activeDrop.id]).toBeDefined();
  });

  it('filters out active drops', () => {
    const result = filterDrops(drops, { active: false });

    expect(Object.keys(result).length).toBe(0);
  });

  it('filters in active drops', () => {
    const result = filterDrops(drops, { active: true });

    expect(Object.keys(result).length).toBe(1);
    expect(result[activeDrop.id]).toBeDefined();
  });

  it('filters in deleted drops', () => {
    const result = filterDrops(drops, { deleted: true });

    expect(Object.keys(result).length).toBe(1);
    expect(result[deletedDrop.id]).toBeDefined();
  });

  it('filters drops by type', () => {
    const imageDrop = generateDrop({ type: 'image' });
    const imageDropDeleted = generateDrop({
      type: 'image',
      deleted: true,
      deletedAt: new Date(),
    });
    const result = filterDrops(
      {
        ...drops,
        [imageDrop.id]: imageDrop,
        [imageDropDeleted.id]: imageDropDeleted,
      },
      {
        type: ['image'],
      },
    );

    expect(Object.keys(result).length).toBe(1);
    expect(result[imageDrop.id]).toBeDefined();
  });
});
