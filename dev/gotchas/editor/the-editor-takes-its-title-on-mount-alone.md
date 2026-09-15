---
title: 'The editor takes its title on mount alone'
package: packages/editor
summary: 'RichTextEditor captures whether it has a title on mount and seeds the title node once; gaining, losing or changing a title needs a remount, not a new prop.'
paths:
  - 'packages/editor/src/RichTextEditor/RichTextEditor.tsx'
  - 'packages/editor/src/withTitle/**'
tags: [title, slate, remount, seeding]
---

# The editor takes its title on mount alone

`RichTextEditor` reads the `title` prop twice at mount and never again. `hasTitle` is a `useRef(title !== undefined).current`, deciding whether the `withTitle` plugin is applied and whether the document is seeded with a title node; the text itself is seeded into that node by a `useMemo` with an empty dependency list. Changing `title` afterwards does nothing.

The Slate document is uncontrolled, so this is deliberate — it cannot gain or lose a first block node across renders. The reseed path exists for the body alone: it compares `initialValue` against `seededValueRef` and resets the content, explicitly slicing the title node off first.

So a consumer whose title can change has to remount the editor, keyed on whatever varies:

```tsx
<MarkdownEditor key={titleElement ? `${titleElement.property}:${titleValue}` : 'none'} … />
```

Three things need it, and only the first is obvious: turning a title on or off, remapping it to a different source, and the title's own text changing underneath it. The `designs-next` editor element keys on all three, which is free there because its editor is read only. A live editor cannot remount on every keystroke, so it will need a real title reseed alongside the body's — that does not exist yet.
