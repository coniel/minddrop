import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElement, Designs } from '@minddrop/designs-next';
import {
  cardColumns,
  cardRows,
  designElements,
  titleDesignElement,
} from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignEditorPane } from './DesignEditorPane';

// The elements passed to the most recent onElementsChange call
let changedElements: DesignElement[] | null;

// The element ID passed to the most recent onSelectionChange call
let selectedElementId: string | null | undefined;

interface RenderPaneOptions {
  /**
   * The controlled selection.
   */
  selectedId?: string | null;

  /**
   * The design's layout controls.
   */
  layoutControls?: React.ReactNode;

  /**
   * Whether the design is aspect-locked.
   */
  aspectLocked?: boolean;

  /**
   * Whether the block editor fills the pane.
   */
  fill?: boolean;
}

/**
 * Renders the pane on the fixture layout with a recording change
 * callback.
 *
 * @param options - The pane's selection and design options.
 * @returns The render container.
 */
function renderPane(options: RenderPaneOptions = {}) {
  const { container } = render(
    <DesignEditorPane
      defaultSnap={Designs.constants.TypeSnaps.card}
      elements={designElements}
      columns={cardColumns}
      rows={cardRows}
      selectedId={options.selectedId ?? null}
      layoutControls={options.layoutControls}
      aspectLocked={options.aspectLocked}
      fill={options.fill}
      onElementsChange={(elements) => {
        changedElements = elements;
      }}
      onSelectionChange={(elementId) => {
        selectedElementId = elementId;
      }}
    />,
  );

  return container;
}

/**
 * Returns the title fixture element from the most recent change.
 *
 * @returns The changed element.
 */
function changedTitle() {
  return changedElements?.find(
    (element) => element.id === titleDesignElement.id,
  );
}

describe('<DesignEditorPane />', () => {
  beforeEach(() => {
    changedElements = null;
    selectedElementId = undefined;
  });

  afterEach(cleanup);

  it('hosts the block editor on a canvas with its zoom controls', () => {
    const container = renderPane();

    expect(
      container.querySelector('.ui-canvas-viewport .design-block-editor'),
    ).not.toBeNull();
    expect(container.querySelector('.ui-canvas-toolbar-zoom')).not.toBeNull();
  });

  it('fills the pane with the block editor, scaled to its width', () => {
    const offsetWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetWidth',
    );

    // Lay the pane out at 20px per column
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => cardColumns * 20,
    });

    const container = renderPane({ fill: true });
    const surface = container.querySelector(
      '.design-block-editor',
    ) as HTMLElement;

    // Restore the unlaid-out width
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      ...offsetWidth,
    });

    expect(container.querySelector('.ui-canvas-viewport')).toBeNull();
    expect(surface.style.width).toBe(`${cardColumns * 20}px`);
    expect(surface.style.height).toBe(`${cardRows * 20}px`);
  });

  it('clears the selection on presses around the filled block editor', () => {
    const container = renderPane({
      selectedId: titleDesignElement.id,
      fill: true,
    });
    const fill = container.querySelector(
      '.design-canvas-pane-fill',
    ) as HTMLElement;

    fireEvent.mouseDown(fill);

    expect(selectedElementId).toBeNull();
  });

  it("puts the layout controls in the filled pane's toolbar", () => {
    const container = renderPane({
      layoutControls: <button type="button">Layout control</button>,
      fill: true,
    });

    expect(
      container.querySelector('.design-canvas-pane-toolbar'),
    ).toHaveTextContent('Layout control');
  });

  it('changes the snap resolution through the snap toggles', () => {
    const container = renderPane();
    const surface = container.querySelector(
      '.design-block-editor',
    ) as HTMLElement;

    fireEvent.click(screen.getByLabelText('16px'));

    // The layout's grid lines draw at the new resolution
    expect(surface.style.getPropertyValue('--design-block-editor-cell')).toBe(
      '16px',
    );
  });

  it('floats the layout controls above the canvas', () => {
    const container = renderPane({
      layoutControls: <button type="button">Layout control</button>,
    });

    expect(container.querySelector('.ui-canvas-toolbar')).toHaveTextContent(
      'Layout control',
    );
  });

  it('shows the selected blocks controls in the canvas side toolbar', () => {
    const withoutSelection = renderPane();

    expect(
      withoutSelection.querySelector(
        '.design-canvas-pane-side-controls .floating-toolbar',
      ),
    ).toBeNull();

    cleanup();

    const withSelection = renderPane({ selectedId: titleDesignElement.id });

    expect(
      withSelection.querySelector(
        '.design-canvas-pane-side-controls .floating-toolbar',
      ),
    ).not.toBeNull();
    expect(screen.getByLabelText('Width')).toBeInTheDocument();
  });

  it('clears the selection on canvas background presses', () => {
    const container = renderPane({ selectedId: titleDesignElement.id });
    const viewport = container.querySelector(
      '.ui-canvas-viewport',
    ) as HTMLElement;

    fireEvent.mouseDown(viewport);

    expect(selectedElementId).toBeNull();
  });

  it('clears the selection on clicks outside the pane', () => {
    renderPane({ selectedId: titleDesignElement.id });

    fireEvent.click(document.body);

    expect(selectedElementId).toBeNull();
  });

  it('keeps the selection on clicks inside the toolbar', () => {
    renderPane({ selectedId: titleDesignElement.id });

    fireEvent.click(screen.getByLabelText('Width'));

    expect(selectedElementId).toBeUndefined();
  });

  it('keeps the selection on clicks inside a toolbar menu', () => {
    renderPane({ selectedId: titleDesignElement.id });

    // The menu's options render in a portal outside the pane
    fireEvent.click(screen.getByLabelText('Width'));
    fireEvent.click(screen.getByLabelText('Fluid width'));

    expect(selectedElementId).toBeUndefined();
  });

  it('changes the width mode through the toolbar', () => {
    renderPane({ selectedId: titleDesignElement.id });

    fireEvent.click(screen.getByLabelText('Width'));
    fireEvent.click(screen.getByLabelText('designsNext.pin.label.left'));

    expect(changedTitle()?.widthMode).toBe('fixed-left');
  });

  it('changes the content fit through the toolbar', () => {
    renderPane({ selectedId: titleDesignElement.id });

    fireEvent.click(screen.getByLabelText('designsNext.contentFit.label'));
    fireEvent.click(screen.getByLabelText('designsNext.contentFit.grow'));

    expect(changedTitle()?.contentFit).toBe('grow');
  });

  it('changes the height mode through the toolbar when aspect-locked', () => {
    renderPane({
      selectedId: titleDesignElement.id,
      aspectLocked: true,
    });

    fireEvent.click(screen.getByLabelText('Height'));
    fireEvent.click(screen.getByLabelText('designsNext.pin.label.bottom'));

    expect(changedTitle()?.heightMode).toBe('fixed-bottom');
  });
});
