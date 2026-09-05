import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignPreviewPane } from './DesignPreviewPane';

/**
 * Renders the pane around a placeholder render.
 *
 * @param controls - Extra controls to float above the canvas.
 * @returns The render container.
 */
function renderPane(controls?: React.ReactNode) {
  const { container } = render(
    <DesignPreviewPane width={384} controls={controls}>
      <div data-testid="render" />
    </DesignPreviewPane>,
  );

  return container;
}

describe('<DesignPreviewPane />', () => {
  afterEach(cleanup);

  it('hosts the render on a canvas with its zoom controls', () => {
    const container = renderPane();

    expect(
      container.querySelector('.ui-canvas-viewport [data-testid="render"]'),
    ).not.toBeNull();
    expect(container.querySelector('.ui-canvas-toolbar-zoom')).not.toBeNull();
    expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
  });

  it('applies the picked scheme to the render', () => {
    const container = renderPane();

    // Pick the red scheme from the scheme menu
    fireEvent.click(
      container.querySelector(
        '.design-preview-pane-scheme-trigger',
      ) as HTMLElement,
    );
    fireEvent.click(screen.getByText('Red'));

    expect(
      container
        .querySelector('.design-preview-pane-render')
        ?.classList.contains('scheme-red'),
    ).toBe(true);
  });

  it('renders the given controls', () => {
    renderPane(<button type="button">Custom control</button>);

    expect(screen.getByText('Custom control')).toBeInTheDocument();
  });
});
