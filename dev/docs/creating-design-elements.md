# Creating Design Elements

Adding a new design element type requires 4 touchpoints: 2 new files/directories, 2 modified files.

## Overview

| #   | Location                                                | Action                                                                                              |
| --- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | `packages/designs/src/design-element-configs/<type>.ts` | **Create** config file (interface + config object)                                                  |
| 2   | `packages/designs/src/design-element-configs/index.ts`  | Add import, re-export, and register in unions + arrays                                              |
| 3   | `features/designs/src/design-elements/<type>/`          | **Create** element directory with display renderer, studio renderer, style editor, and barrel index |
| 4   | `features/designs/src/design-elements/index.ts`         | Import components and add UI registry entry                                                         |

After all 4 steps, also add required i18n translations and run `pnpm i` if any new dependencies were added.

---

## Step 1: Create the config file

Create `packages/designs/src/design-element-configs/<type>.ts`.

This file holds the element's TypeScript interface and its `DesignElementConfig` object, which drives the palette, icon/label maps, property compatibility, CSS style generation, and the default template.

```ts
// packages/designs/src/design-element-configs/date.ts
import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

// -- Element-specific types (if any) --

export interface DateFormat {
  mode: 'date' | 'relative';
  dateStyle: 'compact' | 'short' | 'medium' | 'long' | 'full';
  showTime: boolean;
}

// -- Element interface --

export interface DateElement extends DesignElementBase {
  type: 'date';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Placeholder date displayed when the element has no content.
   * Stored as an ISO date string (YYYY-MM-DD).
   */
  placeholder?: string;

  /**
   * Date formatting options.
   */
  format?: DateFormat;
}

// -- Config --

export const DateElementConfig: DesignElementConfig = {
  type: 'date',
  icon: 'calendar',
  label: 'design-studio.elements.date',
  group: 'content',
  styleCategory: 'text',
  compatiblePropertyTypes: ['date', 'created', 'last-modified'],
  generatePlaceholder: () => new Date().toISOString().slice(0, 10),
  template: {
    type: 'date',
    style: { ...DefaultTextElementStyle },
    placeholder: '',
  },
};
```

### Config properties

| Property                  | Purpose                                                                                                                                                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                    | Unique element type identifier string                                                                                                                                                                                                                 |
| `icon`                    | `UiIconName` shown in the palette and style editor header                                                                                                                                                                                             |
| `label`                   | i18n key for the element's display name                                                                                                                                                                                                               |
| `group`                   | Palette section: `'content'`, `'media'`, or `'layout'`. Omit to exclude from the palette                                                                                                                                                              |
| `styleCategory`           | Which CSS style function to use: `'text'`, `'icon'`, `'image'`, `'image-viewer'`, `'editor'`, `'webview'`, or `'container'`                                                                                                                           |
| `compatiblePropertyTypes` | `PropertyType[]` - which database property types this element can render                                                                                                                                                                              |
| `generatePlaceholder`     | `() => string` - Optional function that generates a random placeholder value. Called when the element is added from the palette. The return value is set as the element's `placeholder` field. If omitted, the template's `placeholder` is used as-is |
| `template`                | Default element data spread when adding from the palette. If the element has a `generatePlaceholder`, set `placeholder: ''` in the template (it will be overridden at creation time)                                                                  |

### Placeholder generators

If the element needs a `generatePlaceholder` function, place the generator in `packages/designs/src/design-element-configs/placeholder-generators/`. Each generator gets its own file:

```
packages/designs/src/design-element-configs/placeholder-generators/
  generateLoremIpsum.ts       # shared: generates N lorem ipsum words
  generateNumberPlaceholder.ts # generates a random number with N digits
  generateBadgePlaceholder.ts  # generates N comma-separated capitalised words
  index.ts                     # barrel export
```

Generators are exported from `@minddrop/designs` so they can also be used in style editor placeholder fields (e.g. re-roll buttons).

To add a new generator:

1. Create `placeholder-generators/generateMyPlaceholder.ts`
2. Export it from `placeholder-generators/index.ts`
3. Import and use it in the config's `generatePlaceholder` property

### Style types

Pick the style type that fits the element:

- **Text-based** (text, formatted-text, number, date, url): use `TextElementStyle` + `DefaultTextElementStyle`
- **Icon**: use `IconElementStyle` + `DefaultIconElementStyle`
- **Image**: use `ImageElementStyle` + `DefaultImageElementStyle`
- **Image viewer**: use `ImageViewerElementStyle` + `DefaultImageViewerElementStyle`
- **Editor**: use `EditorElementStyle` + `DefaultEditorElementStyle`
- **Webview**: use `WebviewElementStyle` + `DefaultWebviewElementStyle`
- **Container**: use `ContainerElementStyle` + `DefaultContainerElementStyle`

All style types and defaults are exported from `packages/designs/src/styles/`.

If none of the existing style categories fit, you may need to add a new `StyleCategory` value in `DesignElementConfig.types.ts` and a corresponding CSS function in `createElementCssStyle.ts`.

---

## Step 2: Register in the config index

Edit `packages/designs/src/design-element-configs/index.ts`. There are 5 places to update:

### 2a. Add imports

```ts
import { DateElementConfig } from './date';
import type { DateElement } from './date';
```

### 2b. Add re-export

```ts
export * from './date';
```

### 2c. Add to union types

Add the element to the relevant unions:

```ts
// LeafDesignElement (skip for container-like elements)
export type LeafDesignElement =
  | TextElement
  | DateElement   // <-- add here
  | /* ... */;

// DesignElement (all elements)
export type DesignElement = LeafDesignElement | ContainerElement | RootElement;

// DesignElementType (type identifiers)
export type DesignElementType =
  | 'date'   // <-- add here
  | /* ... */;

// DesignElementTemplate
export type DesignElementTemplate =
  | Omit<DateElement, 'id'>   // <-- add here
  | /* ... */;
```

### 2d. Add to elementConfigs array

```ts
export const elementConfigs: DesignElementConfig[] = [
  // ...existing configs
  DateElementConfig, // <-- add here
];
```

This single registration automatically populates `ElementTemplates`, `elementIconMap`, `elementLabelMap`, `ELEMENT_GROUPS`, and `PropertyTypeElementMap`.

---

## Step 3: Create UI components

Create a directory at `features/designs/src/design-elements/<type>/` with the element's 3 components and a barrel index.

### Naming convention

Components follow the pattern `[Name]DesignElement`, `[Name]StudioDesignElement`, `[Name]ElementStyleEditor`:

```
features/designs/src/design-elements/date/
  DateDesignElement.tsx
  DateStudioDesignElement.tsx
  DateElementStyleEditor.tsx
  index.ts
```

Element-specific sub-components, utils, and CSS also live in this directory:

```
features/designs/src/design-elements/date/
  DateDesignElement.tsx
  DateStudioDesignElement.tsx
  DateElementStyleEditor.tsx
  DatePlaceholderField.tsx           # element-specific sub-component
  formatDesignDate/                  # element-specific util
    formatDesignDate.ts
    formatDesignDate.test.ts
    index.ts
  index.ts
```

### 3a. Display renderer

Renders the element in the design preview. Receives the element data and renders it visually.

```ts
// features/designs/src/design-elements/date/DateDesignElement.tsx

import { DateElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';

export interface DateDesignElementProps {
  /**
   * The date element to render.
   */
  element: DateElement;
}

/**
 * Display renderer for a date design element.
 */
export const DateDesignElement: React.FC<DateDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const value = property?.value != null ? property.value : element.placeholder;
  const style = createTextCssStyle(element.style);

  return (
    <span style={style} data-placeholder={element.placeholder}>
      {String(value ?? '')}
    </span>
  );
};
```

Key patterns:

- Use `useElementProperty(element.id)` to get the mapped property value
- Fall back to `element.placeholder` when no property is mapped
- Use the appropriate `create*CssStyle` function to convert the style object to CSS

### 3b. Studio renderer

Renders the element on the design studio canvas. Often just wraps the display renderer. Can add studio-specific interactions (e.g. icon pickers, image upload dialogs).

```ts
// features/designs/src/design-elements/date/DateStudioDesignElement.tsx

import { FlatDateElement } from '../../types';
import { DateDesignElement } from './DateDesignElement';

export interface DateStudioDesignElementProps {
  element: FlatDateElement;
}

/**
 * Renders a date element in the design studio.
 */
export const DateStudioDesignElement: React.FC<
  DateStudioDesignElementProps
> = ({ element }) => {
  return <DateDesignElement element={element} />;
};
```

You will also need to add a flat type alias in `features/designs/src/types/FlatDesignElement.types.ts`:

```ts
export type FlatDateElement = DateElement & Parent;
```

(Leaf elements are automatically covered by `FlatLeafDesignElement`. Only add a named alias like `FlatDateElement` if the studio renderer needs to reference the specific type.)

### 3c. Style editor

Renders the style editor panel when the element is selected in the design studio.

```ts
// features/designs/src/design-elements/date/DateElementStyleEditor.tsx

import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { TextAlignToggle } from '../../style-editors/TextAlignToggle';
import { Typography } from '../../style-editors/Typography';

export interface DateElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the style editor panel for date design elements.
 */
export const DateElementStyleEditor: React.FC<DateElementStyleEditorProps> = ({
  elementId,
}) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.typography.label" />
        <Typography elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.alignment.label" />
        <TextAlignToggle elementId={elementId} />
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.typography.margin.label" />
          <MarginFields elementId={elementId} />
        </Stack>
      </Stack>
    </>
  );
};
```

Shared sub-components available in `style-editors/`:

| Component               | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `SectionLabel`          | Section heading in the style editor                        |
| `Typography`            | Full typography controls (font, size, weight, color, etc.) |
| `ContainerTypography`   | Subset of typography for container elements                |
| `TextAlignToggle`       | Text alignment toggle                                      |
| `MarginFields`          | Margin inputs (top, right, bottom, left)                   |
| `PaddingFields`         | Padding inputs                                             |
| `SizingFields`          | Width/height controls                                      |
| `Border`                | Border style, width, color, and radius                     |
| `OpacityField`          | Opacity slider                                             |
| `TextPlaceholderField`  | Text placeholder input                                     |
| `PlaceholderImageField` | Placeholder image picker                                   |
| `StaticElementField`    | Static/mappable toggle                                     |

Use `updateDesignElement<T>(elementId, { ... })` from `DesignStudioStore` to persist style changes. The generic parameter is the element's interface type (e.g. `DateElement`, `ImageElement`). This ensures only valid properties for that element type are accepted:

```ts
import { DateElement } from '@minddrop/designs';
import { updateDesignElement } from '../../DesignStudioStore';

// Correct: explicit element type
updateDesignElement<DateElement>(elementId, { format: { dateStyle: 'long' } });

// TypeScript error: 'format' does not exist on ImageElement
updateDesignElement<ImageElement>(elementId, { format: { dateStyle: 'long' } });
```

The updates object is deeply partial one level down: object-valued properties like `style` and `format` accept partial objects, so you can pass e.g. `{ format: { decimals: 3 } }` without providing all fields.

To **read** element-specific properties reactively, use `useElementData` from `DesignStudioStore`. Annotate the callback parameter with the element's flat type to get full type inference on the returned object. `useElementData` uses `useShallow` internally, so the component only re-renders when a selected value actually changes:

```ts
import { useElementData } from '../../DesignStudioStore';
import { FlatDateElement } from '../../types';

const { mode, dateStyle, showTime } = useElementData(
  elementId,
  (element: FlatDateElement) => ({
    mode: element.format?.mode ?? 'date',
    dateStyle: element.format?.dateStyle ?? 'medium',
    showTime: element.format?.showTime ?? false,
  }),
);
```

Consolidate all element reads into a single `useElementData` call rather than using multiple `useDesignStudioStore` selectors.

### 3d. Barrel index

Export the 3 components from `index.ts`:

```ts
// features/designs/src/design-elements/date/index.ts

export { DateDesignElement } from './DateDesignElement';
export { DateStudioDesignElement } from './DateStudioDesignElement';
export { DateElementStyleEditor } from './DateElementStyleEditor';
```

---

## Step 4: Register in the UI registry

Edit `features/designs/src/design-elements/index.ts`.

### 4a. Add imports

Import the 3 components from the element's directory:

```ts
import { DateDesignElement } from './date';
import { DateStudioDesignElement } from './date';
import { DateElementStyleEditor } from './date';
```

Or as a single import:

```ts
import {
  DateDesignElement,
  DateElementStyleEditor,
  DateStudioDesignElement,
} from './date';
```

### 4b. Add registry entry

Add an entry to the `elementUIs` array:

```ts
const elementUIs: ElementUIConfig[] = [
  // ...existing entries
  {
    type: 'date',
    DisplayComponent: asDisplay(DateDesignElement),
    StudioComponent: asStudio(DateStudioDesignElement),
    StyleEditorComponent: DateElementStyleEditor,
  },
];
```

This automatically wires the element into the display dispatcher, studio dispatcher, and style editor panel.

---

## Step 5: Add i18n translations

Add the element's label key (and any other i18n keys used in the style editor) to `packages/i18n/src/locales/en-GB.json`.

The label key from the config (e.g. `design-studio.elements.date`) must have a translation entry.

---

## Checklist

- [ ] Config file created with interface and `DesignElementConfig` (including `generatePlaceholder` if needed)
- [ ] Config registered in `design-element-configs/index.ts` (imports, re-export, unions, array)
- [ ] Element directory created at `features/designs/src/design-elements/<type>/`
- [ ] Display renderer: `[Name]DesignElement.tsx`
- [ ] Studio renderer: `[Name]StudioDesignElement.tsx`
- [ ] Style editor: `[Name]ElementStyleEditor.tsx`
- [ ] Barrel `index.ts` exporting all 3 components
- [ ] Flat type alias added to `FlatDesignElement.types.ts` (if needed)
- [ ] UI registry entry added to `design-elements/index.ts`
- [ ] i18n translations added to `en-GB.json`
- [ ] Placeholder generator added to `placeholder-generators/` (if element has dynamic placeholders)
- [ ] `pnpm i` run (if new dependencies added)
- [ ] `npx prettier --write` on all touched files
- [ ] Typecheck passes: `npx tsc --noEmit -p features/designs/tsconfig.json`
