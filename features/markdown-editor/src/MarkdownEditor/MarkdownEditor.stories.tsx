import { useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { Story, StorySection } from '@minddrop/ui-primitives/dev';
import { MarkdownEditor } from './MarkdownEditor';
import './MarkdownEditor.stories.css';

// Sample markdown content shared by the editor stories
const INITIAL_CONTENT = `# Position and its derivatives

The position of a point particle is defined in relation to a coordinate system centred on an arbitrary fixed reference point in space called the origin O.

- Velocity is the rate of change of position
- Acceleration is the rate of change of velocity`;

// Titles rejected by the title story's validator (lowercased)
const TAKEN_TITLES = ['taken', 'duplicate', 'my document 2'];

/**
 * Renders the rich text editor stories.
 */
export const EditorStories = () => (
  <Story title="Editor">
    <StorySection
      title="Regular"
      description="A markdown editor without a title. Content changes are logged to the console via the debounced change callback."
    >
      <RegularEditorStory />
    </StorySection>

    <StorySection
      title="With title"
      description='Renders an enforced title block as the first node. Enter jumps to the content, the title survives select-all + delete, and pasted blocks are flattened to plain text. The title commits when the cursor leaves it. Invalid titles to try: "Taken", "Duplicate", "My document 2" (all case insensitive). Invalid values show an error tooltip and revert on leaving the title. Clearing the title commits an empty title with the default untitled placeholder.'
    >
      <TitledEditorStory />
    </StorySection>

    <StorySection
      title="Untitled title"
      description='Default untitled titles ("Untitled", "Untitled 1", etc.) render as an empty title with the untitled name as the placeholder. This one starts as "Untitled 2": type a name to commit it, or rename it to another untitled value (e.g. "Untitled 7") and leave the title to see it turn back into a placeholder.'
    >
      <UntitledEditorStory />
    </StorySection>
  </Story>
);

/**
 * Renders a regular editor without a title.
 */
const RegularEditorStory = () => (
  <div className="markdown-editor-stories-frame">
    <MarkdownEditor
      initialValue={INITIAL_CONTENT}
      onDebouncedChange={(value) => console.log('[EditorStories]', value)}
    />
  </div>
);

/**
 * Renders an editor with a bound title and a validator rejecting
 * blank and taken titles.
 */
const TitledEditorStory = () => {
  const [committedTitle, setCommittedTitle] = useState('My document');

  return (
    <div>
      <div className="markdown-editor-stories-frame">
        <MarkdownEditor
          title={committedTitle}
          onTitleChange={setCommittedTitle}
          validateTitle={validateStoryTitle}
          initialValue={INITIAL_CONTENT}
        />
      </div>
      <p className="markdown-editor-stories-committed-title">
        Committed title: {committedTitle || '(empty)'}
      </p>
    </div>
  );
};

/**
 * Renders an editor with a default untitled title, shown as an
 * empty title with the untitled name as placeholder.
 */
const UntitledEditorStory = () => {
  const [committedTitle, setCommittedTitle] = useState('Untitled 2');

  return (
    <div>
      <div className="markdown-editor-stories-frame">
        <MarkdownEditor
          title={committedTitle}
          onTitleChange={setCommittedTitle}
          validateTitle={validateStoryTitle}
          initialValue={INITIAL_CONTENT}
        />
      </div>
      <p className="markdown-editor-stories-committed-title">
        Committed title: {committedTitle || '(empty)'}
      </p>
    </div>
  );
};

registerStory({
  group: 'Editor',
  label: 'Markdown editor',
  component: EditorStories,
});

/**
 * Rejects titles from the taken titles list.
 */
function validateStoryTitle(title: string): string | undefined {
  // Reject taken titles
  if (TAKEN_TITLES.includes(title.trim().toLowerCase())) {
    return 'An entry with this title already exists';
  }

  return undefined;
}
