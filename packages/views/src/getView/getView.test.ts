import { cleanup, setup, staticView, unregisteredView } from '../test-utils';
import { ViewNotRegisteredError } from '../errors';
import { getView } from './getView';

describe('getView', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the view', () => {
    expect(getView(staticView.id)).toEqual(staticView);
  });

  it('thows a ViewNotRegisteredError if the view is not registered', () => {
    expect(() => getView(unregisteredView.id)).toThrowError(
      ViewNotRegisteredError,
    );
  });
});
