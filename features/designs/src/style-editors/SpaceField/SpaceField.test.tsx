import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SpaceToken } from '@minddrop/designs';
import { i18n } from '@minddrop/i18n';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../../test-utils';
import { SpaceField } from './SpaceField';

// The label the field renders, and the buttons stepping it
const FieldLabel = 'designsStudio.style.fields.padding';
const LessLabel = 'designsStudio.style.space.decrease';
const MoreLabel = 'designsStudio.style.space.increase';

describe('<SpaceField />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('shows the step and the measurement it resolves to', () => {
    render(<TestField initialValue="2" />);

    expect(step().textContent).toContain(
      i18n.t('designsStudio.style.space.2.label'),
    );
    expect(step().textContent).toContain(
      i18n.t('designsStudio.style.space.2.hint'),
    );
  });

  it('steps up the scale', () => {
    render(<TestField initialValue="2" />);

    fireEvent.click(screen.getByLabelText(MoreLabel));

    expect(step().textContent).toContain(
      i18n.t('designsStudio.style.space.3.label'),
    );
  });

  it('steps down the scale', () => {
    render(<TestField initialValue="2" />);

    fireEvent.click(screen.getByLabelText(LessLabel));

    expect(step().textContent).toContain(
      i18n.t('designsStudio.style.space.1-5.label'),
    );
  });

  it('skips the steps below the scale it offers', () => {
    render(<TestField initialValue="1" />);

    fireEvent.click(screen.getByLabelText(LessLabel));

    // The sub-unit steps are not offered, so the smallest step
    // below 4px is the hairline
    expect(step().textContent).toContain(
      i18n.t('designsStudio.style.space.px.label'),
    );
  });

  it('leaves no spacing when stepped below the smallest step', () => {
    render(<TestField initialValue="px" />);

    fireEvent.click(screen.getByLabelText(LessLabel));

    // The key is cleared rather than pinned to a hairline, which
    // is no space at all rather than spacing inherited from
    // anywhere
    expect(step().textContent).toContain(
      i18n.t('designsStudio.style.space.none'),
    );
    screen.getByText('cleared');
  });

  it('stops at the ends of the scale', () => {
    render(<TestField />);

    // Nothing below inherited spacing
    expect(screen.getByLabelText(LessLabel)).toBeDisabled();

    cleanupRender();

    render(<TestField initialValue="8" />);

    expect(screen.getByLabelText(MoreLabel)).toBeDisabled();
  });

  it('jumps to a distant step chosen from the scale', async () => {
    render(<TestField initialValue="1" />);

    // The step itself opens the whole scale
    await userEvent.click(step());
    await userEvent.click(
      screen.getByText('designsStudio.style.space.7.label'),
    );

    expect(step().textContent).toContain(
      i18n.t('designsStudio.style.space.7.label'),
    );
  });
});

/**
 * Returns the step, which is both the field's value and the
 * trigger of its scale.
 */
function step(): HTMLElement {
  return screen.getByRole('combobox');
}

/**
 * Renders a spacing field over local state, so the test can assert
 * what the field wrote without a studio instance.
 */
const TestField: React.FC<{ initialValue?: SpaceToken }> = ({
  initialValue,
}) => {
  const [value, setValue] = useState<SpaceToken | undefined>(initialValue);

  return (
    <>
      <SpaceField label={FieldLabel} value={value} onChange={setValue} />

      {/** Marker proving the key cleared, since an absent value
       * cannot be asserted on directly **/}
      {value === undefined && <span>cleared</span>}
    </>
  );
};
