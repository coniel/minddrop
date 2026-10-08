import { afterEach, describe, expect, it } from 'vitest';
import { ElementCornerRadius } from '@minddrop/designs-next';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { CornerRadiusToggleGroup } from './CornerRadiusToggleGroup';

describe('CornerRadiusToggleGroup', () => {
  afterEach(cleanup);

  it('marks the selected radius', () => {
    render(<CornerRadiusToggleGroup value="lg" onValueChange={() => {}} />);

    expect(screen.getByLabelText('Large')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('calls back with the chosen radius', () => {
    let chosen: ElementCornerRadius | null = null;

    render(
      <CornerRadiusToggleGroup
        value="sm"
        onValueChange={(radius) => {
          chosen = radius;
        }}
      />,
    );

    fireEvent.click(screen.getByLabelText('Full'));

    expect(chosen).toBe('full');
  });
});
