import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { CollectionNavItem } from './CollectionNavItem';

describe('<CollectionNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<CollectionNavItem label="Projects" icon="cube" />);

    screen.getByText('Projects');
  });

  it('renders the icon', () => {
    render(<CollectionNavItem label="Projects" icon="icon" />);

    screen.getByText('icon');
  });

  it('renders actions', () => {
    render(<CollectionNavItem label="Projects" actions="actions" />);

    screen.getByText('actions');
  });

  it('supports defaultExpanded', () => {
    render(
      <CollectionNavItem defaultExpanded label="Projects">
        children
      </CollectionNavItem>,
    );

    screen.getByText('children');
  });

  it('expanded state can be controlled', () => {
    const onExpandedChange = vi.fn();

    render(
      <CollectionNavItem
        expanded
        label="Projects"
        onExpandedChange={onExpandedChange}
      >
        children
      </CollectionNavItem>,
    );

    screen.getByText('children');

    act(() => {
      const toggleButton = screen.getByText('Projects');
      fireEvent.click(toggleButton);
    });

    expect(onExpandedChange).toHaveBeenCalled();
  });

  it('can be clicked', () => {
    const onClick = vi.fn();

    render(<CollectionNavItem label="Projects" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByText('Projects'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('supports being active', () => {
    render(<CollectionNavItem label="Projects" active />);

    screen.getByRole('button', { current: true });
  });
});
