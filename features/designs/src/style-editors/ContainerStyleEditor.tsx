import {
  ContainerDirection,
  ContainerJustify,
  MeasureToken,
  RootBackground,
  RootBackgroundEmphasis,
  SpaceToken,
  SurfaceColorToken,
} from '@minddrop/designs';
import { useActiveLayoutType, useElement } from '../DesignStudioStore';
import { AlignmentGrid } from './AlignmentGrid';
import { BackdropFields, BackdropStyleKeys } from './BackdropFields';
import { BackgroundImageSection } from './BackgroundImageSection';
import { BooleanToggleField } from './BooleanToggleField';
import { BorderFields, BorderStyleKeys } from './BorderFields';
import {
  ContainerHeightFields,
  HeightStyleKeys,
} from './ContainerHeightFields';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from './OptionToggleField';
import { PagePanelSection } from './PagePanelSection';
import { SpaceField } from './SpaceField';
import {
  MarginSides,
  MarginStyleKeys,
  PaddingSides,
  PaddingStyleKeys,
  SpaceFields,
} from './SpaceFields';
import { StyleEditorProps } from './StyleEditorProps';
import { StyleSection } from './StyleSection';
import { TokenSelect } from './TokenSelect';
import {
  fieldLabelKey,
  sectionLabelKey,
  surfaceColourOptionKey,
} from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

// The border keys a container writes to: the shared block minus
// the radius, which the rendering context's scheme governs
const ContainerBorderKeys = BorderStyleKeys.filter(
  (key) => key !== 'borderRadius',
);

// The surfaces a container can sit on. The intent fills stay
// reserved for semantic colouring rather than free styling
const ContainerSurfaceTokens: readonly SurfaceColorToken[] = [
  'app',
  'subtle',
  'raised',
  'overlay',
  'accent',
];

// The semantic background treatments a layout root can take
const RootBackgroundOptions: OptionToggleFieldOption<RootBackground>[] = [
  {
    value: 'neutral',
    label: 'designsStudio.style.rootBackground.neutral.label',
    description: 'designsStudio.style.rootBackground.neutral.description',
  },
  {
    value: 'accent',
    label: 'designsStudio.style.rootBackground.accent.label',
    description: 'designsStudio.style.rootBackground.accent.description',
  },
  {
    value: 'transparent',
    label: 'designsStudio.style.rootBackground.transparent.label',
    description: 'designsStudio.style.rootBackground.transparent.description',
  },
];

// How strongly a root's neutral or accent background applies its
// surface
const RootEmphasisOptions: OptionToggleFieldOption<RootBackgroundEmphasis>[] = [
  {
    value: 'subtle',
    label: 'designsStudio.style.rootEmphasis.subtle.label',
    description: 'designsStudio.style.rootEmphasis.subtle.description',
  },
  {
    value: 'regular',
    label: 'designsStudio.style.rootEmphasis.regular.label',
    description: 'designsStudio.style.rootEmphasis.regular.description',
  },
  {
    value: 'solid',
    label: 'designsStudio.style.rootEmphasis.solid.label',
    description: 'designsStudio.style.rootEmphasis.solid.description',
  },
];

// The line length caps a page's content can take, from the
// narrowest up to the full option standing in for an unset cap
const ContentWidthOptions: OptionToggleFieldOption<MeasureToken | 'full'>[] = [
  {
    value: 'narrow',
    label: 'designsStudio.style.measure.narrow.label',
    description: 'designsStudio.style.measure.narrow.description',
  },
  {
    value: 'content',
    label: 'designsStudio.style.measure.content.label',
    description: 'designsStudio.style.measure.content.description',
  },
  {
    value: 'wide',
    label: 'designsStudio.style.measure.wide.label',
    description: 'designsStudio.style.measure.wide.description',
  },
  {
    value: 'full',
    label: 'designsStudio.style.measure.full.label',
    description: 'designsStudio.style.measure.full.description',
  },
];

// How children stack inside the container, shown as the arrow they
// follow
const DirectionOptions: OptionToggleFieldOption<ContainerDirection>[] = [
  {
    value: 'column',
    label: 'designsStudio.style.direction.column',
    icon: 'arrow-down',
  },
  {
    value: 'row',
    label: 'designsStudio.style.direction.row',
    icon: 'arrow-right',
  },
];

/**
 * Renders the style editor for containers, including the layout
 * root and page panels: how children are arranged, the surface
 * behind them, and the shared border, spacing and size blocks.
 */
export const ContainerStyleEditor: React.FC<StyleEditorProps> = ({
  elementId,
}) => {
  const editor = useStyleEditor(elementId);
  const element = useElement(elementId);
  const activeLayoutType = useActiveLayoutType();
  const { isEditable, getValue, setValue, editableSides } = editor;

  // A layout's root is sized by whatever renders the layout: a view
  // gives a card its width, and leaves it nothing to fill
  const isLayoutRoot = element.type === 'root';

  // A page or space root hosts big full-screen elements, leaving
  // only its background to style: arrangement, sizing, spacing and
  // borders belong to the elements and panels inside it
  const isFullScreenRoot =
    isLayoutRoot &&
    (activeLayoutType === 'page' || activeLayoutType === 'space');

  // The treatment an unset root background resolves to: full-screen
  // roots blend into the surface they fill, floating roots take the
  // subtle neutral wash
  const rootBackgroundDefault: RootBackground = isFullScreenRoot
    ? 'transparent'
    : 'neutral';

  // Spreading children apart is the one distribution the alignment
  // grid cannot place, so it is offered as a switch of its own
  function handleSpreadChange(spread: true | undefined) {
    setValue('justify', spread ? 'space-between' : undefined);
  }

  // The layout type's default is stored as an unset key, so a root
  // reset to it emits no background
  function handleRootBackgroundChange(background: RootBackground) {
    setValue(
      'background',
      background === rootBackgroundDefault ? undefined : background,
    );
  }

  // The full option stands for an unset cap, so a region reset to
  // it emits no maximum width
  function handleContentWidthChange(width: MeasureToken | 'full') {
    setValue('maxWidth', width === 'full' ? undefined : width);
  }

  // The subtle default is stored as an unset key, so a root reset
  // to it emits no emphasis
  function handleRootEmphasisChange(emphasis: RootBackgroundEmphasis) {
    setValue('emphasis', emphasis === 'subtle' ? undefined : emphasis);
  }

  return (
    <>
      {/** A full-screen root's permanent section holds the content
       * width instead of arrangement fields: the page's content
       * takes the width it is given and only caps its line length.
       * On a panelled page the cap applies to the content region. **/}
      {isFullScreenRoot && (
        <StyleSection
          permanent
          label={sectionLabelKey('contentWidth')}
          keys={['maxWidth', 'contentPadding']}
          isEditable={isEditable}
          getValue={getValue}
          setValue={setValue}
        >
          <OptionToggleField
            options={ContentWidthOptions}
            value={getValue<MeasureToken>('maxWidth') ?? 'full'}
            onChange={handleContentWidthChange}
          />
          {/** The side padding sits outside the cap, so it only
           * insets content once the page runs out of room **/}
          {isEditable('contentPadding') && (
            <SpaceField
              label={fieldLabelKey('padding')}
              hairline={false}
              value={getValue<SpaceToken>('contentPadding')}
              onChange={(value) => setValue('contentPadding', value)}
            />
          )}
        </StyleSection>
      )}

      {/** One section per panel side: opening a section docks its
       * panel, clearing it discards the panel again **/}
      {isFullScreenRoot && (
        <>
          <PagePanelSection side="left" />
          <PagePanelSection side="right" />
        </>
      )}

      {!isFullScreenRoot && (
        <StyleSection
          permanent
          label={sectionLabelKey('layout')}
          keys={['direction', 'align', 'justify', 'gap', 'wrap']}
          isEditable={isEditable}
          getValue={getValue}
          setValue={setValue}
        >
          {isEditable('direction') && (
            <OptionToggleField
              label={fieldLabelKey('direction')}
              options={DirectionOptions}
              value={getValue<ContainerDirection>('direction')}
              onChange={(value) => setValue('direction', value)}
            />
          )}
          {isEditable('align') && <AlignmentGrid editor={editor} />}
          {isEditable('gap') && (
            <SpaceField
              label={fieldLabelKey('gap')}
              value={getValue<SpaceToken>('gap')}
              onChange={(value) => setValue('gap', value)}
            />
          )}
          {isEditable('justify') && (
            <BooleanToggleField
              label={fieldLabelKey('spread')}
              value={getValue<ContainerJustify>('justify') === 'space-between'}
              onChange={handleSpreadChange}
            />
          )}
          {isEditable('wrap') && (
            <BooleanToggleField
              label={fieldLabelKey('wrap')}
              value={getValue<boolean>('wrap')}
              onChange={(value) => setValue('wrap', value)}
            />
          )}
        </StyleSection>
      )}

      {/** A layout is sized right after it is arranged. A layout's
       * root is sized by whatever renders the layout, so it offers
       * no width. **/}
      {!isFullScreenRoot && (
        <StyleSection
          label={sectionLabelKey('size')}
          keys={HeightStyleKeys}
          isEditable={isEditable}
          getValue={getValue}
          setValue={setValue}
        >
          <ContainerHeightFields editor={editor} canFill={!isLayoutRoot} />
        </StyleSection>
      )}

      {!isFullScreenRoot && (
        <StyleSection
          label={sectionLabelKey('padding')}
          keys={PaddingStyleKeys}
          isEditable={isEditable}
          getValue={getValue}
          setValue={setValue}
        >
          <SpaceFields
            hairline={false}
            sides={editableSides(PaddingSides)}
            getValue={(key) => getValue(key)}
            onChange={setValue}
          />
        </StyleSection>
      )}

      {/** A layout's root is placed by whatever renders the layout,
       * leaving it no margin to take **/}
      {!isLayoutRoot && (
        <StyleSection
          label={sectionLabelKey('margin')}
          keys={MarginStyleKeys}
          isEditable={isEditable}
          getValue={getValue}
          setValue={setValue}
        >
          <SpaceFields
            sides={editableSides(MarginSides)}
            getValue={(key) => getValue(key)}
            onChange={setValue}
          />
        </StyleSection>
      )}

      {/** Corner rounding is governed by the rendering context's
       * scheme, so containers offer no radius **/}
      {!isFullScreenRoot && (
        <StyleSection
          label={sectionLabelKey('border')}
          keys={ContainerBorderKeys}
          isEditable={isEditable}
          getValue={getValue}
          setValue={setValue}
          onOpen={() => setValue('borderStyle', 'solid')}
        >
          <BorderFields editor={editor} radius={false} />
        </StyleSection>
      )}

      <StyleSection
        label={sectionLabelKey('background')}
        keys={['background', 'emphasis']}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
      >
        {/** A root's background is a semantic treatment resolved
         * to a surface role at CSS generation **/}
        {isLayoutRoot && isEditable('background') && (
          <OptionToggleField
            options={RootBackgroundOptions}
            value={
              getValue<RootBackground>('background') ?? rootBackgroundDefault
            }
            onChange={handleRootBackgroundChange}
          />
        )}
        {/** Only coloured and neutral treatments have a strength
         * to vary, so a transparent root offers no emphasis **/}
        {isLayoutRoot &&
          isEditable('emphasis') &&
          (getValue<RootBackground>('background') ?? rootBackgroundDefault) !==
            'transparent' && (
            <OptionToggleField
              label={fieldLabelKey('emphasis')}
              options={RootEmphasisOptions}
              value={getValue<RootBackgroundEmphasis>('emphasis') ?? 'subtle'}
              onChange={handleRootEmphasisChange}
            />
          )}
        {!isLayoutRoot && isEditable('background') && (
          <TokenSelect
            label={fieldLabelKey('background')}
            tokens={ContainerSurfaceTokens}
            value={getValue<SurfaceColorToken>('background')}
            optionKey={surfaceColourOptionKey}
            onChange={(value) => setValue('background', value)}
          />
        )}
      </StyleSection>

      {/** The image layers over the background colour, which
       * doubles as its loading and empty-binding fallback **/}
      <BackgroundImageSection elementId={elementId} editor={editor} />

      {/** The effects layer over whichever background the sections
       * above give the container **/}
      <StyleSection
        label={sectionLabelKey('backgroundBlur')}
        keys={BackdropStyleKeys}
        isEditable={isEditable}
        getValue={getValue}
        setValue={setValue}
        onOpen={() => setValue('backdropBlur', 'subtle')}
      >
        <BackdropFields editor={editor} />
      </StyleSection>
    </>
  );
};
