import { describe, expect, it } from 'vitest';
import { isElementInContext } from './isElementInContext';

describe('isElementInContext', () => {
  it('allows elements without a context anywhere', () => {
    expect(
      isElementInContext(undefined, {
        designType: 'space',
        layoutType: 'page',
      }),
    ).toBe(true);
  });

  it('excludes elements restricted to other design types', () => {
    expect(
      isElementInContext(
        { designTypes: ['database'] },
        { designType: 'space', layoutType: 'space' },
      ),
    ).toBe(false);
  });

  it('excludes elements restricted to other layout types', () => {
    expect(
      isElementInContext(
        { layoutTypes: ['card'] },
        { designType: 'database', layoutType: 'page' },
      ),
    ).toBe(false);
  });

  it('includes elements whose restrictions match', () => {
    expect(
      isElementInContext(
        { designTypes: ['database'], layoutTypes: ['card', 'list'] },
        { designType: 'database', layoutType: 'card' },
      ),
    ).toBe(true);
  });

  it('does not exclude on axes left unset by the context', () => {
    // No layout is active, so the layout axis cannot exclude
    expect(
      isElementInContext(
        { layoutTypes: ['card'] },
        { designType: 'database', layoutType: null },
      ),
    ).toBe(true);
  });
});
