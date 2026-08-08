import React, { useRef } from 'react';
import { useSlateStatic } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { RichTextEditor } from '../RichTextEditor';
import {
  cleanup,
  headingElement1,
  headingElement1PlainText,
  paragraphElement1,
  paragraphElement1PlainText,
  setup,
  titleElement1PlainText,
} from '../test-utils';
import { BlockElementProps, Editor } from '../types';
import { ACTIVATION_DELAY, useHoveredBlock } from './useHoveredBlock';

// Editor instance captured by the probe element component
let capturedEditor: Editor;

/**
 * Renders as a plain block while capturing the editor instance,
 * which the harness needs in order to track the hovered block.
 */
const EditorProbeComponent: React.FC<BlockElementProps> = ({
  attributes,
  children,
}) => {
  capturedEditor = useSlateStatic() as Editor;

  return <div {...attributes}>{children}</div>;
};

/**
 * Renders an editor and reports the type of the hovered block, so
 * that tests can assert against the tracked block.
 */
const Harness: React.FC<{ enabled?: boolean; title?: string }> = ({
  enabled = true,
  title,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={containerRef} data-testid="container">
        <RichTextEditor
          title={title}
          initialValue={[
            { type: 'editor-probe', children: [{ text: '' }] },
            paragraphElement1,
            headingElement1,
          ]}
        />
      </div>

      {/* The readout and the stand-in controls sit outside the
          container, as the real controls do */}
      <HoveredBlockReadout containerRef={containerRef} enabled={enabled} />

      <div data-testid="elsewhere" />
    </>
  );
};

/**
 * Renders the hovered block's type as text.
 */
const HoveredBlockReadout: React.FC<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
}> = ({ containerRef, enabled }) => {
  const controlsRef = useRef<HTMLDivElement>(null);
  const { hoveredBlock } = useHoveredBlock(
    capturedEditor,
    containerRef,
    controlsRef,
    enabled,
  );

  return (
    <>
      <div data-testid="readout">{hoveredBlock?.element.type ?? 'none'}</div>

      {/* Stands in for the block controls, which are rendered
          outside the editor */}
      <div ref={controlsRef} data-testid="controls" />
    </>
  );
};

/**
 * Advances time past the activation delay, after which tracked
 * blocks are exposed.
 */
function waitOutActivationDelay() {
  act(() => {
    vi.advanceTimersByTime(ACTIVATION_DELAY);
  });
}

/**
 * Moves the pointer over an element and waits out the activation
 * delay, so that the hovered block is exposed.
 */
function hoverBlock(element: HTMLElement) {
  // Move the pointer over the element
  fireEvent.pointerMove(element);

  // Wait for the editor to activate
  waitOutActivationDelay();
}

describe('useHoveredBlock', () => {
  beforeEach(() => {
    setup();

    // The activation delay is driven by a timer
    vi.useFakeTimers();

    // Register the editor probe element type
    EditorBlockElementConfigsStore.add({
      type: 'editor-probe',
      component: EditorProbeComponent,
    });
  });

  afterEach(() => {
    vi.useRealTimers();

    cleanup();
  });

  it('tracks the block under the pointer', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('paragraph');

    // Once active, moving between blocks is tracked instantly
    fireEvent.pointerMove(getByText(headingElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('heading');
  });

  it('holds back the block until the activation delay has passed', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('none');

    waitOutActivationDelay();

    expect(getByTestId('readout').textContent).toBe('paragraph');
  });

  it('does not activate when the pointer leaves before the delay passes', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    // Leave the editor midway through the countdown
    act(() => {
      vi.advanceTimersByTime(ACTIVATION_DELAY / 2);
    });
    fireEvent.pointerMove(getByTestId('elsewhere'));

    waitOutActivationDelay();

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('waits out the delay again after the pointer leaves the editor', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.pointerMove(getByTestId('elsewhere'));

    // Back in the editor, the delay applies once more
    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('none');

    waitOutActivationDelay();

    expect(getByTestId('readout').textContent).toBe('paragraph');
  });

  it('stays active while the pointer remains in the editor', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));

    // Typing clears the block without deactivating the editor
    fireEvent.keyDown(getByText(paragraphElement1PlainText), { key: 'a' });

    fireEvent.pointerMove(getByText(headingElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('heading');
  });

  it('keeps the block while the pointer is not over one', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));

    // The container sits around the editor, so its own padding is
    // not part of any block
    fireEvent.pointerMove(getByTestId('container'));

    expect(getByTestId('readout').textContent).toBe('paragraph');
  });

  it('keeps the block while the pointer is over the controls', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.pointerMove(getByTestId('controls'));

    expect(getByTestId('readout').textContent).toBe('paragraph');
  });

  it('clears the block when the pointer moves elsewhere on the page', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.pointerMove(getByTestId('elsewhere'));

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('clears the block when the user types', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.keyDown(getByText(paragraphElement1PlainText), { key: 'a' });

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('clears the block when the page is scrolled', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.scroll(getByTestId('container'));

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('clears the block while a selection is being dragged', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));

    // A held button means the pointer is dragging a selection
    fireEvent.pointerMove(getByText(paragraphElement1PlainText), {
      buttons: 1,
    });

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('keeps the block while it is dragged by its controls', () => {
    const { getByText, getByTestId } = render(<Harness />);

    hoverBlock(getByText(paragraphElement1PlainText));

    // Pressing the controls starts a drag of the block they belong
    // to, which unmounting them would abort
    fireEvent.pointerDown(getByTestId('controls'));
    fireEvent.pointerMove(getByText(paragraphElement1PlainText), {
      buttons: 1,
    });

    expect(getByTestId('readout').textContent).toBe('paragraph');
  });

  it('does not track the title', () => {
    const { getByText, getByTestId } = render(
      <Harness title={titleElement1PlainText} />,
    );

    hoverBlock(getByText(titleElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('does not track blocks while disabled', () => {
    const { getByText, getByTestId } = render(<Harness enabled={false} />);

    hoverBlock(getByText(paragraphElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('none');
  });
});
