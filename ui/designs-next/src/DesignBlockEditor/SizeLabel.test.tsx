import { afterEach, describe, expect, it } from 'vitest';
import { render } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { SizeLabel } from './SizeLabel';

describe('SizeLabel', () => {
  afterEach(cleanup);

  it('reads the size out in snap units', () => {
    const { container } = render(
      <SizeLabel columnSpan={16} rowSpan={8} snap={4} unitSize={10} />,
    );

    expect(container.textContent).toBe('4 × 2');
  });

  it('reads out a span landing between squares', () => {
    const { container } = render(
      <SizeLabel columnSpan={16} rowSpan={7} snap={4} unitSize={10} />,
    );

    expect(container.textContent).toBe('4 × 1.8');
  });

  it('hands the stylesheet the size which fits the box', () => {
    const { container } = render(
      <SizeLabel columnSpan={4} rowSpan={2} snap={2} unitSize={10} />,
    );

    const label = container.firstElementChild as HTMLElement;

    // The label fits the twenty pixel tall box at half its height
    expect(
      label.style.getPropertyValue('--design-block-editor-size-label-fit'),
    ).toBe('10px');
  });
});
