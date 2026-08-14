import React from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, waitFor } from '@minddrop/test-utils';
import { RichTextEditor } from '../RichTextEditor';
import {
  addTestElementConfig,
  cleanup,
  paragraphElement1,
  paragraphElement1PlainText,
} from '../test-utils';
import { BlockElementProps, Editor } from '../types';
import { TITLE_ELEMENT_TYPE } from './TitleElement';

// Editor instance captured by the probe element component
let capturedEditor: Editor;

/**
 * Renders as a plain block while capturing the editor instance
 * so tests can drive it using Transforms.
 */
const EditorProbeComponent: React.FC<BlockElementProps> = ({
  attributes,
  children,
}) => {
  capturedEditor = useSlateStatic() as Editor;

  return <div {...attributes}>{children}</div>;
};

// A probe element included in the editor content
const editorProbeElement = {
  type: 'editor-probe',
  children: [{ text: '' }],
};

// Slate batches operations and fires onChange in a microtask,
// so editor interactions are wrapped in async act calls to
// flush the change handling between steps.
const actFlush = (interaction: () => void) =>
  act(async () => {
    interaction();
  });

describe('RichTextEditor title', () => {
  beforeEach(() => {
    // Register the editor probe element type
    addTestElementConfig({
      type: 'editor-probe',
      component: EditorProbeComponent,
    });
  });

  afterEach(cleanup);

  // Renders an editor with the title feature enabled and returns
  // the render result along with collected callback calls
  const renderTitleEditor = (options: {
    title: string;
    validateTitle?: (title: string) => string | undefined;
  }) => {
    // Titles committed via onTitleChange
    const committedTitles: string[] = [];
    // Content values emitted via onChange
    const changeValues: unknown[][] = [];

    const result = render(
      <RichTextEditor
        title={options.title}
        validateTitle={options.validateTitle}
        onTitleChange={(newTitle) => committedTitles.push(newTitle)}
        onChange={(value) => changeValues.push(value)}
        initialValue={[paragraphElement1, editorProbeElement]}
      />,
    );

    return { result, committedTitles, changeValues };
  };

  it('renders the title as the first block seeded with the title prop', () => {
    const { result } = renderTitleEditor({ title: 'My document' });

    // The title element should be rendered as the first block
    const titleNode = result.container.querySelector('.title-element');

    expect(titleNode).not.toBeNull();
    expect(titleNode?.textContent).toBe('My document');
  });

  it('does not render a title element when the title prop is absent', () => {
    // Render an editor without a title prop
    const { container } = render(
      <RichTextEditor initialValue={[paragraphElement1]} />,
    );

    // No title element should be rendered
    expect(container.querySelector('.title-element')).toBeNull();
  });

  it('renders a placeholder when the title is empty', () => {
    const { result } = renderTitleEditor({ title: '' });

    // The translated placeholder should be rendered
    result.getByText('Untitled');
  });

  it('strips the title node from onChange values', async () => {
    const { changeValues } = renderTitleEditor({ title: 'My document' });

    await actFlush(() => {
      // Edit the paragraph content
      Transforms.insertText(capturedEditor, ' Extended.', {
        at: { path: [1, 0], offset: paragraphElement1PlainText.length },
      });
    });

    // A change should have been emitted
    expect(changeValues.length).toBeGreaterThan(0);

    // No emitted value should contain the title node
    changeValues.forEach((value) => {
      value.forEach((node) => {
        expect(node).not.toMatchObject({ type: TITLE_ELEMENT_TYPE });
      });
    });

    // The emitted content should contain the edited paragraph
    expect(changeValues[changeValues.length - 1][0]).toMatchObject({
      children: [{ text: `${paragraphElement1PlainText} Extended.` }],
    });
  });

  it('commits the title when the cursor leaves it', async () => {
    const { committedTitles } = renderTitleEditor({ title: 'My document' });

    await actFlush(() => {
      // Place the cursor at the start of the title
      Transforms.select(capturedEditor, { path: [0, 0], offset: 0 });
    });

    await actFlush(() => {
      // Edit the title text
      Transforms.insertText(capturedEditor, 'Renamed ');
    });

    // The title should not be committed while editing
    expect(committedTitles).toEqual([]);

    await actFlush(() => {
      // Move the cursor into the content
      Transforms.select(capturedEditor, { path: [1, 0], offset: 0 });
    });

    // The title should be committed once with the new value
    expect(committedTitles).toEqual(['Renamed My document']);
  });

  it('does not commit when the title is unchanged', async () => {
    const { committedTitles } = renderTitleEditor({ title: 'My document' });

    await actFlush(() => {
      // Place the cursor in the title
      Transforms.select(capturedEditor, { path: [0, 0], offset: 0 });
    });

    await actFlush(() => {
      // Move the cursor into the content without editing
      Transforms.select(capturedEditor, { path: [1, 0], offset: 0 });
    });

    // No commit should have been fired
    expect(committedTitles).toEqual([]);
  });

  it('commits the title when the editor is blurred', async () => {
    const { result, committedTitles } = renderTitleEditor({
      title: 'My document',
    });

    await actFlush(() => {
      // Place the cursor in the title
      Transforms.select(capturedEditor, { path: [0, 0], offset: 0 });
    });

    await actFlush(() => {
      // Edit the title text
      Transforms.insertText(capturedEditor, 'Renamed ');
    });

    await actFlush(() => {
      // Blur the editable area
      fireEvent.blur(result.container.querySelector('.editor') as HTMLElement);
    });

    // The title should be committed with the new value
    expect(committedTitles).toEqual(['Renamed My document']);
  });

  it('shows the validation error and reverts the title on leave', async () => {
    const { result, committedTitles } = renderTitleEditor({
      title: 'My document',
      // Reject the title 'Taken'
      validateTitle: (value) =>
        value === 'Taken' ? 'Name is already taken' : undefined,
    });

    await actFlush(() => {
      // Select the entire title text
      Transforms.select(capturedEditor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 'My document'.length },
      });
    });

    await actFlush(() => {
      // Replace the title with an invalid value
      capturedEditor.insertText('Taken');
    });

    // The validation error should be shown in a tooltip
    await result.findByText('Name is already taken');

    await actFlush(() => {
      // Move the cursor into the content
      Transforms.select(capturedEditor, { path: [1, 0], offset: 0 });
    });

    // The title should be reverted to the last committed value
    expect(capturedEditor.children[0]).toMatchObject({
      type: TITLE_ELEMENT_TYPE,
      children: [{ text: 'My document' }],
    });
    // No commit should have been fired
    expect(committedTitles).toEqual([]);

    // The validation error should be cleared
    await waitFor(() => {
      expect(result.queryByText('Name is already taken')).toBeNull();
    });
  });

  it('syncs external title prop changes into the title node', async () => {
    const { result } = renderTitleEditor({ title: 'My document' });

    await actFlush(() => {
      // Update the title prop externally
      result.rerender(
        <RichTextEditor
          title="Renamed externally"
          initialValue={[paragraphElement1, editorProbeElement]}
        />,
      );
    });

    // The title node should contain the new value
    expect(capturedEditor.children[0]).toMatchObject({
      type: TITLE_ELEMENT_TYPE,
      children: [{ text: 'Renamed externally' }],
    });
  });

  it('renders an untitled title as an empty title with it as placeholder', () => {
    const { result } = renderTitleEditor({ title: 'Untitled 3' });

    // The title node should be empty
    expect(capturedEditor.children[0]).toMatchObject({
      type: TITLE_ELEMENT_TYPE,
      children: [{ text: '' }],
    });
    // The untitled title should be shown as the placeholder
    result.getByText('Untitled 3');
  });

  it('does not commit when leaving an untitled title without typing', async () => {
    const { committedTitles } = renderTitleEditor({ title: 'Untitled 3' });

    await actFlush(() => {
      // Place the cursor in the empty title
      Transforms.select(capturedEditor, { path: [0, 0], offset: 0 });
    });

    await actFlush(() => {
      // Move the cursor into the content without typing
      Transforms.select(capturedEditor, { path: [1, 0], offset: 0 });
    });

    // No commit should have been fired
    expect(committedTitles).toEqual([]);
  });

  it('clears the title node when renamed to another untitled value', async () => {
    const { result, committedTitles } = renderTitleEditor({
      title: 'Untitled 3',
    });

    await actFlush(() => {
      // Type a new untitled value into the title
      Transforms.select(capturedEditor, { path: [0, 0], offset: 0 });
      Transforms.insertText(capturedEditor, 'Untitled 7');
    });

    await actFlush(() => {
      // Move the cursor into the content to commit
      Transforms.select(capturedEditor, { path: [1, 0], offset: 0 });
    });

    // The typed value should be committed
    expect(committedTitles).toEqual(['Untitled 7']);

    await actFlush(() => {
      // Sync the committed value back in as the title prop
      result.rerender(
        <RichTextEditor
          title="Untitled 7"
          initialValue={[paragraphElement1, editorProbeElement]}
        />,
      );
    });

    // The title node should be cleared back to a placeholder
    expect(capturedEditor.children[0]).toMatchObject({
      children: [{ text: '' }],
    });
    result.getByText('Untitled 7');
  });

  it('renders a custom title placeholder', () => {
    // Render an editor with an empty title and a custom placeholder
    const { getByText } = render(
      <RichTextEditor
        title=""
        titlePlaceholder="Name this page"
        initialValue={[paragraphElement1]}
      />,
    );

    // The custom placeholder should be rendered
    getByText('Name this page');
  });

  it('applies titleStyle to the title element', () => {
    // Render an editor with custom title styles
    const { container } = render(
      <RichTextEditor
        title="My document"
        titleStyle={{ fontSize: 40 }}
        initialValue={[paragraphElement1]}
      />,
    );

    // The styles should be applied to the title element
    expect(container.querySelector('.title-element')).toHaveStyle({
      fontSize: '40px',
    });
  });

  it('renders the title in read-only mode', () => {
    // Render a read-only editor with a title
    const { container } = render(
      <RichTextEditor
        title="My document"
        readOnly
        initialValue={[paragraphElement1]}
      />,
    );

    // The title should be rendered
    expect(container.querySelector('.title-element')?.textContent).toBe(
      'My document',
    );
  });
});
