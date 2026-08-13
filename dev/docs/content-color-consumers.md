# ContentColor consumer inventory

Complete inventory of every consumer of the `ContentColor` concept, captured
during WG 0 (`theme-tokens`) at baseline `6cb5e46f`. The design system rebuild
drops "content colors" as a separate concept and unifies on one color set
(see `design-system-phase-1.md`), so this is the migration checklist for
WGs 2-5.

**Totals: 137 files. 41 reference the `ContentColor` / `ContentColors` /
`ContentColorValues` identifiers directly; the remaining ~96 are CSS maps, i18n
keys, indirect component consumers, and persisted `content-icon:<name>:<color>`
string data.**

## The definitions

There is only **one type definition**. `ui/primitives/src/constants/ContentColor.ts`
does not define a second type; it defines `ContentColorValues` (a
`{ labelKey, value: ContentColor }[]` list for pickers) and imports the type
from `@minddrop/ui-theme`.

| File                                          | Role                                                                                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/theme/src/types/ContentColor.types.ts`    | Canonical union: `'default' \| 'blue' \| 'cyan' \| 'red' \| 'pink' \| 'purple' \| 'green' \| 'orange' \| 'yellow' \| 'brown' \| 'gray'` |
| `ui/theme/src/ContentColors.ts`               | `ContentColors: ContentColor[]`, same 11 values duplicated as a runtime array                                                           |
| `ui/primitives/src/constants/ContentColor.ts` | `ColorValue` interface + `ContentColorValues` (value + i18n `labelKey`), imports type from ui-theme                                     |
| `ui/primitives/src/types/index.ts`            | Pure re-export: `export type { ContentColor } from '@minddrop/ui-theme'`                                                                |

Every consumer imports from `@minddrop/ui-theme` **except two**, which go
through the ui-primitives re-export:

- `data-views/table/src/types/TableView.types.ts`
- `data-views/table/src/TableView/TableView.tsx`

## Consumers by package

### ui/theme (6 files)

| File                              | Usage                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `src/types/ContentColor.types.ts` | Type definition                                                                    |
| `src/types/index.ts`              | Barrel re-export                                                                   |
| `src/ContentColors.ts`            | Runtime array constant                                                             |
| `src/index.ts`                    | Package public export                                                              |
| `src/light.css`                   | Color-to-CSS source of truth: `--blue-100..1200` through `--gray-100..1200` scales |
| `src/dark.css`                    | Same scales for dark theme; also aliases `--info-*` to `--blue-*`                  |

### ui/primitives (23 files)

| File                                                  | Usage                                                                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `src/constants/ContentColor.ts`                       | `ContentColorValues` list driving all pickers/menus                                                                |
| `src/constants/index.ts`                              | Barrel                                                                                                             |
| `src/types/index.ts`                                  | Re-exports `ContentColor` type                                                                                     |
| `src/types/Menu.types.ts`                             | `MenuColorSelectionItemConfig.color: ContentColor` (menu config data)                                              |
| `src/ColorSelect/ColorSelect.tsx`                     | Renders picker; `value?: ContentColor \| string`; builds class `color-select-swatch-${color}`                      |
| `src/ColorSelect/ColorSelect.css`                     | Color-to-CSS map: `.color-select-swatch-*` using `var(--X-600/700)`                                                |
| `src/ColorSelect/ColorSelect.stories.tsx`             | `useState<ContentColor>('blue')`                                                                                   |
| `src/Menu/ColorSelectionMenuItem.tsx`                 | `color: ContentColor \| 'default'`; builds class `color-swatch-${color}`; label lookup via `ContentColorValues`    |
| `src/Menu/Menu.css`                                   | Color-to-CSS map: `.color-selection-menu-item .color-swatch-*`                                                     |
| `src/DropdownMenu/DropdownMenuColorSelectionItem.tsx` | Wraps `ColorSelectionMenuItem`                                                                                     |
| `src/DropdownMenu/DropdownMenuContent.tsx`            | Registers `ColorSelectionItem` in menu generator                                                                   |
| `src/DropdownMenu/index.ts`                           | Exports the color selection item                                                                                   |
| `src/ContextMenu/ContextMenuColorSelectionItem.tsx`   | Wraps `ColorSelectionMenuItem`                                                                                     |
| `src/ContextMenu/ContextMenuContent.tsx`              | Registers `ColorSelectionItem`                                                                                     |
| `src/ContextMenu/index.ts`                            | Exports the color selection item                                                                                   |
| `src/utils/generateMenu/generateMenu.tsx`             | Renders `ColorSelectionItem` from menu config `color`                                                              |
| `src/Chip/Chip.tsx`                                   | `color?: ContentColor`; `propsToClass` yields `chip-color-<name>`                                                  |
| `src/Chip/Chip.css`                                   | Color-to-CSS map: `.chip-color-*` (10 rules)                                                                       |
| `src/ContentIcon/ContentIcon.tsx`                     | `color?: ContentColor \| TextColor \| 'current-color'` via `propsToClass`                                          |
| `src/ContentIcon/ContentIcon.css`                     | Color-to-CSS map: `.content-icon-color-*` (10 rules)                                                               |
| `src/ContentIconPicker/ContentIconPicker.tsx`         | Color grid from `ContentColorValues`; builds `content-icon:${name}:${color}` strings; inline `var(--${color}-900)` |
| `src/IconPicker/IconPicker.tsx`                       | `defaultIconColor?: ContentColor`; emits/parses `content-icon:${icon}:${color}`                                    |
| `src/index.ts`                                        | Exports ColorSelect                                                                                                |

### ui/icons (8 files)

| File                                                      | Usage                                                                                   |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/icons.types.ts`                                      | `UserIconContentIcon.color: ContentColor`, the parsed form of the persisted icon string |
| `src/parseIcon/parseIcon.ts`                              | Parses `content-icon:name:color`, casts `color as ContentColor`                         |
| `src/resolveContentIconColor/resolveContentIconColor.ts`  | Returns `icon.split(':')[2] as ContentColor \| undefined`                               |
| `src/applyContentIconColor/applyContentIconColor.ts`      | Rewrites the color segment of a content-icon string                                     |
| `src/useIcon/useIcon.ts`                                  | Hook result `color?: ContentColor`                                                      |
| `src/IconsApi.ts`                                         | Public API aliases `resolveColor` / `applyColor`                                        |
| `src/applyContentIconColor/applyContentIconColor.test.ts` | Color-literal fixtures                                                                  |
| `src/test-utils/icons.data.ts`                            | Content-icon fixtures with color names                                                  |

### ui/canvas (13 files: 7 source, 6 test)

| File                                                                                                                                                                                                                       | Usage                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/types/CanvasConnection.types.ts`                                                                                                                                                                                      | `CanvasConnection.color?: ContentColor`, persisted connection data              |
| `src/utils/getConnectionColor/getConnectionColor.ts`                                                                                                                                                                       | Color-to-CSS: returns `var(--${color}-600)`                                     |
| `src/utils/getConnectionHaloColor/getConnectionHaloColor.ts`                                                                                                                                                               | Color-to-CSS: returns `var(--${color}-500)`                                     |
| `src/utils/getConnectionMarkerVariants/getConnectionMarkerVariants.ts`                                                                                                                                                     | Builds `${color}-${thickness}` SVG marker ids                                   |
| `src/utils/resolveConnectionStyle/resolveConnectionStyle.ts`                                                                                                                                                               | Resolved style `color: ContentColor` with `'default'` fallback                  |
| `src/utils/index.ts`                                                                                                                                                                                                       | Barrel                                                                          |
| `src/CanvasConnectionsLayer/CanvasConnectionsLayer.tsx`                                                                                                                                                                    | Consumes all four utils; builds `url(#${markerId}-arrow-${color}-${thickness})` |
| Tests: `getConnectionColor.test.ts`, `getConnectionHaloColor.test.ts`, `getConnectionMarkerVariants.test.ts`, `resolveConnectionStyle.test.ts`, `CanvasConnectionsLayer.test.tsx`, `useCanvasConnectionReconnect.test.tsx` | Assert `var(--blue-600)` etc.; color-literal fixtures                           |

### ui/components (1 file)

| File                          | Usage                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| `src/Setting/IconSetting.tsx` | Renders `IconPicker`, round-trips `content-icon:*:*` strings |

### ui/databases (1 file)

| File               | Usage                                     |
| ------------------ | ----------------------------------------- |
| `src/constants.ts` | Default `content-icon:...:default` string |

### packages/designs (4 files)

| File                                 | Usage                                                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/createElementCssStyle.ts`       | Primary color-to-CSS mapper: `colorNames = ContentColors`; local `resolveContentColorCss` yields `var(--${color}-${shade})`; text 900, background 100, border 600, editor + title colors |
| `src/styles/TypographyStyles.ts`     | `color` / `title-color` as `ContentColor \| string`, persisted design style values                                                                                                       |
| `src/styles/index.ts`                | Style defaults incl. `containerBackgroundColor: 'transparent'`, borderColor, `Pick<TypographyStyles, 'color'...>` composition                                                            |
| `src/design-element-configs/icon.ts` | Default `content-icon:*` values                                                                                                                                                          |

### packages/properties (15 files)

| File                                                                                                                                                          | Usage                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/schemas/SelectPropertySchema.ts`                                                                                                                         | `SelectPropertyOption.color: ContentColor`, persisted in property schemas; plus a `content-icon:*:default` string |
| 13 other `src/schemas/*PropertySchema.ts` files (Collection, Created, Date, File, FormattedText, Icon, Image, LastModified, Number, Text, Title, Toggle, Url) | Each has a `content-icon:name:default` string                                                                     |

### packages/databases (18 files)

16 database templates under `src/database-templates/` (Blank, Books, Contacts,
Documents, Expenses, Images, Journal, Movies, Music, Notes, Projects, Recipes,
Tasks, Videos, Vocabulary, Weblinks), plus
`src/test-utils/fixtures/database-entries.fixtures.ts` and
`src/test-utils/fixtures/databases.fixtures.ts`. All persisted seed data
containing `content-icon:<name>:<color>` strings (mostly `:default`; fixtures
use real color names).

### packages/automations / spaces / workspaces (5 files)

`packages/automations/src/constants.ts`,
`packages/automations/src/test-utils/automations.fixtures.ts`,
`packages/spaces/src/constants.ts`, `packages/workspaces/src/constants.ts`,
`packages/workspaces/src/test-utils/workspaces.fixtures.ts`. Default/fixture
`content-icon:*:*` strings.

### packages/i18n (2 files)

| File                      | Usage                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/locales/en-GB.json`  | `color.{default,inherit,transparent,blue,cyan,red,pink,purple,green,orange,yellow,brown,gray}` labels, consumed via `ContentColorValues.labelKey` |
| `src/i18n-resources.d.ts` | Typed mirror of those keys                                                                                                                        |

### packages/editor (0 files)

The `*-color-*` CSS hits there are unrelated.

### features/designs (19 files)

| File                                                            | Usage                                                                                                       |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/utils/resolveContentColorCss.ts`                           | Color-to-CSS map with its own hard-coded `colorNames` array (duplicate of `ContentColors`, minus `default`) |
| `src/utils/resolveBackgroundColorStyle.ts`                      | Shade 100 wrapper                                                                                           |
| `src/utils/resolveBorderColorStyle.ts`                          | Shade 600 wrapper                                                                                           |
| `src/utils/index.ts`                                            | Barrel                                                                                                      |
| `src/style-editors/BorderColorSelect.tsx`                       | `ColorSelect` bound to `borderColor` style; casts to `ContentColor`                                         |
| `src/style-editors/TextColorSelect.tsx`                         | `ColorSelect` + `inherit` extra option, writes text `color` style                                           |
| `src/style-editors/Border.tsx`                                  | Hosts `BorderColorSelect`                                                                                   |
| `src/style-editors/Typography.tsx`                              | Hosts `TextColorSelect`                                                                                     |
| `src/style-editors/ContainerTypography.tsx`                     | Hosts `TextColorSelect`                                                                                     |
| `src/style-editors/IconContentField.tsx`                        | Parses `content-icon:cat:cyan`, extracts color segment into the element's `color` style                     |
| `src/design-elements/badges/BadgesDesignElement.tsx`            | Builds a palette from `ContentColors`; maps to `var(--${color}-400)` / `var(--${color}-1100)`               |
| `src/design-elements/formatted-text/FormatTextStylePopover.tsx` | `ColorSelect` with `(value: ContentColor \| null)` for text color                                           |
| `src/design-elements/icon/IconElementStyleEditor.tsx`           | Two `ColorSelect`s (icon color + container background), casts to `ContentColor`                             |
| `src/design-elements/icon/IconPlaceholderField.tsx`             | Renders `ContentIcon` for placeholder icons                                                                 |
| `src/design-elements/icon/IconStudioDesignElement.tsx`          | Content-icon strings + `ContentIcon`                                                                        |
| `src/design-elements/container/BackgroundColorSelect.tsx`       | `ColorSelect` + `transparent` extra option, writes `backgroundColor` style                                  |
| `src/design-elements/container/ContainerElementStyleEditor.tsx` | Hosts `BackgroundColorSelect`                                                                               |
| `src/design-elements/view/ViewElementStyleEditor.tsx`           | Hosts `BackgroundColorSelect`                                                                               |
| `src/constants.ts`                                              | Default `content-icon:*` string                                                                             |

### features/properties (4 files)

| File                                                                    | Usage                                                                                                                                                    |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/PropertyEditor/SelectPropertyEditor/SelectPropertyEditor.tsx`      | Auto-assigns unused colors from `ContentColorValues`; writes option colors into the persisted schema; builds class `option-color-swatch-${option.color}` |
| `src/PropertyEditor/SelectPropertyEditor/SelectPropertyEditor.css`      | Color-to-CSS map: `.option-color-swatch-*`                                                                                                               |
| `src/PropertyEditor/SelectPropertyEditor/SelectPropertyEditor.test.tsx` | Color-literal assertions                                                                                                                                 |
| `src/PropertyEditor/PropertyEditorBase/PropertyEditorBase.tsx`          | Renders `ContentIcon` (indirect)                                                                                                                         |

### Other features (13 files, indirect)

`content-icon:*` strings or `ContentIcon` / `IconPicker` rendering:

- `features/collections/src/CollectionsView/CollectionDetails.tsx`
- `features/collections/src/initializeCollectionsFeature/initializeCollectionsFeature.ts`
- `features/data-views/src/initializeDataViewsFeature/initializeDataViewsFeature.ts`
- `features/data-views/src/DataViewRenderer/DataViewRenderer.tsx`
- `features/databases/src/DatabaseSettingsPanel/DatabaseSettingsPanel.tsx`
- `features/databases/src/DatabasesSidebarMenu/DatabasesSidebarMenu.tsx`
- `features/databases/src/NewDatabaseDialog/NewDatabaseDialog.tsx`
- `features/databases/src/DatabaseEntryTemplateEditor/DatabaseEntryTemplatePropertyField.tsx`
- `features/queries/src/constants.ts`
- `features/search/src/SearchResultItem/SearchResultItem.tsx`
- `features/spaces/src/NewSpaceDialog/NewSpaceDialog.tsx`
- `features/views/src/tabs/getTabIcon/getTabIcon.tsx`
- `features/onboarding/src/CreateWorkspaceForm/CreateWorkspaceForm.tsx`

### data-views/table (4 files)

| File                               | Usage                                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/types/TableView.types.ts`     | `TableSelectOption.color?: ContentColor` (imported from ui-primitives), persisted view config |
| `src/TableView/TableView.tsx`      | Inline `options?: { value: string; color?: ContentColor }[]` (from ui-primitives)             |
| `src/SelectCell/SelectCell.tsx`    | `<Chip color={option.color \|\| 'default'}>`                                                  |
| `src/SelectCell/SelectDisplay.tsx` | `<Chip color={option?.color \|\| 'default'}>`                                                 |

### data-views/canvas (1 file)

| File                                                      | Usage                                                                                                                                        |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/CanvasConnectionToolbar/CanvasConnectionToolbar.tsx` | Iterates `ContentColors` for a swatch menu; writes `{ color }` to the connection (persisted); swatch preview via `getConnectionColor(color)` |

### apps/\* (0 files)

No `ContentColor` usage.

## Cross-cutting summaries

### A. Values persisted in stored data

Per the no-migrations policy stored data is disposable, but these are the
places where the _schema_ meets color names:

1. `packages/properties/src/schemas/SelectPropertySchema.ts` -
   `SelectPropertyOption.color: ContentColor`
2. `data-views/table/src/types/TableView.types.ts` -
   `TableSelectOption.color?: ContentColor`
3. `ui/canvas/src/types/CanvasConnection.types.ts` -
   `CanvasConnection.color?: ContentColor` (written by `CanvasConnectionToolbar`)
4. The `content-icon:<name>:<color>` string encoding (`ui/icons/src/icons.types.ts`),
   produced by `IconPicker` / `ContentIconPicker`, parsed by `parseIcon` /
   `resolveContentIconColor`, rewritten by `applyContentIconColor`. Stored
   across all database templates, property schemas, and the
   automations/spaces/workspaces/features constants
5. `packages/designs/src/styles/TypographyStyles.ts` - `color` / `title-color`
   as `ContentColor \| string`; also `borderColor`, `backgroundColor`,
   `containerBackgroundColor` string fields in `packages/designs/src/styles/index.ts`
6. `ui/primitives/src/types/Menu.types.ts` - `MenuColorSelectionItemConfig.color`
   (config data flowing from persisted values)

Everything else is render-time only.

### B. Color-to-CSS mappings (every place a scale rename must touch)

CSS variable definitions (source of truth):

- `ui/theme/src/light.css`
- `ui/theme/src/dark.css`

Runtime string interpolation `var(--${color}-N)`:

- `packages/designs/src/createElementCssStyle.ts` (shades 100 / 600 / 900)
- `features/designs/src/utils/resolveContentColorCss.ts` (+ `resolveBackgroundColorStyle.ts` 100, `resolveBorderColorStyle.ts` 600)
- `features/designs/src/design-elements/badges/BadgesDesignElement.tsx` (400 / 1100)
- `ui/canvas/src/utils/getConnectionColor/getConnectionColor.ts` (600)
- `ui/canvas/src/utils/getConnectionHaloColor/getConnectionHaloColor.ts` (500)
- `ui/primitives/src/ContentIconPicker/ContentIconPicker.tsx` (900)

Static CSS classes keyed on color name:

- `ui/primitives/src/Chip/Chip.css` (`.chip-color-*`)
- `ui/primitives/src/ContentIcon/ContentIcon.css` (`.content-icon-color-*`)
- `ui/primitives/src/ColorSelect/ColorSelect.css` (`.color-select-swatch-*`)
- `ui/primitives/src/Menu/Menu.css` (`.color-selection-menu-item .color-swatch-*`)
- `features/properties/src/PropertyEditor/SelectPropertyEditor/SelectPropertyEditor.css` (`.option-color-swatch-*`)

Class-name construction in TS (paired with the CSS above):

- `ui/primitives/src/ColorSelect/ColorSelect.tsx`
- `ui/primitives/src/Menu/ColorSelectionMenuItem.tsx`
- `ui/primitives/src/Chip/Chip.tsx` (via `propsToClass`)
- `ui/primitives/src/ContentIcon/ContentIcon.tsx` (via `propsToClass`)
- `features/properties/src/PropertyEditor/SelectPropertyEditor/SelectPropertyEditor.tsx`

Duplicated color-name lists (drift risk, unify in the rebuild):

- `ui/theme/src/types/ContentColor.types.ts` (type)
- `ui/theme/src/ContentColors.ts` (array)
- `ui/primitives/src/constants/ContentColor.ts` (`ContentColorValues`)
- `features/designs/src/utils/resolveContentColorCss.ts` (private `colorNames`, omits `default`)
- `packages/i18n/src/locales/en-GB.json` + `packages/i18n/src/i18n-resources.d.ts` (label keys)

### C. File counts

| Package                                    | Files   |
| ------------------------------------------ | ------- |
| ui/theme                                   | 6       |
| ui/primitives                              | 23      |
| ui/icons                                   | 8       |
| ui/canvas                                  | 13      |
| ui/components                              | 1       |
| ui/databases                               | 1       |
| packages/designs                           | 4       |
| packages/properties                        | 15      |
| packages/databases                         | 18      |
| packages/automations / spaces / workspaces | 5       |
| packages/i18n                              | 2       |
| features/designs                           | 19      |
| features/properties                        | 4       |
| other features                             | 13      |
| data-views/table                           | 4       |
| data-views/canvas                          | 1       |
| apps/\*                                    | 0       |
| **Total**                                  | **137** |
