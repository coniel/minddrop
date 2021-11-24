import { unsetFields } from './unsetFields';

describe('unsetFields', () => {
  it('deletes __UNSET__ fields', () => {
    const object = unsetFields({
      foo: '__UNSET__',
      bar: '__UNSET__',
      faz: 'faz',
    });

    expect(object.foo).not.toBeDefined();
    expect(object.bar).not.toBeDefined();
    expect(object.faz).toBe('faz');
  });
});
