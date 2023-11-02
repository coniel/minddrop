import { describe, afterEach, it, vi } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { HelperText } from './HelperText';

const TRANSLATION = 'Le helper text';

vi.mock('@minddrop/i18n', () => ({
  useTranslation: () => ({ t: () => TRANSLATION }),
  initializeI18n: vi.fn(),
}));

describe('<HelperText />', () => {
  afterEach(cleanup);

  it('renders children', () => {
    const { getByText } = render(
      <HelperText>
        <span>Helper text</span>
      </HelperText>,
    );

    getByText('Helper text');
  });

  it('translates `text` value', () => {
    const { getByText } = render(<HelperText text="helperText" />);

    getByText(TRANSLATION);
  });
});
