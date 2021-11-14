import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { IconRenderer } from './IconRenderer';
import { Icon } from '../Icon';

describe('<IconRenderer />', () => {
  afterEach(cleanup);

  it('supports icon names', () => {
    render(<IconRenderer icon="settings" />);

    screen.getByTestId('icon');
  });

  it('supports react elements', () => {
    render(<IconRenderer icon={<Icon name="settings" />} />);

    screen.getByTestId('icon');
  });

  it('applies className to named icon', () => {
    render(<IconRenderer className="icon-class" icon="settings" />);

    expect(screen.getByTestId('icon')).toHaveClass('icon-class');
  });

  it('applies className to react element icon', () => {
    render(
      <IconRenderer
        className="icon-renderer-class"
        icon={<Icon name="settings" className="icon-class" />}
      />,
    );

    expect(screen.getByTestId('icon')).toHaveClass('icon-class');
    expect(screen.getByTestId('icon')).toHaveClass('icon-renderer-class');
  });

  it('renders nothing if icon prop is not set', () => {
    render(<IconRenderer />);

    expect(screen.queryByTestId('icon')).toBe(null);
  });
});
