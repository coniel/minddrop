import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@minddrop/test-utils';
import { i18nTestString } from '../../test-utils';
import { MenuLabel } from './MenuLabel';

describe('<MenuLabel />', () => {
  afterEach(cleanup);

  it('renders the i18n label', () => {
    const { getByText } = render(<MenuLabel label={i18nTestString.key} />);

    getByText(i18nTestString.value);
  });

  it('renders children', () => {
    const { getByText } = render(<MenuLabel>Test Children</MenuLabel>);

    getByText('Test Children');
  });

  it('renders actions', () => {
    const { getByText } = render(
      <MenuLabel
        actions={[
          <div key="action" data-testid="action">
            Action
          </div>,
        ]}
      >
        Label with Action
      </MenuLabel>,
    );

    getByText('Action');
  });

  it('renders a button when button prop is true', () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <MenuLabel button onClick={onClick}>
        Button Label
      </MenuLabel>,
    );

    expect(getByRole('button')).toBeTruthy();

    getByRole('button').click();
    expect(onClick).toHaveBeenCalled();
  });
});
