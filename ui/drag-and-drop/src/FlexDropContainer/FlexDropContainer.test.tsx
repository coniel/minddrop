import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@minddrop/test-utils';
import { FlexDropContainer } from './FlexDropContainer';

describe('<FlexDropContainer />', () => {
  afterEach(cleanup);

  it('leaves the children flush against the edges when packed', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="start">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    // No gap takes the free space, so the children keep it
    expect(growingGaps(container)).toEqual([]);
  });

  it('gives the space between spread children to the gaps between them', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="space-between">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    // Gap zones are flex items, so the space between the children
    // has to be taken by the gap between them rather than left to
    // the container's distribution, which would spread the edge
    // gaps too
    expect(growingGaps(container)).toEqual([1]);
  });

  it('gives the space around centred children to the edge gaps', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="center">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    expect(growingGaps(container)).toEqual([0, 2]);
  });

  it('gives the space before children at the end to the leading gap', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="end">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    expect(growingGaps(container)).toEqual([0]);
  });
});

/**
 * Returns the positions of the gaps taking a share of the
 * container's free space.
 */
function growingGaps(container: HTMLElement): number[] {
  const gaps = Array.from(container.querySelectorAll('[data-gap-zone]'));

  return gaps
    .filter((gap) => (gap as HTMLElement).style.flexGrow === '1')
    .map((gap) => Number(gap.getAttribute('data-position')));
}
