import { describe, afterEach, expect, it, vi } from 'vitest';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { PageNavItem } from './PageNavItem';

describe('<PageNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<PageNavItem label="Sailing" />);

    screen.getByText('Sailing');
  });

  it('supports defaultExpanded', () => {
    render(
      <PageNavItem defaultExpanded label="page">
        <PageNavItem label="subpage" />
      </PageNavItem>,
    );

    screen.getByText('subpage');
  });

  it('expanded state can be controlled', () => {
    const onExpandedChange = vi.fn();

    render(
      <PageNavItem expanded label="page" onExpandedChange={onExpandedChange}>
        <PageNavItem label="subpage" />
      </PageNavItem>,
    );

    screen.getByText('subpage');

    act(() => {
      const toggleButton = screen.getAllByLabelText('expandSubpages')[0];
      fireEvent.click(toggleButton);
    });

    expect(onExpandedChange).toHaveBeenCalled();
  });

  it('can be clicked', () => {
    const onClick = vi.fn();

    render(<PageNavItem label="page" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByText('page'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('supports being active', () => {
    render(<PageNavItem label="page" active />);

    screen.getByRole('button', { current: true });
  });
});
