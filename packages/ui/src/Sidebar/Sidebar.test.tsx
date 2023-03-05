import { describe, afterEach, it, expect, vi } from 'vitest';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { Sidebar } from './Sidebar';

describe('<Sidebar />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Sidebar className="my-class">content</Sidebar>);

    expect(screen.getByText('content').className).toContain('my-class');
  });

  it('sets the width to initialWidth', () => {
    render(<Sidebar initialWidth={400}>content</Sidebar>);

    expect(
      screen.getByText('content').attributes.getNamedItem('data-width')
        ?.textContent,
    ).toBe('400');
  });

  it('call onResized when resized', () => {
    const onResized = vi.fn();
    render(
      <Sidebar initialWidth={400} onResized={onResized}>
        content
      </Sidebar>,
    );

    act(() => {
      fireEvent.mouseDown(screen.getByTestId('resize-handle'));
      fireEvent.mouseMove(screen.getByTestId('resize-handle'));
      fireEvent.mouseUp(screen.getByTestId('resize-handle'));
    });

    expect(onResized).toHaveBeenCalledWith(400);
  });
});
