import { generateId } from './generateId';

describe('generateId', () => {
  it('should return a string', () => {
    expect(typeof generateId()).toBe('string');
  });
});
