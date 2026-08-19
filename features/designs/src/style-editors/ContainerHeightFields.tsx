import {
  AspectRatio,
  FillRatio,
  HeightValue,
  LandscapeAspectRatios,
  PortraitAspectRatios,
  SizeToken,
  SizeTokens,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { Stack } from '@minddrop/ui-primitives';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from './OptionToggleField';
import { ScaleField } from './ScaleField';
import {
  aspectRatioOptionKey,
  fieldLabelKey,
  fillRatioKey,
  sizeHintKey,
  sizeOptionKey,
} from './styleI18nKeys';
import { StyleEditor } from './useStyleEditor';

/**
 * How a container is sized vertically: by its content, to a height
 * of its own, by the space left around it, or by its width.
 */
type HeightMode = 'auto' | 'fixed' | 'fill' | 'ratio';

/**
 * The shapes a proportioned container takes.
 */
type Orientation = 'portrait' | 'square' | 'landscape';

/**
 * The style keys the height block writes to.
 */
export const HeightStyleKeys: string[] = [
  'height',
  'fillRatio',
  'minHeight',
  'maxHeight',
  'aspectRatio',
];

// The height a container takes when first fixed, which is the same
// step embeds default to
const DefaultFixedHeight: HeightValue = 'md';

const HeightModeOptions: OptionToggleFieldOption<HeightMode>[] = [
  {
    value: 'auto',
    label: 'designsStudio.style.height.mode.auto.label',
    description: 'designsStudio.style.height.mode.auto.description',
  },
  {
    value: 'fixed',
    label: 'designsStudio.style.height.mode.fixed.label',
    description: 'designsStudio.style.height.mode.fixed.description',
  },
  {
    value: 'fill',
    label: 'designsStudio.style.height.mode.fill.label',
    description: 'designsStudio.style.height.mode.fill.description',
  },
  {
    value: 'ratio',
    label: 'designsStudio.style.height.mode.ratio.label',
    description: 'designsStudio.style.height.mode.ratio.description',
  },
];

const OrientationOptions: OptionToggleFieldOption<Orientation>[] = [
  { value: 'portrait', label: 'designsStudio.style.orientation.portrait' },
  { value: 'square', label: 'designsStudio.style.orientation.square' },
  { value: 'landscape', label: 'designsStudio.style.orientation.landscape' },
];

// The shape each orientation starts on: the proportions of a book
// cover and of a photograph, which are the shapes most reached for
const DefaultPortraitRatio: AspectRatio = '2/3';
const DefaultLandscapeRatio: AspectRatio = '3/2';

// The shares a filling container can take of the space it splits
// with the other filling containers beside it
const FillRatios: readonly FillRatio[] = [1, 2, 3, 4];

// The empty option of each bound, where an unset value reads as no
// limit rather than as an inherited one
const NoMinimum = {
  label: 'designsStudio.style.height.noMinimum.label',
} as const;

const NoMaximum = {
  label: 'designsStudio.style.height.noMaximum.label',
} as const;

export interface ContainerHeightFieldsProps {
  /**
   * The style editing helpers for the element being styled.
   */
  editor: StyleEditor;

  /**
   * Whether the container can fill the space around it, which a
   * layout's root cannot: it has no siblings to share with.
   * @default true
   */
  canFill?: boolean;

  /**
   * Whether the floor and cap bounds are offered. Image elements
   * omit them, since their style carries no bound keys.
   * @default true
   */
  bounds?: boolean;
}

/**
 * Renders the container height block: whether the container is
 * sized by its content or given a height of its own, and the
 * bounds of a content sized one. A floor is what keeps an empty
 * card from collapsing, a cap what keeps a full one from running
 * away.
 */
export const ContainerHeightFields: React.FC<ContainerHeightFieldsProps> = ({
  editor,
  canFill = true,
  bounds = true,
}) => {
  const { isEditable, getValue, setValue } = editor;

  // The modes on offer, which is every one but filling for a
  // container with nothing to fill
  const modeOptions = canFill
    ? HeightModeOptions
    : HeightModeOptions.filter((option) => option.value !== 'fill');

  const height = getValue<HeightValue>('height');
  const aspectRatio = getValue<AspectRatio>('aspectRatio');

  const mode = resolveHeightMode(height, aspectRatio);
  const orientation = resolveOrientation(aspectRatio);

  // Only a container free to take a height of its own can be sized
  // any way but by its content, so a role which sets one leaves
  // the bounds alone
  const canSize = isEditable('height');

  // Switching mode drops the values the other modes own, so no two
  // of them can contradict each other
  function handleModeChange(nextMode: HeightMode) {
    // A cap only bounds a container sized by its content
    if (nextMode !== 'auto') {
      setValue('maxHeight', undefined);
    }

    // A share is only taken while filling
    if (nextMode !== 'fill') {
      setValue('fillRatio', undefined);
    }

    // Proportions are the one mode which sets no height of its own
    if (nextMode !== 'ratio') {
      setValue('aspectRatio', undefined);
    }

    if (nextMode === 'fixed') {
      // A fixed height leaves nothing for a floor to hold up
      setValue('minHeight', undefined);
      setValue('height', DefaultFixedHeight);

      return;
    }

    if (nextMode === 'ratio') {
      // Proportions leave nothing for a floor to hold up either
      setValue('minHeight', undefined);
      setValue('height', undefined);

      // Proportions open on the portrait shape, the one cards are
      // most often given
      setValue('aspectRatio', aspectRatio ?? DefaultPortraitRatio);

      return;
    }

    setValue('height', nextMode === 'fill' ? 'fill' : undefined);
  }

  // Each orientation opens on the shape most reached for in it,
  // rather than on whichever end of its scale
  function handleOrientationChange(nextOrientation: Orientation) {
    if (nextOrientation === 'portrait') {
      setValue('aspectRatio', DefaultPortraitRatio);

      return;
    }

    if (nextOrientation === 'landscape') {
      setValue('aspectRatio', DefaultLandscapeRatio);

      return;
    }

    setValue('aspectRatio', '1/1');
  }

  // Raising the floor past the cap carries the cap up with it,
  // rather than leaving a cap which bounds nothing
  function handleMinHeightChange(minHeight: SizeToken | undefined) {
    setValue('minHeight', minHeight);

    const maxHeight = getValue<SizeToken>('maxHeight');

    if (!minHeight || !maxHeight) {
      return;
    }

    if (SizeTokens.indexOf(maxHeight) < SizeTokens.indexOf(minHeight)) {
      setValue('maxHeight', minHeight);
    }
  }

  return (
    <Stack gap={3}>
      {canSize && (
        <OptionToggleField
          label={fieldLabelKey('height')}
          options={modeOptions}
          value={mode}
          onChange={handleModeChange}
        />
      )}

      {/** A fixed container takes the height it is given **/}
      {canSize && mode === 'fixed' && (
        <ScaleField
          label={fieldLabelKey('fixedHeight')}
          steps={SizeTokens}
          value={height === 'fill' ? undefined : height}
          stepLabelKey={sizeLabelKey}
          stepHintKey={sizeHintKey}
          decreaseLabel="designsStudio.style.height.decrease"
          increaseLabel="designsStudio.style.height.increase"
          onChange={(value) => setValue('height', value)}
        />
      )}

      {/** A proportioned one takes the shape it is given **/}
      {canSize && mode === 'ratio' && (
        <>
          <OptionToggleField
            label={fieldLabelKey('orientation')}
            options={OrientationOptions}
            value={orientation}
            onChange={handleOrientationChange}
          />
          {orientation !== 'square' && (
            <ScaleField
              label={fieldLabelKey('aspectRatio')}
              steps={
                orientation === 'portrait'
                  ? PortraitAspectRatios
                  : LandscapeAspectRatios
              }
              value={aspectRatio}
              stepLabelKey={aspectRatioLabelKey}
              decreaseLabel="designsStudio.style.aspectRatioSteps.decrease"
              increaseLabel="designsStudio.style.aspectRatioSteps.increase"
              onChange={(value) => setValue('aspectRatio', value)}
            />
          )}
        </>
      )}

      {/** A filling one takes its share of the space it splits **/}
      {canSize && mode === 'fill' && (
        <ScaleField
          label={fieldLabelKey('fillRatio')}
          steps={FillRatios}
          value={getValue<FillRatio>('fillRatio') ?? 1}
          stepLabelKey={fillRatioLabelKey}
          decreaseLabel="designsStudio.style.fillRatio.decrease"
          increaseLabel="designsStudio.style.fillRatio.increase"
          onChange={(value) => setValue('fillRatio', value)}
        />
      )}

      {/** Both are held up by the floor they are given. A
       * proportioned container is sized by its width, which a floor
       * cannot be enforced against **/}
      {bounds && mode !== 'fixed' && mode !== 'ratio' && (
        <>
          {isEditable('minHeight') && (
            <ScaleField
              label={fieldLabelKey('minHeight')}
              steps={SizeTokens}
              value={getValue<SizeToken>('minHeight')}
              stepLabelKey={sizeLabelKey}
              stepHintKey={sizeHintKey}
              emptyOption={NoMinimum}
              decreaseLabel="designsStudio.style.height.decrease"
              increaseLabel="designsStudio.style.height.increase"
              onChange={handleMinHeightChange}
            />
          )}
          {mode === 'auto' && isEditable('maxHeight') && (
            <ScaleField
              label={fieldLabelKey('maxHeight')}
              steps={SizeTokens}
              value={getValue<SizeToken>('maxHeight')}
              stepLabelKey={sizeLabelKey}
              stepHintKey={sizeHintKey}
              emptyOption={NoMaximum}
              lowestStep={getValue<SizeToken>('minHeight')}
              decreaseLabel="designsStudio.style.height.decrease"
              increaseLabel="designsStudio.style.height.increase"
              onChange={(value) => setValue('maxHeight', value)}
            />
          )}
        </>
      )}
    </Stack>
  );
};

/**
 * Resolves the label key of a box size step.
 */
function sizeLabelKey(token: SizeToken): TranslationKey {
  return sizeOptionKey(token, 'label');
}

/**
 * Resolves the label key of a fill ratio step.
 */
function fillRatioLabelKey(ratio: FillRatio): TranslationKey {
  return fillRatioKey(ratio, 'label');
}

/**
 * Resolves the label key of an aspect ratio step.
 */
function aspectRatioLabelKey(ratio: AspectRatio): TranslationKey {
  return aspectRatioOptionKey(ratio, 'label');
}

/**
 * Resolves the shape a ratio gives a container.
 */
function resolveOrientation(ratio: AspectRatio | undefined): Orientation {
  if (!ratio || ratio === '1/1') {
    return 'square';
  }

  return PortraitAspectRatios.includes(ratio) ? 'portrait' : 'landscape';
}

/**
 * Resolves the mode a height value puts the container in.
 */
function resolveHeightMode(
  height: HeightValue | undefined,
  aspectRatio: AspectRatio | undefined,
): HeightMode {
  // Proportions size the container whatever else is set
  if (aspectRatio) {
    return 'ratio';
  }

  if (height === 'fill') {
    return 'fill';
  }

  // Any other height is one the container was given
  if (height) {
    return 'fixed';
  }

  return 'auto';
}
