import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { IconProps } from '../Icon';
import { IconRenderer } from './IconRenderer';

vi.mock('../Icon', () => ({
  Icon: (props: IconProps) => <svg data-testid="icon" {...props} />,
}));

describe('<IconRenderer />', () => {
  afterEach(cleanup);

  it('supports icon names', () => {
    render(<IconRenderer icon="settings" />);

    screen.getByTestId('icon');
  });

  it('supports react elements', () => {
    render(<IconRenderer icon={<span data-testid="icon" />} />);

    screen.getByTestId('icon');
  });

  it('applies className to named icon', () => {
    render(<IconRenderer className="icon-class" icon="settings" />);

    expect(screen.getByTestId('icon').className).toContain('icon-class');
  });

  it('applies className to react element icon', () => {
    render(
      <IconRenderer
        className="icon-renderer-class"
        icon={<span data-testid="icon" className="icon-class" />}
      />,
    );

    expect(screen.getByTestId('icon').className).toContain('icon-class');
    expect(screen.getByTestId('icon').className).toContain(
      'icon-renderer-class',
    );
  });

  it('renders nothing if icon prop is not set', () => {
    render(<IconRenderer />);

    expect(screen.queryByTestId('icon')).toBe(null);
  });
});
