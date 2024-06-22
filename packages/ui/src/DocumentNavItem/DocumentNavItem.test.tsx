import { describe, afterEach, expect, it, vi } from 'vitest';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { DocumentNavItem } from './DocumentNavItem';

describe('<DocumentNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<DocumentNavItem label="Sailing" />);

    screen.getByText('Sailing');
  });

  it('supports defaultExpanded', () => {
    render(
      <DocumentNavItem defaultExpanded label="document">
        <DocumentNavItem label="subdocument" />
      </DocumentNavItem>,
    );

    screen.getByText('subdocument');
  });

  it('expanded state can be controlled', () => {
    const onExpandedChange = vi.fn();

    render(
      <DocumentNavItem expanded label="document" onExpandedChange={onExpandedChange}>
        <DocumentNavItem label="subdocument" />
      </DocumentNavItem>,
    );

    screen.getByText('subdocument');

    act(() => {
      const toggleButton = screen.getAllByLabelText('expandSubdocuments')[0];
      fireEvent.click(toggleButton);
    });

    expect(onExpandedChange).toHaveBeenCalled();
  });

  it('can be clicked', () => {
    const onClick = vi.fn();

    render(<DocumentNavItem label="document" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByText('document'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('supports being active', () => {
    render(<DocumentNavItem label="document" active />);

    screen.getByRole('button', { current: true });
  });
});
