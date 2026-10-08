import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '../DesignPropertiesProvider';
import { cleanup } from '../test-utils';
import { useEditorAutoFocus } from './useEditorAutoFocus';

interface ProbeProps {
  /**
   * The test ID of the probe's element.
   */
  id: string;
}

/**
 * Renders 'focused' when the hook returns true, 'unfocused'
 * otherwise.
 */
const FocusProbe: React.FC<ProbeProps> = ({ id }) => {
  const autoFocus = useEditorAutoFocus();

  return <div data-testid={id}>{autoFocus ? 'focused' : 'unfocused'}</div>;
};

/**
 * Builds two probes in a provider.
 *
 * @param autoFocusEditor - Whether the provider's first editor takes the focus.
 * @returns The provider element.
 */
function probes(autoFocusEditor: boolean) {
  return (
    <DesignPropertiesProvider autoFocusEditor={autoFocusEditor}>
      <FocusProbe id="first" />
      <FocusProbe id="second" />
    </DesignPropertiesProvider>
  );
}

describe('useEditorAutoFocus', () => {
  afterEach(cleanup);

  it('grants the focus to the first editor alone', () => {
    render(probes(true));

    expect(screen.getByTestId('first').textContent).toBe('focused');
    expect(screen.getByTestId('second').textContent).toBe('unfocused');
  });

  it('grants no focus when auto focus is off', () => {
    render(probes(false));

    expect(screen.getByTestId('first').textContent).toBe('unfocused');
  });

  it('leaves a mounted editor unfocused when auto focus turns on later', () => {
    const { rerender } = render(probes(false));

    rerender(probes(true));

    expect(screen.getByTestId('first').textContent).toBe('unfocused');
  });

  it('grants the focus to an editor mounting after auto focus turns on', () => {
    const { rerender } = render(
      <DesignPropertiesProvider autoFocusEditor={false}>
        <></>
      </DesignPropertiesProvider>,
    );

    rerender(
      <DesignPropertiesProvider autoFocusEditor>
        <FocusProbe id="first" />
      </DesignPropertiesProvider>,
    );

    expect(screen.getByTestId('first').textContent).toBe('focused');
  });
});
