import { describe, afterEach, it, vi } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { FieldLabel } from './FieldLabel';

const TRANSLATION = 'Le label';

vi.mock('@minddrop/i18n', () => ({
  useTranslation: () => ({ t: () => TRANSLATION }),
  initializeI18n: vi.fn(),
}));

describe('<FieldLabel />', () => {
  afterEach(cleanup);

  it('renders children', () => {
    const { getByText } = render(
      <FieldLabel>
        <span>Label</span>
      </FieldLabel>,
    );

    getByText('Label');
  });

  it('translates the label', () => {
    const { getByText } = render(<FieldLabel label="label" />);

    getByText(TRANSLATION);
  });
});
