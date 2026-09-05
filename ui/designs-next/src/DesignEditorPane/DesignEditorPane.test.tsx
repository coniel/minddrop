import { afterEach, describe, expect, it } from 'vitest';
import {
  cardColumns,
  cardRows,
  designElements,
} from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignEditorPane } from './DesignEditorPane';

/**
 * Renders the pane on the fixture layout.
 *
 * @param controls - Extra controls to float above the canvas.
 * @returns The render container.
 */
function renderPane(controls?: React.ReactNode) {
  const { container } = render(
    <DesignEditorPane
      elements={designElements}
      columns={cardColumns}
      rows={cardRows}
      selectedId={null}
      controls={controls}
      onElementsChange={() => undefined}
      onSelectionChange={() => undefined}
    />,
  );

  return container;
}

describe('<DesignEditorPane />', () => {
  afterEach(cleanup);

  it('hosts the block editor on a canvas with its zoom controls', () => {
    const container = renderPane();

    expect(
      container.querySelector('.ui-canvas-viewport .design-block-editor'),
    ).not.toBeNull();
    expect(container.querySelector('.ui-canvas-toolbar-zoom')).not.toBeNull();
  });

  it('changes the snap resolution through the snap toggles', () => {
    const container = renderPane();
    const surface = container.querySelector(
      '.design-block-editor',
    ) as HTMLElement;

    fireEvent.click(screen.getByLabelText('16px'));

    // The layout's grid lines draw at the new resolution
    expect(surface.style.backgroundSize).toBe('16px 16px');
  });

  it('renders the given controls', () => {
    renderPane(<button type="button">Custom control</button>);

    expect(screen.getByText('Custom control')).toBeInTheDocument();
  });
});
