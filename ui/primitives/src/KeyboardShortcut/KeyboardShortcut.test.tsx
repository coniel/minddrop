import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { KeyboardShortcut } from './KeyboardShortcut';

describe('<KeyboardShortcut />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<KeyboardShortcut keys={['Shift', 'A']} className="my-class" />);

    expect(screen.getByText('ShiftA').className).toContain('my-class');
  });

  it('renders Ctrl as Ctrl and Alt as Alt on non Mac systems', () => {
    const platformGetter = vi.spyOn(window.navigator, 'platform', 'get');
    platformGetter.mockReturnValueOnce('Win32');

    render(<KeyboardShortcut keys={['Ctrl', 'Alt', 'N']} />);

    screen.getByText('CtrlAltN');
  });

  it('renders Ctrl as ⌘ and Alt as ⌥ on Macs', () => {
    const userAgentGetter = vi.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValueOnce(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    );

    render(<KeyboardShortcut keys={['Ctrl', 'Alt', 'N']} />);

    screen.getByText('⌘⌥N');
  });
});
