import { describe, afterEach, it, expect, vi } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { KeyboardShortcut } from './KeyboardShortcut';

describe('<KeyboardShortcut />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<KeyboardShortcut keys={['Shift', 'A']} className="my-class" />);

    expect(screen.getByText('Shift+A').className).toContain('my-class');
  });

  it('renders Ctrl as Ctrl and Alt as Alt on non Mac systems', () => {
    const platformGetter = vi.spyOn(window.navigator, 'platform', 'get');
    platformGetter.mockReturnValueOnce('win32');

    render(<KeyboardShortcut keys={['Ctrl', 'Alt', 'N']} />);

    screen.getByText('Ctrl+Alt+N');
  });

  it('renders Ctrl as ⌘ and Alt as Option on Macs', () => {
    const platformGetter = vi.spyOn(window.navigator, 'platform', 'get');
    platformGetter.mockReturnValueOnce('macOS');

    render(<KeyboardShortcut keys={['Ctrl', 'Alt', 'N']} />);

    screen.getByText('⌘+⌥+N');
  });
});
