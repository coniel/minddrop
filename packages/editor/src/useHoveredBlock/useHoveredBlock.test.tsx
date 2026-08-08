import React, { useRef } from 'react';
import { useSlateStatic } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render } from '@minddrop/test-utils';
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
import { useHoveredBlock } from './useHoveredBlock';

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

describe('useHoveredBlock', () => {
  beforeEach(() => {
    setup();

    // Register the editor probe element type
    EditorBlockElementConfigsStore.add({
      type: 'editor-probe',
      component: EditorProbeComponent,
    });
  });

  afterEach(cleanup);

  it('tracks the block under the pointer', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('paragraph');

    fireEvent.pointerMove(getByText(headingElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('heading');
  });

  it('keeps the block while the pointer is not over one', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    // The container sits around the editor, so its own padding is
    // not part of any block
    fireEvent.pointerMove(getByTestId('container'));

    expect(getByTestId('readout').textContent).toBe('paragraph');
  });

  it('keeps the block while the pointer is over the controls', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));
    fireEvent.pointerMove(getByTestId('controls'));

    expect(getByTestId('readout').textContent).toBe('paragraph');
  });

  it('clears the block when the pointer moves elsewhere on the page', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));
    fireEvent.pointerMove(getByTestId('elsewhere'));

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('clears the block when the user types', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));
    fireEvent.keyDown(getByText(paragraphElement1PlainText), { key: 'a' });

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('clears the block when the page is scrolled', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));
    fireEvent.scroll(getByTestId('container'));

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('clears the block while a selection is being dragged', () => {
    const { getByText, getByTestId } = render(<Harness />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    // A held button means the pointer is dragging a selection
    fireEvent.pointerMove(getByText(paragraphElement1PlainText), {
      buttons: 1,
    });

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('does not track the title', () => {
    const { getByText, getByTestId } = render(
      <Harness title={titleElement1PlainText} />,
    );

    fireEvent.pointerMove(getByText(titleElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('none');
  });

  it('does not track blocks while disabled', () => {
    const { getByText, getByTestId } = render(<Harness enabled={false} />);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    expect(getByTestId('readout').textContent).toBe('none');
  });
});
