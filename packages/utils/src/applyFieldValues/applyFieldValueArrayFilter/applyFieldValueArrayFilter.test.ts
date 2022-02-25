import { FieldValue } from '../../FieldValue';
import { applyFieldValueArrayFilter } from './applyFieldValueArrayFilter';

describe('applyFieldValueArrayFilter', () => {
  it('filters values from array', () => {
    const object = { field: [{ id: 'id-1' }, { id: 'id-2' }], nullField: null };
    const changes = {
      field: FieldValue.arrayFilter((item) => item.id !== 'id-1'),
      nullField: null,
    };
    const result = applyFieldValueArrayFilter(object, changes);

    expect(result.field).toEqual([{ id: 'id-2' }]);
    expect(result.nullField).toBeNull();
  });

  it('does nothing if field does not exist', () => {
    const object: { field?: any[] } = {};
    const changes = {
      field: FieldValue.arrayFilter((item) => item.id === 'id-1'),
    };
    const result = applyFieldValueArrayFilter(object, changes);

    expect(result.field).not.toBeDefined();
  });
});
