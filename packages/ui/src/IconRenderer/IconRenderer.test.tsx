import { describe, afterEach, it, expect, vi } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { IconRenderer } from './IconRenderer';

vi.mock('../Icon', () => ({
  Icon: (props: any) => <span data-testid="icon" {...props} />,
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

    console.log(screen.getByTestId('icon').className);
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
