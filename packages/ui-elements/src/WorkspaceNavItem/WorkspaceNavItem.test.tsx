import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { WorkspaceNavItem } from './WorkspaceNavItem';

describe('<WorkspaceNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<WorkspaceNavItem label="Projects" icon="cube" />);

    screen.getByText('Projects');
  });

  it('renders the icon', () => {
    render(<WorkspaceNavItem label="Projects" icon="icon" />);

    screen.getByText('icon');
  });

  it('renders actions', () => {
    render(<WorkspaceNavItem label="Projects" actions="actions" />);

    screen.getByText('actions');
  });

  it('supports defaultExpanded', () => {
    render(
      <WorkspaceNavItem defaultExpanded label="Projects">
        children
      </WorkspaceNavItem>,
    );

    screen.getByText('children');
  });

  it('expanded state can be controlled', () => {
    const onExpandedChange = vi.fn();

    render(
      <WorkspaceNavItem
        expanded
        label="Projects"
        onExpandedChange={onExpandedChange}
      >
        children
      </WorkspaceNavItem>,
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

    render(<WorkspaceNavItem label="Projects" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByText('Projects'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('supports being active', () => {
    render(<WorkspaceNavItem label="Projects" active />);

    screen.getByRole('button', { current: true });
  });
});
