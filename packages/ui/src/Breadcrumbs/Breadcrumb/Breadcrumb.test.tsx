import { describe, afterEach, it, expect, vi } from 'vitest';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { Breadcrumb } from './Breadcrumb';

describe('<Breadcrumbs />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<Breadcrumb label="Topic" />);

    screen.getByText('Topic');
  });

  it('is clickable', () => {
    const onClick = vi.fn();
    render(<Breadcrumb label="Topic" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('is keyboard accessible', () => {
    const onClick = vi.fn();
    render(<Breadcrumb label="Topic" onClick={onClick} />);

    act(() => {
      fireEvent.keyDown(screen.getByRole('button'), {
        key: 'Enter',
      });

      fireEvent.keyDown(screen.getByRole('button'), {
        key: ' ',
      });
    });

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
