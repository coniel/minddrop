import { afterEach, describe, it, vi } from 'vitest';
import { cleanup, render } from '@minddrop/test-utils';
import { TextInput } from './TextInput';

const TRANSLATION = 'Le placeholder';

vi.mock('@minddrop/i18n', () => ({
  useTranslation: () => ({ t: () => TRANSLATION }),
  initializeI18n: vi.fn(),
}));

describe('<TextInput />', () => {
  afterEach(cleanup);

  it('translates the placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextInput placeholder="placeholder" />,
    );

    getByPlaceholderText(TRANSLATION);
  });
});
