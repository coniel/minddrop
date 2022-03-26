import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact } from 'slate-react';
import { RichTextContent, RichTextDocument } from '@minddrop/rich-text';
import { generateId } from '@minddrop/utils';
import {
  RichTextElementConfig,
  RichTextEditorPluginConfig,
  RichTextElementProps,
} from '../types';
import { Transforms } from '../Transforms';
import { withElementIds } from '../withElementIds';
import './Editor.css';

interface EditorProps {
  /**
   * The editor document.
   */
  document: RichTextDocument;

  /**
   * Callback fired when the editor value changes.
   */
  onChange(document: RichTextDocument): void;

  /**
   * The editor plugins.
   */
  plugins?: RichTextEditorPluginConfig[];
}

export const Editor: React.FC<EditorProps> = ({
  document,
  onChange,
  plugins = [],
}) => {
  // Used to prevent debouncedContentUpdate from being called
  // when the value changes due to it being loaded from props.
  const isPropValue = useRef(true);
  // Maintain a list of all the revisions created by this editor
  const revisions = useRef([document.revision]);
  // Create the editor API
  const [editor] = useState(() =>
    withElementIds(withReact(withHistory(createEditor()))),
  );
  // The content of the editor
  const [value, setValue] = useState(document.content as Descendant[]);
  // Create an array of the rich text element configs added by plugins
  const elementConfigs = useMemo<RichTextElementConfig[]>(
    () =>
      plugins.reduce(
        (configs, plugin) => [...configs, ...(plugin.elements || [])],
        [],
      ),
    [plugins],
  );

  // Debounced callback fired when the editor value changes which
  // updates the drop's content and content revision ID.
  const debouncedContentUpdate = useDebouncedCallback(
    (content: RichTextContent) => {
      const revision = generateId();
      // Save the revision
      revisions.current = [...revisions.current, revision];
      onChange({ content, revision });
    },
    500,
    { maxWait: 2000 },
  );

  useEffect(() => {
    if (!isPropValue.current) {
      // Ignore the change to `value` if it was caused by the document prop
      debouncedContentUpdate(value as RichTextContent);
    }

    isPropValue.current = false;
  }, [value]);

  useEffect(() => {
    // When the document's content is changed, its revision ID is set to a new value.
    // Revision IDs created by this editor are stored in the `revisions` ref.
    // We want to ignore changes to the document prop caused by changes made in this
    // editor instance, as they lag behind due to the debouncing the onChange callback.
    // If the revision ID of the document prop is not in the list of local revision IDs,
    // it means that the document has changed from outside this editor instance, so we
    // update the local document to the prop value.
    if (!revisions.current.includes(document.revision)) {
      // Prevent onChange callback from being called
      isPropValue.current = true;
      // Add the document's revision to the list of revisions
      revisions.current = [...revisions.current, document.revision];
      // Set the editor's content to the document content
      Transforms.resetNodes(editor, { nodes: document.content });
    }
  }, [document, editor]);

  const renderElement = useCallback(
    (props: RichTextElementProps) => {
      // Get the config for the element type
      const config = elementConfigs.find(
        ({ type }) => type === props.element.type,
      );

      // Add the element ID to the attributes prop
      const attributes = { ...props.attributes, id: props.element.id };

      if (config) {
        // Render the config's component
        return <config.component {...props} attributes={attributes} />;
      }

      // Render a plain div if no matching element config was found
      // (should not occure but added to prevent errors just in case).
      return <div {...attributes}>{props.children}</div>;
    },
    [elementConfigs],
  );

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable className="editor" renderElement={renderElement} />
    </Slate>
  );
};
