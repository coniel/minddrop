import {
  setup,
  cleanup,
  tNavigation,
  tSailing,
  tCoastalNavigation,
  tUntitled,
} from '../test-utils';
import { isDescendant } from './isDescendant';

describe('isDescendant', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns `true` if the topic is a direct descendant', () => {
    // Check if the 'Navigation' topic is a descendant of
    // the 'Sailing' topic. Should return `true`.
    expect(isDescendant(tNavigation.id, [tSailing.id])).toBe(true);
  });

  it('returns `true` if the topic is a deep descendant', () => {
    // Check if the 'Coastal Navigation' topic is a descendant of
    // the 'Sailing' topic. Should return `true`.
    expect(isDescendant(tCoastalNavigation.id, [tSailing.id])).toBe(true);
  });

  it('returns `false` if the topic is not a descendant', () => {
    // Check if the 'Costal Navigation' topic is a descendant of
    // the 'Untitled' topic. Should return `false`.
    expect(isDescendant(tCoastalNavigation.id, [tUntitled.id])).toBe(false);
  });
});
