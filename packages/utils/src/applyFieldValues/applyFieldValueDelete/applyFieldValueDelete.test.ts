import { applyFieldValueDelete } from './applyFieldValueDelete';
import { FieldValue } from '../../FieldValue';

describe('unsetFields', () => {
  it('deletes FieldValue.delete() fields', () => {
    const result = applyFieldValueDelete(
      { foo: 'foo', bar: 'bar', faz: 'faz' },
      {
        foo: FieldValue.delete(),
        bar: FieldValue.delete(),
        faz: 'faz',
      },
    );

    expect(result.foo).not.toBeDefined();
    expect(result.bar).not.toBeDefined();
    expect(result.faz).toBe('faz');
  });
});
