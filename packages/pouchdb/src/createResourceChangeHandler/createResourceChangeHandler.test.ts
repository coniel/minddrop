import { initializeCore } from '@minddrop/core';
import { createResourceChangeHandler } from './createResourceChangeHandler';

describe('handleResourceChange', () => {
  it('calls onChange on the appropriate resource connector', () => {
    const onChangeFoo = jest.fn();
    const onChangeBar = jest.fn();
    const core = initializeCore('pouchdb');

    core.registerResource({ type: 'foos:foo', onChange: onChangeFoo });
    core.registerResource({ type: 'bars:bar', onChange: onChangeBar });

    const changeHandler = createResourceChangeHandler(core);
    changeHandler('foos:foo', { id: 'foo' }, false);

    expect(onChangeFoo).toHaveBeenCalledWith({ id: 'foo' }, false);
    expect(onChangeBar).not.toHaveBeenCalled();
  });

  it('ignores unregistered resources', () => {
    const core = initializeCore('pouchdb');

    const changeHandler = createResourceChangeHandler(core);
    changeHandler('foos:foo', { id: 'foo' }, false);
  });
});
