import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@minddrop/test-utils';
import { ContentColorSwatch } from './ContentColorSwatch';

describe('ContentColorSwatch', () => {
  afterEach(cleanup);

  it('fills the swatch with the colour at the step it is given', () => {
    const { container } = render(
      <ContentColorSwatch color="blue" level={400} />,
    );

    // jsdom keeps the custom property in the style attribute but
    // cannot resolve it, so the attribute itself is the assertion.
    expect(container.firstElementChild?.getAttribute('style')).toBe(
      'background: var(--blue-400);',
    );
  });

  it("fills it at the colour's most saturated step by default", () => {
    const { container } = render(<ContentColorSwatch color="green" />);

    expect(container.firstElementChild?.getAttribute('style')).toBe(
      'background: var(--green-900);',
    );
  });

  it('strikes an unset swatch through, in no colour of its own', () => {
    const { container } = render(<ContentColorSwatch color="blue" unset />);

    expect(container.firstElementChild).toHaveClass(
      'content-color-swatch-unset',
    );
    expect(container.firstElementChild).not.toHaveAttribute('style');
  });

  it('sizes the swatch', () => {
    const { container } = render(<ContentColorSwatch color="red" size="xs" />);

    expect(container.firstElementChild).toHaveClass(
      'content-color-swatch-size-xs',
    );
  });
});
