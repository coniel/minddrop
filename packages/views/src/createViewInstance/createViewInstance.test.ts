import { ViewNotRegisteredError } from '../errors';
import { getViewInstance } from '../getViewInstance';
import { cleanup, core, instanceView, setup, unregisteredView } from '../tests';
import { CreateViewInstanceData, ViewInstance } from '../types';
import { createViewInstance } from './createViewInstance';

interface Data extends CreateViewInstanceData {
  foo: string;
}

interface Instance extends ViewInstance {
  foo: string;
}

describe('createViewInstance', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanup();
  });

  it('creates and returns a view instance', () => {
    const instance = createViewInstance<Data, Instance>(core, {
      view: instanceView.id,
      foo: 'foo',
    });

    expect(instance).toBeDefined();
    expect(instance.id).toBeDefined();
    expect(instance.view).toEqual(instanceView.id);
    expect(instance.foo).toEqual('foo');
  });

  it('adds the view instance to the store', () => {
    const instance = createViewInstance<Data>(core, {
      view: instanceView.id,
      foo: 'foo',
    });

    expect(getViewInstance(instance.id)).toEqual(instance);
  });

  it('throws a ViewNotRegisteredError if the view is not registered', () => {
    expect(() =>
      createViewInstance(core, { view: unregisteredView.id }),
    ).toThrowError(ViewNotRegisteredError);
  });

  it('dispatches a `views:create-instance` event', (done) => {
    let instance: ViewInstance;

    const callback = (payload) => {
      expect(payload.data).toEqual(instance);
      done();
    };

    core.addEventListener('views:create-instance', callback);

    instance = createViewInstance(core, { view: instanceView.id });
  });
});
