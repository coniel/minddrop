import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewTypeNotRegisteredError } from '../../errors';
import { cleanup, setup, viewType1 } from '../../test-utils';
import { generateView } from './generateView';

describe('generateView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the view type is not registered', () => {
    expect(() => generateView('unknown-view-type')).toThrow(
      ViewTypeNotRegisteredError,
    );
  });

  it('generates a new view instance with default options', () => {
    const view = generateView(viewType1.type);

    expect(view).toEqual({
      type: viewType1.type,
      id: expect.any(String),
      name: viewType1.name,
      options: viewType1.defaultOptions,
    });
  });
});
