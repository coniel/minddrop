# Theme tokens

The design token system defined in `ui/theme/src/tokens/`. Built in WG 0
(`theme-tokens`) of the design system rebuild; this is the vocabulary the
design system, the studio (WG 3) and consumer theming (WG 6) are built on.
Rationale lives in `design-system.md` / `design-system-phase-1.md` in the
dev plans.

## File map

| File                                                   | Contents                                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens/palette-light.css` / `tokens/palette-dark.css` | The 16 twelve-step color scales (neutral, primary, danger, warning, info, success + 10 palette hues), `--app-background`, `--surface-scrim` |
| `tokens/roles.css`                                     | The accent channel and every semantic color role (`--text-*`, `--surface-*`, `--border-*`)                                                  |
| `tokens/schemes.css`                                   | `.scheme-<hue>` container classes that rebind the accent channel                                                                            |
| `tokens/typography.css`                                | Font families, `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`, `--measure-*`                                   |
| `tokens/sizing.css`                                    | `--space-*`, `--radius-*` (both unit-scalable), `--size-*`, `--border-width-*`, `--icon-size-*`                                             |
| `tokens/elevation.css`                                 | `--shadow-*` scale and semantic aliases, per theme                                                                                          |
| `tokens/app.css`                                       | App-internal tokens excluded from the design vocabulary: control heights, focus ring, `--opacity-disabled`, `--level-*`, motion             |

## Core model: role vs hue

- A **role** names what a thing is (`--text-muted`, `--surface-raised`,
  `--border-subtle`). The theme decides the shade. Components and designs
  only ever reference roles, never scale steps.
- A **hue** (blue, red, green) is which accent. It is never a style option on
  an element: it is a scheme applied to a container.
- **Hue is a parameter of the role.** `.scheme-red` on a container rebinds the
  `--accent-*` channel, and every schemable role inside resolves against red
  instead of neutral. "This card is red" and "this database is mono" are the
  same mechanism.

### Role families

- **Schemable** (resolve through `--accent-*`, which defaults to neutral):
  `--text-regular/muted/subtle/placeholder/disabled/on-solid`,
  `--surface-subtle/raised/overlay/skeleton/accent*/solid-accent*`,
  `--border-subtle/default/strong/hover`.
- **Intent, fixed**: `danger`, `warning`, `info`, `success` families. Always
  resolve to their own scales; they carry meaning, not decoration.
- **Brand, fixed**: the `primary` family plus `--surface-selected` /
  `--border-selected`. Fixed so every tinted container keeps the same anchor
  for "this is the primary action".

`--surface-app` is fixed to `--app-background` and does not rebind under
schemes; scheme containers wanting a tinted ground use `--surface-subtle`.

Red-on-red is accepted: a danger button on a red-schemed card still passes
contrast but stops reading as danger. That is a user choice, not something the
system engineers around.

### The scheme re-anchoring gotcha

CSS resolves `var()` references inside a custom property **at the element
where that property is declared**, not where it is consumed. Roles declared on
the theme root therefore lock to the root's accent bindings, and a descendant
rebinding `--accent-*` would change nothing. `schemes.css` handles this by
re-declaring the schemable roles inside every `.scheme-*` scope, forcing
re-resolution there. Consequences:

- Adding a schemable role means adding it in **both** `roles.css` and the
  shared re-anchor rule in `schemes.css`.
- Anything else that rebinds `--accent-*` on a container (WG 6 consumer
  theming) must also re-anchor the schemable roles, or apply a `.scheme-*`
  class which already does.
- The same trap exists for **inherited properties**: text inside a scheme
  inherits its computed `color` from the app body (declared outside the
  scheme), so the re-anchored `--text-regular` never reaches it on its own.
  The shared scheme rule therefore also declares `color: var(--text-regular)`
  so color-less text re-resolves at the scheme scope.

## Scalable spacing and radius

Spacing and radius resolve through overridable units:

- `--space-unit` (4px): `--space-N: calc(var(--space-unit) * multiplier)`.
  Step names are scale indices, not multiples: steps 1 to 4 are linear
  (1, 2, 3, 4 units), the top steps grow faster (5 to 8 are 6, 8, 12, 16
  units). Fractional indices (`--space-0-5`, `--space-0-75`, `--space-1-5`)
  fill the sub-unit range. `--space-px` is a fixed 1px and deliberately does
  not scale.
- `--radius-unit` (1px): steps are 3, 4, 6, 8, 12 units; `--radius-full` is
  999 units so it stays fully round under any positive unit and squares off
  when the unit is zeroed.

A container override like `--space-unit: 0.2rem` ("compact") or
`--radius-unit: 0` ("sharp") rescales everything inside with no participation
from designs. Density must clamp on touch surfaces (a WG 6 concern).

## Box sizes

`--size-xs..2xl` (80/128/192/256/320/480px, added in WG 2) are coarse box
sizes for content areas: cover-image heights, embed heights, media frames.
Fixed rem, deliberately not resolved through `--space-unit`, so content boxes
keep their size when a container goes compact. The designs vocabulary uses
them wherever legacy designs had free numeric width/height fields.

## Migration from the legacy tokens (complete)

WG 1 (`theme-tokens-migration`) migrated every consumer and deleted the
legacy files (`tokens.css`, `light.css`, `dark.css`). The non-token base
styles that lived at the bottom of legacy `tokens.css` (cursor rules, `body`
styles) now live in `src/base.css`. WG 1 also adopted the sweep-driven
tokens at their motivating raw-value sites (focus rings, control heights,
disabled opacity, scrim backdrops, border widths, icon sizes, letter
spacing, measures, opacity transitions) and moved raw primary-step
selection styling onto `--surface-selected` / `--border-selected` /
`--surface-primary-subtle`. Deliberate exceptions that keep scale steps or
raw values: content-color classes (ContentIcon, pickers), scrollbar thumb
translucents, and FloatingActionButton's fixed light-mode palette. The
rename record, kept for reference:

1. **Carried over, same meaning** (same name, same value): the color roles
   (`--text-muted`, `--surface-raised`, `--border-default`, ...),
   `--space-1..7`, `--radius-xs..full`, `--shadow-sm/md/lg/raised/overlay`,
   font families, `--level-*`, `--duration-*`, `--ease-*`,
   `--transition-colors`.
2. **Renamed** (consumers migrated by WG 1):

   | Legacy                              | New                                  |
   | ----------------------------------- | ------------------------------------ |
   | `--text-xs` (12px)                  | `--font-size-xs`                     |
   | `--text-sm` (13px)                  | `--font-size-sm`                     |
   | `--text-base` (14px)                | `--font-size-base`                   |
   | `--text-md` (16px)                  | `--font-size-md`                     |
   | `--text-lg` (20px)                  | `--font-size-xl`                     |
   | `--text-xl` (24px)                  | `--font-size-2xl`                    |
   | `--text-2xl` (31px)                 | `--font-size-4xl` (now 32px)         |
   | `--weight-normal`                   | `--font-weight-regular`              |
   | `--weight-medium/semibold/bold`     | `--font-weight-medium/semibold/bold` |
   | `--leading-tight/snug/normal`       | `--line-height-tight/snug/normal`    |
   | `--icon-size-default` (18px)        | `--icon-size-md`                     |
   | `--surface-neutral(-hover/-active)` | `--surface-accent(-hover/-active)`   |
   | `--surface-solid-neutral(-hover)`   | `--surface-solid-accent(-hover)`     |

   Note the size-name shift: legacy `lg/xl/2xl` map to new `xl/2xl/4xl`, and
   the page title rounds from 31px to 32px (expect a 1px visual shift when
   migrating).

3. **Legacy-only, dropped** (not part of the new vocabulary): filled control
   variant backgrounds (`--surface-paper`) were mapped to `--surface-overlay`
   (slight shift: pure white to accent-100 in light, one step darker in dark);
   checkbox/radio marks (`--contrast-color`) were mapped to `--text-on-solid`.
   `--contrast-color-light` had no consumers outside the legacy theme files.

## Settled decisions (WG 0)

1. **`--text-*` collision**: the font scale renamed to `--font-size-*`; the
   color roles keep the short `--text-*` names users meet as vocabulary.
2. **Spacing/radius scaling**: multiplier mechanism (overridable unit +
   `calc`), not discrete value sets. One override scales a container; discrete
   sets would need every consumer to know the density name.
3. **Content type scale**: extended to 11 steps (11 to 40px). Sweep evidence:
   the editor's H3 collided with body (both 16px), nothing existed between
   24 and 31px or above 31px, and body leading capped at 1.5. New 18/28/32/40px
   steps and `relaxed`/`loose` line heights fix the content-sparse half.
4. **Accent vs `--surface-neutral-*`**: the neutral interactive surface family
   is renamed to `--surface-accent-*` and made schemable. "Neutral" as a
   surface name is gone from the new vocabulary.

## New tokens driven by the sweep

Every addition traces to repeated raw values found in the codebase sweep
(counts at baseline `6cb5e46f`):

- `--font-size-2xs` (11px chip labels), `--font-size-lg/3xl/4xl/5xl`
- `--line-height-none` (17 raw `line-height: 1`), `-relaxed`, `-loose`
- `--letter-spacing-*` (uppercase-label recipe drifting between 0.03 and
  0.08em across components)
- `--space-px/0-5/0-75/1-5` (~50 raw 1/2/3/6px spacing values), `--space-8`
- `--border-width-thin/medium/thick` (~88 raw 1px borders, 17 raw 2px)
- `--icon-size-2xs..xl` (raw 12/14/16/24/40px icon sizes; only 18px had a
  token)
- `--measure-narrow/content/wide` (raw 380/640/860px reading widths)
- `--shadow-xs` (byte-identical thumb shadow in Slider and Switch)
- `--surface-scrim` (hand-rolled dialog backdrops), `--surface-selected` /
  `--border-selected` (raw `--primary-400/700` selection styling),
  `--surface-primary-subtle` (calendar range fills)
- App-internal: `--control-height-sm/md/lg` (the 24/28/36px triple re-declared
  in 9 components), `--focus-ring-*` (10 hand-rolled focus rings),
  `--opacity-disabled` (18 raw `0.45`), `--transition-opacity` (~20 hand-rolled
  opacity transitions)

## Invariant

Every scale keeps consistent step semantics: step 1200 text on step 300
background is accessible in every scale, in both themes. Contrast then holds
across hues for free, and phase 2 has a rule to validate user-defined scales
against. Semantic roles must always resolve through the scales (or the accent
channel); no role may point at a raw color value.
