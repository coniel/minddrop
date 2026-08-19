import {
  BackdropBlur,
  BackdropBlurs,
  BackdropFadeDirection,
  BackdropTint,
  BackdropTintStrength,
  BackdropTintStrengths,
  BackdropTints,
} from '@minddrop/designs';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { InputLabel, Slider, Stack } from '@minddrop/ui-primitives';
import { BooleanToggleField } from '../BooleanToggleField';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from '../OptionToggleField';
import { ScaleField } from '../ScaleField';
import { fieldLabelKey } from '../styleI18nKeys';
import { StyleEditor } from '../useStyleEditor';
import './BackdropFields.css';

// The style keys the backdrop fields manage
export const BackdropStyleKeys: string[] = [
  'backdropBlur',
  'backdropTint',
  'backdropTintStrength',
  'backdropBrightness',
  'backdropFade',
  'backdropFadeDirection',
  'backdropFadeStart',
  'backdropFadeExtent',
];

const backdropBlurKey = createI18nKeyBuilder(
  'designsStudio.style.backdropBlur.',
);

// The blur strengths on offer. No blur is not an option: the
// collapsed section is what no blur means
const BlurOptions: OptionToggleFieldOption<BackdropBlur>[] = BackdropBlurs.map(
  (blur) => ({
    value: blur,
    label: backdropBlurKey(blur, 'label'),
    description: backdropBlurKey(blur, 'description'),
  }),
);

const backdropTintKey = createI18nKeyBuilder(
  'designsStudio.style.backdropTint.',
);

const tintStrengthKey = createI18nKeyBuilder(
  'designsStudio.style.backdropTintStrength.',
);

// The tint options: an unset tint reads as the explicit none
type TintOption = 'none' | BackdropTint;

// The colour washes the blur can be tinted with, opening with the
// option leaving it uncoloured
const TintOptions: OptionToggleFieldOption<TintOption>[] = [
  {
    value: 'none',
    label: backdropTintKey('none', 'label'),
    description: backdropTintKey('none', 'description'),
  },
  ...BackdropTints.map((tint) => ({
    value: tint,
    label: backdropTintKey(tint, 'label'),
    description: backdropTintKey(tint, 'description'),
  })),
];

// How strongly the tint colours the blur
const TintStrengthOptions: OptionToggleFieldOption<BackdropTintStrength>[] =
  BackdropTintStrengths.map((strength) => ({
    value: strength,
    label: tintStrengthKey(strength, 'label'),
    description: tintStrengthKey(strength, 'description'),
  }));

// The brightness steps on offer, from blacked out to doubled
const BrightnessSteps: readonly number[] = Array.from(
  { length: 21 },
  (_, index) => index * 10,
);

// The directions the fade can run in, shown as the arrow the
// faded-out end points at
const FadeDirectionOptions: OptionToggleFieldOption<BackdropFadeDirection>[] = [
  {
    value: 'to-top',
    label: 'designsStudio.style.fadeDirection.to-top',
    icon: 'arrow-up',
  },
  {
    value: 'to-bottom',
    label: 'designsStudio.style.fadeDirection.to-bottom',
    icon: 'arrow-down',
  },
  {
    value: 'to-left',
    label: 'designsStudio.style.fadeDirection.to-left',
    icon: 'arrow-left',
  },
  {
    value: 'to-right',
    label: 'designsStudio.style.fadeDirection.to-right',
    icon: 'arrow-right',
  },
];

export interface BackdropFieldsProps {
  /**
   * The style editing helpers for the element being styled.
   */
  editor: StyleEditor;
}

/**
 * Renders the backdrop effect fields: the blur preset and backdrop
 * brightness, and the fade controls softening the effects out
 * across the container once a blur is set.
 */
export const BackdropFields: React.FC<BackdropFieldsProps> = ({ editor }) => {
  const { t } = useTranslation();
  const { isEditable, getValue, setValue } = editor;

  const blur = getValue<BackdropBlur>('backdropBlur');
  const tint = getValue<BackdropTint>('backdropTint');
  const fade = getValue<boolean>('backdropFade');

  // Choosing none clears the key, and its strength with it, so no
  // hidden value lingers behind an uncoloured blur
  function handleTintChange(value: TintOption) {
    setValue('backdropTint', value === 'none' ? undefined : value);

    if (value === 'none') {
      setValue('backdropTintStrength', undefined);
    }
  }

  // The regular default is stored as an unset key
  function handleTintStrengthChange(value: BackdropTintStrength) {
    setValue('backdropTintStrength', value === 'regular' ? undefined : value);
  }

  // The unchanged brightness is stored as an unset key, since it
  // emits no filter
  function handleBrightnessChange(value: number | undefined) {
    setValue('backdropBrightness', value === 100 ? undefined : value);
  }

  // Switching the fade off drops its direction and extent, so no
  // hidden values linger behind the switch
  function handleFadeChange(value: true | undefined) {
    setValue('backdropFade', value);

    if (!value) {
      setValue('backdropFadeDirection', undefined);
      setValue('backdropFadeStart', undefined);
      setValue('backdropFadeExtent', undefined);
    }
  }

  // The upward default is stored as an unset key
  function handleFadeDirectionChange(direction: BackdropFadeDirection) {
    setValue(
      'backdropFadeDirection',
      direction === 'to-top' ? undefined : direction,
    );
  }

  // The defaults are stored as unset keys: a fade starting at the
  // edge and fully faded out halfway across
  function handleFadeRangeChange(value: number | number[]) {
    const [start, extent] = Array.isArray(value) ? value : [0, value];

    setValue('backdropFadeStart', start === 0 ? undefined : start);
    setValue('backdropFadeExtent', extent === 50 ? undefined : extent);
  }

  return (
    <>
      {/** The strength of the frost behind the surface **/}
      {isEditable('backdropBlur') && (
        <OptionToggleField
          options={BlurOptions}
          value={blur}
          onChange={(value) => setValue('backdropBlur', value)}
        />
      )}

      {/** The colour wash tinting the frost, which only shows on a
       * blur **/}
      {blur && isEditable('backdropTint') && (
        <OptionToggleField
          label={fieldLabelKey('backdropTint')}
          options={TintOptions}
          value={tint ?? 'none'}
          onChange={handleTintChange}
        />
      )}
      {blur && tint && isEditable('backdropTintStrength') && (
        <OptionToggleField
          label={fieldLabelKey('backdropTintStrength')}
          options={TintStrengthOptions}
          value={
            getValue<BackdropTintStrength>('backdropTintStrength') ?? 'regular'
          }
          onChange={handleTintStrengthChange}
        />
      )}

      {/** Darkening or lightening what shows through the frost **/}
      {isEditable('backdropBrightness') && (
        <ScaleField
          label={fieldLabelKey('backdropBrightness')}
          steps={BrightnessSteps}
          value={getValue<number>('backdropBrightness') ?? 100}
          stepStringLabel={brightnessLabel}
          decreaseLabel="designsStudio.style.backdropBrightness.decrease"
          increaseLabel="designsStudio.style.backdropBrightness.increase"
          onChange={handleBrightnessChange}
        />
      )}

      {/** The fade only softens a blur, so it waits for one **/}
      {blur && isEditable('backdropFade') && (
        <BooleanToggleField
          label={fieldLabelKey('backdropFade')}
          value={fade}
          onChange={handleFadeChange}
        />
      )}

      {/** Where the fade runs to and how far it reaches **/}
      {blur && fade && isEditable('backdropFadeDirection') && (
        <OptionToggleField
          label={fieldLabelKey('backdropFadeDirection')}
          options={FadeDirectionOptions}
          value={
            getValue<BackdropFadeDirection>('backdropFadeDirection') ?? 'to-top'
          }
          onChange={handleFadeDirectionChange}
        />
      )}
      {/** The range the fade runs across: solid up to the first
       * thumb, fully faded out by the second **/}
      {blur && fade && isEditable('backdropFadeExtent') && (
        <Stack gap={3}>
          <InputLabel size="xs" label={fieldLabelKey('backdropFadeRange')} />
          <div className="designs-backdrop-fade-extent">
            <Slider
              size="lg"
              value={[
                getValue<number>('backdropFadeStart') ?? 0,
                getValue<number>('backdropFadeExtent') ?? 50,
              ]}
              min={0}
              max={100}
              step={5}
              ariaLabel={t(fieldLabelKey('backdropFadeRange'))}
              onValueChange={handleFadeRangeChange}
            />
          </div>
        </Stack>
      )}
    </>
  );
};

/**
 * Formats a brightness step as its percentage.
 */
function brightnessLabel(step: number): string {
  return `${step}%`;
}
