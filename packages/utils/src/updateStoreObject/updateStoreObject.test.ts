import { updateStoreObject } from './updateStoreObject';
import { UNSET } from '../unsetFields';

const date = new Date('01/01/2000');

const object = {
  id: 'id',
  createdAt: '01/01/2000',
  updatedAt: date,
  content: 'Hello world',
  archived: true,
};

describe('updateStoreObject', () => {
  it('merges in data', () => {
    const updated = updateStoreObject(object, { content: 'Edited' });
    expect(updated.content).toBe('Edited');
  });

  it('removes unset fields', () => {
    const updated = updateStoreObject(object, { archived: UNSET });
    expect(updated.archived).not.toBeDefined();
  });
});
