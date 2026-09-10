import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { ContentColor, Theme } from '@minddrop/ui-theme';
import { cleanup } from '../test-utils';
import { DesignPreviewPane } from './DesignPreviewPane';

interface RenderPaneOptions {
  /**
   * The scheme the render carries.
   */
  scheme?: ContentColor | null;

  /**
   * Extra controls to float above the canvas.
   */
  controls?: React.ReactNode;
}

/**
 * Renders the pane around a placeholder render.
 *
 * @param options - The pane's props.
 * @returns The render container.
 */
function renderPane(options: RenderPaneOptions = {}) {
  const { container } = render(
    <DesignPreviewPane
      width={384}
      scheme={options.scheme}
      controls={options.controls}
    >
      <div data-testid="render" />
    </DesignPreviewPane>,
  );

  return container;
}

/**
 * Returns the class list of the render wrapper.
 *
 * @param container - The render container.
 * @returns The wrapper's classes.
 */
function renderClasses(container: HTMLElement): DOMTokenList | undefined {
  return container.querySelector('.design-preview-pane-render')?.classList;
}

describe('<DesignPreviewPane />', () => {
  afterEach(cleanup);

  it('hosts the render on a canvas with its zoom controls', () => {
    const container = renderPane();

    expect(
      container.querySelector('.ui-canvas-viewport [data-testid="render"]'),
    ).not.toBeNull();
    expect(container.querySelector('.ui-canvas-toolbar-zoom')).not.toBeNull();
    expect(screen.getByLabelText('Dark')).toBeInTheDocument();
  });

  it('themes the render in the picked appearance, leaving the app', async () => {
    Theme.setVariant('light');

    const container = renderPane();

    await userEvent.click(screen.getByLabelText('Dark'));

    expect(
      container.querySelector('.dark-theme .design-preview-pane-render'),
    ).not.toBeNull();
    expect(Theme.getVariant()).toBe('light');
  });

  it('applies the given scheme to the render', () => {
    const container = renderPane({ scheme: 'red' });

    expect(renderClasses(container)?.contains('scheme-red')).toBe(true);
  });

  it('leaves the render unschemed for the default colour', () => {
    const container = renderPane({ scheme: 'default' });

    expect(renderClasses(container)?.contains('scheme-default')).toBe(false);
  });

  it('renders the given controls', () => {
    renderPane({ controls: <button type="button">Custom control</button> });

    expect(screen.getByText('Custom control')).toBeInTheDocument();
  });

  it('renders the leading controls', () => {
    render(
      <DesignPreviewPane
        width={384}
        leadingControls={<button type="button">Leading control</button>}
      >
        <div data-testid="render" />
      </DesignPreviewPane>,
    );

    expect(screen.getByText('Leading control')).toBeInTheDocument();
  });
});
