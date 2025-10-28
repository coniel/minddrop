import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { Sidebar } from './Sidebar';

describe('<Sidebar />', () => {
  afterEach(cleanup);

  it('renders the basic props', () => {
    const { getByText } = render(
      <Sidebar className="my-class" style={{ height: 20 }}>
        content
      </Sidebar>,
    );

    // Renders content
    const content = getByText('content');
    // Applies className
    expect(content.className).toContain('my-class');
    // Applies style
    expect(content.style.height).toBe('20px');
  });

  it('sets the width to initialWidth', () => {
    const { getByText } = render(<Sidebar initialWidth={400}>content</Sidebar>);

    const sidebar = getByText('content');

    expect(sidebar.style.width).toBe('400px');
    expect(sidebar.attributes.getNamedItem('data-width')?.textContent).toBe(
      '400',
    );
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
