import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ContainerStyle,
  DesignFixtures,
  FontSizeToken,
  FontSizeTokens,
  PagePanelSide,
  RootBackground,
  RootStyle,
  TextAlign,
  TypographyStyle,
  isRoleElement,
} from '@minddrop/designs';
import { i18n } from '@minddrop/i18n';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
  within,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import {
  FlatContainerDesignElement,
  FlatRootDesignElement,
  FlatTextElement,
} from '../types';
import { AlignmentGrid } from './AlignmentGrid';
import { BackgroundImageSection } from './BackgroundImageSection';
import { ContainerHeightFields } from './ContainerHeightFields';
import { ContainerStyleEditor } from './ContainerStyleEditor';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from './OptionToggleField';
import { TokenSelect } from './TokenSelect';
import { VariantAxisFields } from './VariantAxisFields';
import { fieldLabelKey, fontSizeOptionKey } from './styleI18nKeys';
import { useStyleEditor } from './useStyleEditor';

const {
  design_books,
  layout_card_1,
  layout_list_1,
  layout_page_1,
  element_container_1,
  element_text_1,
} = DesignFixtures;

// A subset of the alignment options, enough to press and unpress
const TextAlignOptions: OptionToggleFieldOption<TextAlign>[] = [
  { value: 'left', label: 'designsStudio.style.textAlign.left' },
  { value: 'center', label: 'designsStudio.style.textAlign.center' },
];

describe('style editor fields', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  describe('token selects', () => {
    it('writes the chosen token to the element style', async () => {
      const studio = openCardLayout();

      render(
        <DesignStudioProvider store={studio}>
          <FontSizeField />
        </DesignStudioProvider>,
      );

      // Open the select and choose the medium step
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText(fontSizeOptionKey('md', 'label')));

      expect(readTextElementStyle(studio).fontSize).toBe('md');
    });

    it('deletes the style key when set back to the default', async () => {
      const studio = openCardLayout();

      // Start from an element which already has a font size
      const element = readTextElement(studio);

      studio.setDesignElement(element_text_1.id, {
        ...element,
        style: { ...element.style, fontSize: 'lg' },
      });

      render(
        <DesignStudioProvider store={studio}>
          <FontSizeField />
        </DesignStudioProvider>,
      );

      // Choose the leading "default" option
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(
        screen.getByText('designsStudio.style.default.label'),
      );

      // The key is removed rather than stored as a sentinel, so
      // no CSS is emitted for it
      expect('fontSize' in readTextElementStyle(studio)).toBe(false);
    });
  });

  describe('option toggles', () => {
    it('writes the pressed option to the element style', async () => {
      const studio = openCardLayout();

      render(
        <DesignStudioProvider store={studio}>
          <TextAlignField />
        </DesignStudioProvider>,
      );

      await userEvent.click(
        screen.getByText('designsStudio.style.textAlign.center'),
      );

      expect(readTextElementStyle(studio).textAlign).toBe('center');
    });

    it('keeps the value when the active option is pressed again', async () => {
      const studio = openCardLayout();

      render(
        <DesignStudioProvider store={studio}>
          <TextAlignField />
        </DesignStudioProvider>,
      );

      const centre = screen.getByText('designsStudio.style.textAlign.center');

      await userEvent.click(centre);
      await userEvent.click(centre);

      // The toggle is a radio: a selection is always active, so
      // pressing the active option changes nothing
      expect(readTextElementStyle(studio).textAlign).toBe('center');
    });
  });

  describe('alignment grid', () => {
    it('writes the pressed position to the element style', async () => {
      const studio = openCardLayout();

      const { container } = renderAlignmentGrid(studio);

      // The top right cell of a column container, whose main axis
      // runs down the grid and cross axis across it
      await userEvent.click(gridCell(container, 2));

      expect(readContainerStyle(studio)).toMatchObject({
        align: 'end',
        justify: 'start',
      });
    });

    it('deletes both style keys when the active position is pressed again', async () => {
      const studio = openCardLayout();

      const { container } = renderAlignmentGrid(studio);

      await userEvent.click(gridCell(container, 4));
      await userEvent.click(gridCell(container, 4));

      const style = readContainerStyle(studio);

      // Both keys are removed rather than left on their values
      expect('align' in style).toBe(false);
      expect('justify' in style).toBe(false);
    });

    it('keeps the position marked when the main axis is unset', async () => {
      const studio = openCardLayout();

      // An element aligned on the cross axis alone, as spreading
      // its children apart and then stopping leaves it
      studio.updateElementStyle(element_container_1.id, 'align', 'end');

      const { container } = renderAlignmentGrid(studio);

      // Children pile up at the start of the main axis, so that is
      // where the grid marks them
      expect(gridCell(container, 2).getAttribute('data-active')).toBe('true');
    });

    it('places spread apart children on the cross axis alone', async () => {
      const studio = openCardLayout();

      // Spread the children apart, which hands the main axis to
      // the distribution
      studio.updateElementStyle(
        element_container_1.id,
        'justify',
        'space-between',
      );

      const { container } = renderAlignmentGrid(studio);

      await userEvent.click(gridCell(container, 2));

      // The cross axis position is set, leaving the children
      // spread apart along the main one
      expect(readContainerStyle(studio)).toMatchObject({
        align: 'end',
        justify: 'space-between',
      });
    });

    it('stretches children across the container', async () => {
      const studio = openCardLayout();

      const { container } = renderAlignmentGrid(studio);

      // The stretch lane closes the cross axis of a column
      // container, at the start of its main axis
      await userEvent.click(gridCell(container, 3));

      expect(readContainerStyle(studio)).toMatchObject({
        align: 'stretch',
        justify: 'start',
      });
    });

    it('flips the grid axes for a row container', async () => {
      const studio = openCardLayout();

      // Lay the container's children out side by side, which runs
      // its main axis across the grid
      studio.updateElementStyle(element_container_1.id, 'direction', 'row');

      const { container } = renderAlignmentGrid(studio);

      await userEvent.click(gridCell(container, 2));

      expect(readContainerStyle(studio)).toMatchObject({
        align: 'start',
        justify: 'end',
      });
    });
  });

  describe('container height', () => {
    it('bounds a content sized container', async () => {
      const studio = openCardLayout();

      renderHeightFields(studio);

      // Give the container a floor, which is what keeps an empty
      // card from collapsing
      await userEvent.click(screen.getAllByRole('combobox')[0]);
      await userEvent.click(
        screen.getByText('designsStudio.style.size.md.label'),
      );

      expect(readContainerStyle(studio).minHeight).toBe('md');
    });

    it('drops the bounds when the height is fixed', async () => {
      const studio = openCardLayout();

      // A container bounded while it was content sized
      studio.updateElementStyle(element_container_1.id, 'minHeight', 'sm');
      studio.updateElementStyle(element_container_1.id, 'maxHeight', 'xl');

      renderHeightFields(studio);

      await userEvent.click(
        screen.getByText('designsStudio.style.height.mode.fixed.label'),
      );

      const style = readContainerStyle(studio);

      // The bounds have nothing to bound once the height is fixed
      expect(style.height).toBe('md');
      expect('minHeight' in style).toBe(false);
      expect('maxHeight' in style).toBe(false);
    });

    it('holds the cap at or above the floor', async () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'minHeight', 'lg');

      renderHeightFields(studio);

      // The cap select sits below the floor select
      await userEvent.click(screen.getAllByRole('combobox')[1]);

      // A cap shorter than the floor would bound nothing
      expect(
        screen
          .getByText('designsStudio.style.size.sm.label')
          .closest('[role="option"]')
          ?.getAttribute('data-disabled'),
      ).not.toBeNull();

      expect(
        screen
          .getByText('designsStudio.style.size.xl.label')
          .closest('[role="option"]')
          ?.getAttribute('data-disabled'),
      ).toBeNull();
    });

    it('carries the cap up with a floor raised past it', async () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'minHeight', 'sm');
      studio.updateElementStyle(element_container_1.id, 'maxHeight', 'md');

      renderHeightFields(studio);

      // Raise the floor above the cap, one step at a time
      const taller = screen.getAllByLabelText(
        'designsStudio.style.height.increase',
      )[0];

      await userEvent.click(taller);
      await userEvent.click(taller);

      const style = readContainerStyle(studio);

      // The cap rose with the floor rather than bounding nothing
      expect(style.minHeight).toBe('lg');
      expect(style.maxHeight).toBe('lg');
    });

    it('enters the cap scale at the floor when stepped up from empty', async () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'minHeight', 'lg');

      renderHeightFields(studio);

      // Step the unset cap up, whose stepper sits below the floor's
      await userEvent.click(
        screen.getAllByLabelText('designsStudio.style.height.increase')[1],
      );

      // The cap entered the scale at the floor rather than at the
      // bottom of the whole scale
      expect(readContainerStyle(studio).maxHeight).toBe('lg');
    });

    it('shapes a container to the proportions it is given', async () => {
      const studio = openCardLayout();

      renderHeightFields(studio);

      await userEvent.click(
        screen.getByText('designsStudio.style.height.mode.ratio.label'),
      );

      // Proportioning opens on the portrait book cover shape
      expect(readContainerStyle(studio).aspectRatio).toBe('2/3');

      // Step to the next shape along the portrait scale
      await userEvent.click(
        screen.getByLabelText('designsStudio.style.aspectRatioSteps.decrease'),
      );

      expect(readContainerStyle(studio).aspectRatio).toBe('3/4');

      // Landscape opens on the proportions of a photograph
      await userEvent.click(
        screen.getByText('designsStudio.style.orientation.landscape'),
      );

      expect(readContainerStyle(studio).aspectRatio).toBe('3/2');
    });

    it('drops the proportions when the height is fixed', async () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'aspectRatio', '2/3');

      renderHeightFields(studio);

      await userEvent.click(
        screen.getByText('designsStudio.style.height.mode.fixed.label'),
      );

      const style = readContainerStyle(studio);

      // A container sized by its height takes no shape of its own
      expect('aspectRatio' in style).toBe(false);
      expect(style.height).toBe('md');
    });

    it('fills the space left around the container', async () => {
      const studio = openCardLayout();

      renderHeightFields(studio);

      await userEvent.click(
        screen.getByText('designsStudio.style.height.mode.fill.label'),
      );

      // Filling is a height of its own rather than a fixed one
      expect(readContainerStyle(studio).height).toBe('fill');
    });

    it('gives a filling container the share it is set to', async () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'height', 'fill');

      renderHeightFields(studio);

      // The ratio select sits above the floor select
      await userEvent.click(screen.getAllByRole('combobox')[0]);
      await userEvent.click(
        screen.getByText('designsStudio.style.fillRatio.2.label'),
      );

      expect(readContainerStyle(studio).fillRatio).toBe(2);
    });

    it('offers a layout root no way to fill or be widened', async () => {
      const studio = openCardLayout();

      render(
        <DesignStudioProvider store={studio}>
          <ContainerStyleEditor elementId="root" />
        </DesignStudioProvider>,
      );

      // Open the section the size fields live in, which is closed
      // while the root sets none of them
      await userEvent.click(
        screen.getByText('designsStudio.style.sections.size'),
      );

      // A view gives the layout its width, leaving the root nothing
      // to fill and no width of its own to take
      expect(
        screen.queryByText('designsStudio.style.height.mode.fill.label'),
      ).toBeNull();
      expect(screen.queryByText('designsStudio.style.fields.width')).toBeNull();

      // The heights it is sized by are still its own
      screen.getByText('designsStudio.style.height.mode.fixed.label');
    });

    it('steps the fixed height down the size scale', async () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'height', 'lg');

      renderHeightFields(studio);

      await userEvent.click(
        screen.getByLabelText('designsStudio.style.height.decrease'),
      );

      expect(readContainerStyle(studio).height).toBe('md');
    });

    it('holds a fixed height at the smallest step', () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'height', 'xs');

      renderHeightFields(studio);

      // A fixed container always has a height, so there is nothing
      // below the smallest step to reach
      expect(
        screen.getByLabelText('designsStudio.style.height.decrease'),
      ).toBeDisabled();
    });

    it('returns a fixed container to its content size', async () => {
      const studio = openCardLayout();

      studio.updateElementStyle(element_container_1.id, 'height', 'lg');

      renderHeightFields(studio);

      await userEvent.click(
        screen.getByText('designsStudio.style.height.mode.auto.label'),
      );

      // The height is removed rather than left on its value
      expect('height' in readContainerStyle(studio)).toBe(false);
    });
  });

  describe('variant axis pickers', () => {
    it('defaults to the axis default option', () => {
      const studio = openCardLayoutWithRole();

      renderVariantFields(studio);

      // The card title size axis defaults to medium
      screen.getByText('designs.roleVariants.md');
    });

    it('writes the chosen option to the element role variants', async () => {
      const studio = openCardLayoutWithRole();

      renderVariantFields(studio);

      // Choose the large size option
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('designs.roleVariants.lg'));

      expect(readRoleVariants(studio)).toEqual({ size: 'lg' });
    });

    it('renders nothing for an element without a role', () => {
      const studio = openCardLayout();

      const { container } = renderVariantFields(studio);

      expect(container.textContent).toBe('');
    });
  });

  describe('background image fields', () => {
    it('switches the container to a static background image', async () => {
      const studio = openCardLayout();

      renderBackgroundImageFields(studio);

      // The section starts collapsed with no image set, so open it
      await userEvent.click(
        screen.getByText('designsStudio.style.sections.backgroundImage'),
      );

      // Choose the static image source
      await userEvent.click(screen.getByText('designs.content.mode.static'));

      expect(readContainerElement(studio).static).toBe(true);
    });

    it('binds the chosen image property', async () => {
      const studio = openCardLayout();

      renderBackgroundImageFields(studio);

      // The section starts collapsed with no image set, so open it
      await userEvent.click(
        screen.getByText('designsStudio.style.sections.backgroundImage'),
      );

      // The property source is the default mode, so its select is
      // already showing. Bind the design's image property, whose
      // select leads the fit and backdrop selects. The option role
      // separates it from the fit select showing the same word.
      await userEvent.click(screen.getAllByRole('combobox')[0]);
      await userEvent.click(screen.getByRole('option', { name: 'Cover' }));

      expect(readContainerElement(studio).property).toBe('Cover');
    });

    it('auto-binds when switching from static to property', async () => {
      const studio = openCardLayout();

      // Start from a container with a static background image
      seedStaticBackgroundImage(studio);

      renderBackgroundImageFields(studio);

      // Return to the property source
      await userEvent.click(screen.getByText('designs.content.mode.property'));

      // The first unbound image property was bound automatically
      expect(readContainerElement(studio).property).toBe('Cover');
    });

    it('writes the chosen fit to the element style', async () => {
      const studio = openCardLayout();

      // Start from a container with a static background image
      seedStaticBackgroundImage(studio);

      renderBackgroundImageFields(studio);

      // Choose the fill fit, whose select leads the backdrop
      // select
      await userEvent.click(screen.getAllByRole('combobox')[0]);
      await userEvent.click(
        screen.getByText('designsStudio.style.objectFit.fill.label'),
      );

      expect(readContainerStyle(studio).backgroundImageFit).toBe('fill');
    });

    it('offers no unset fit and clears the key on the default', async () => {
      const studio = openCardLayout();

      // Start from a contain fit, so choosing cover is a change
      seedStaticBackgroundImage(studio);

      renderBackgroundImageFields(studio);

      await userEvent.click(screen.getAllByRole('combobox')[0]);

      // The fit always has a value, so there is no unset option
      expect(
        screen.queryByText('designsStudio.style.default.label'),
      ).toBeNull();

      // Choosing the default cover fit clears the key instead of
      // storing it
      await userEvent.click(
        screen.getByText('designsStudio.style.objectFit.cover.label'),
      );

      expect('backgroundImageFit' in readContainerStyle(studio)).toBe(false);
    });

    it('drops the image source when the section is cleared', async () => {
      const studio = openCardLayout();

      // Start from a container with a fully configured static
      // background image
      seedStaticBackgroundImage(studio);

      renderBackgroundImageFields(studio);

      // Clear the section, which is how the image is turned off
      await userEvent.click(
        screen.getByLabelText('designs.clear-custom-styling'),
      );

      // The element is no longer static and every image style key
      // is gone
      const element = readContainerElement(studio);

      expect(element.static).toBe(false);
      expect('backgroundImage' in element.style).toBe(false);
      expect('backgroundImageFit' in element.style).toBe(false);
    });
  });

  describe('card root background field', () => {
    it('writes the chosen treatment to the root style', async () => {
      const studio = openCardLayout();

      renderRootEditor(studio);

      // Open the background section, which starts collapsed while
      // the root sets none of its keys
      await userEvent.click(
        screen.getByText('designsStudio.style.sections.background'),
      );

      // Choose the accent treatment off the toggle
      await userEvent.click(
        screen.getByText('designsStudio.style.rootBackground.accent.label'),
      );

      expect(readRootStyle(studio).background).toBe('accent');
    });

    it('clears the key when set back to the neutral default', async () => {
      const studio = openCardLayout();

      seedRootBackground(studio, 'accent');

      renderRootEditor(studio);

      // Choose the neutral default
      await userEvent.click(
        screen.getByText('designsStudio.style.rootBackground.neutral.label'),
      );

      // The key is removed rather than stored, since an unset
      // background already renders as the neutral treatment
      expect('background' in readRootStyle(studio)).toBe(false);
    });

    it('stores the transparent treatment explicitly', async () => {
      const studio = openCardLayout();

      seedRootBackground(studio, 'accent');

      renderRootEditor(studio);

      // Choose the transparent treatment, which opts out of the
      // neutral default
      await userEvent.click(
        screen.getByText(
          'designsStudio.style.rootBackground.transparent.label',
        ),
      );

      expect(readRootStyle(studio).background).toBe('transparent');
    });

    it('writes the chosen emphasis level to the root style', async () => {
      const studio = openCardLayout();

      seedRootBackground(studio, 'neutral');

      renderRootEditor(studio);

      // Switch to a solid fill
      await userEvent.click(
        screen.getByText('designsStudio.style.rootEmphasis.solid.label'),
      );

      expect(readRootStyle(studio).emphasis).toBe('solid');

      // Switching back to the subtle default clears the key
      await userEvent.click(
        screen.getByText('designsStudio.style.rootEmphasis.subtle.label'),
      );

      expect('emphasis' in readRootStyle(studio)).toBe(false);
    });

    it('offers no emphasis for a transparent root', async () => {
      const studio = openCardLayout();

      seedRootBackground(studio, 'transparent');

      renderRootEditor(studio);

      // The transparent treatment has no strength to vary
      expect(
        screen.queryByText('designsStudio.style.rootEmphasis.subtle.label'),
      ).toBeNull();
    });

    it('offers the treatments on list roots too', async () => {
      const studio = openListLayout();

      renderRootEditor(studio);

      // Open the background section, collapsed while the root
      // sets none of its keys
      await userEvent.click(
        screen.getByText('designsStudio.style.sections.background'),
      );

      // The list root offers the same semantic treatments as cards
      screen.getByText('designsStudio.style.rootBackground.neutral.label');
    });

    it('offers a full-screen root only its background sections', async () => {
      const studio = openPageLayout();

      renderRootEditor(studio);

      // The background sections stay
      screen.getByText('designsStudio.style.sections.background');
      screen.getByText('designsStudio.style.sections.backgroundBlur');

      // Arrangement, sizing, spacing and borders are gone: a page
      // hosts big full-screen elements, which carry those styles
      // themselves. Matched against the section headers only, since
      // fields reuse short labels like "Padding".
      const sectionLabels = Array.from(
        document.querySelectorAll('.designs-style-section-label'),
      ).map((label) => label.textContent);

      expect(sectionLabels).not.toContain(
        i18n.t('designsStudio.style.sections.layout'),
      );
      expect(sectionLabels).not.toContain(
        i18n.t('designsStudio.style.sections.size'),
      );
      expect(sectionLabels).not.toContain(
        i18n.t('designsStudio.style.sections.padding'),
      );
      expect(sectionLabels).not.toContain(
        i18n.t('designsStudio.style.sections.border'),
      );
    });

    it('offers a full-screen root the panel sections', async () => {
      const studio = openPageLayout();

      renderRootEditor(studio);

      // The permanent content width section replaces the
      // arrangement fields
      screen.getByText('designsStudio.style.sections.contentWidth');

      // Opening the left panel section docks a panel to that side
      await userEvent.click(
        screen.getByText('designsStudio.style.panels.left'),
      );

      expect(hasPanelOnSide(studio, 'left')).toBe(true);

      // Clearing the section removes the panel again. The eraser
      // is matched within the left panel's own section, since other
      // sections offer erasers of their own.
      const leftSection = screen
        .getByText('designsStudio.style.panels.left')
        .closest('.designs-style-section') as HTMLElement;

      await userEvent.click(
        within(leftSection).getByLabelText('designs.clear-custom-styling'),
      );

      expect(hasPanelOnSide(studio, 'left')).toBe(false);
    });

    it("stores a panel's open default on its element", async () => {
      const studio = openPageLayout();

      studio.addPagePanel('left');

      renderRootEditor(studio);

      // Switching the default off writes it to the panel element.
      // The collapsed right section may keep its switch mounted, so
      // the docked left panel's switch is matched first.
      await userEvent.click(
        screen.getAllByText('designsStudio.style.panels.defaultOpen')[0],
      );

      expect(readPanel(studio, 'left')?.defaultOpen).toBe(false);
    });

    it('treats transparent as the full-screen root default', async () => {
      const studio = openPageLayout();

      renderRootEditor(studio);

      // Open the background section
      await userEvent.click(
        screen.getByText('designsStudio.style.sections.background'),
      );

      // Choosing the neutral treatment stores it, since it is not
      // the page default
      await userEvent.click(
        screen.getByText('designsStudio.style.rootBackground.neutral.label'),
      );

      expect(readRootStyle(studio).background).toBe('neutral');

      // Returning to the transparent default clears the key
      await userEvent.click(
        screen.getByText(
          'designsStudio.style.rootBackground.transparent.label',
        ),
      );

      expect('background' in readRootStyle(studio)).toBe(false);
    });

    it('writes the background effects to the root style', async () => {
      const studio = openCardLayout();

      renderRootEditor(studio);

      // Open the effects section, which starts collapsed while the
      // root sets none of its keys
      await userEvent.click(
        screen.getByText('designsStudio.style.sections.backgroundBlur'),
      );

      // Press the regular blur preset on the toggle
      await userEvent.click(
        screen.getByText('designsStudio.style.backdropBlur.regular.label'),
      );

      expect(readRootStyle(studio).backdropBlur).toBe('regular');

      // Wash the blur with the accent tint
      await userEvent.click(
        screen.getByText('designsStudio.style.backdropTint.accent.label'),
      );

      expect(readRootStyle(studio).backdropTint).toBe('accent');
    });

    it('drops the tint strength when the tint is set to none', async () => {
      const studio = openCardLayout();

      // Start from a strongly tinted blur
      studio.updateElementStyle('root', 'backdropBlur', 'subtle');
      studio.updateElementStyle('root', 'backdropTint', 'accent');
      studio.updateElementStyle('root', 'backdropTintStrength', 'strong');

      renderRootEditor(studio);

      // Choose the none tint, which uncolours the blur. The toggle
      // is matched by its label class, since the strength select
      // displays the same word.
      const noneToggle = screen
        .getAllByText('designsStudio.style.backdropTint.none.label')
        .find((candidate) => candidate.classList.contains('toggle-label'));

      await userEvent.click(noneToggle as HTMLElement);

      const style = readRootStyle(studio);

      // The strength went with the tint it scaled
      expect('backdropTint' in style).toBe(false);
      expect('backdropTintStrength' in style).toBe(false);
    });
  });
});

/**
 * Renders a lone font size select bound to the layout's text
 * element, so the interaction under test is unambiguous.
 */
const FontSizeField: React.FC = () => {
  const { getValue, setValue } = useStyleEditor(element_text_1.id);

  return (
    <TokenSelect
      label={fieldLabelKey('fontSize')}
      tokens={FontSizeTokens}
      value={getValue<FontSizeToken>('fontSize')}
      optionKey={fontSizeOptionKey}
      onChange={(value) => setValue('fontSize', value)}
    />
  );
};

/**
 * Renders a lone text alignment toggle group bound to the layout's
 * text element.
 */
const TextAlignField: React.FC = () => {
  const { getValue, setValue } = useStyleEditor(element_text_1.id);

  return (
    <OptionToggleField
      label={fieldLabelKey('textAlign')}
      options={TextAlignOptions}
      value={getValue<TextAlign>('textAlign')}
      onChange={(value) => setValue('textAlign', value)}
    />
  );
};

/**
 * Renders the container height fields bound to the layout's
 * container element within the given studio.
 */
function renderHeightFields(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <HeightFields />
    </DesignStudioProvider>,
  );
}

/**
 * Renders the height block bound to the layout's container element.
 */
const HeightFields: React.FC = () => {
  const editor = useStyleEditor(element_container_1.id);

  return <ContainerHeightFields editor={editor} />;
};

/**
 * Renders the alignment grid bound to the layout's container
 * element within the given studio.
 */
function renderAlignmentGrid(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <AlignmentField />
    </DesignStudioProvider>,
  );
}

/**
 * Returns the alignment grid cell at the given position, counting
 * left to right and top to bottom.
 */
function gridCell(container: HTMLElement, index: number): Element {
  return container.querySelectorAll('.designs-alignment-grid-cell')[index];
}

/**
 * Renders a lone alignment grid bound to the layout's container
 * element.
 */
const AlignmentField: React.FC = () => {
  const editor = useStyleEditor(element_container_1.id);

  return <AlignmentGrid editor={editor} />;
};

/**
 * Opens the books design with its card layout active.
 */
function openCardLayout(): DesignStudioStore {
  const studio = createDesignStudioStore();

  studio.initialize(design_books);
  studio.setActiveLayout(layout_card_1.id);

  return studio;
}

/**
 * Opens the books design with its list layout active.
 */
function openListLayout(): DesignStudioStore {
  const studio = createDesignStudioStore();

  studio.initialize(design_books);
  studio.setActiveLayout(layout_list_1.id);

  return studio;
}

/**
 * Opens the books design with its page layout active.
 */
function openPageLayout(): DesignStudioStore {
  const studio = createDesignStudioStore();

  studio.initialize(design_books);
  studio.setActiveLayout(layout_page_1.id);

  return studio;
}

/**
 * Opens the card layout with its text element playing the card
 * title role, which offers a size variant axis.
 */
function openCardLayoutWithRole(): DesignStudioStore {
  const studio = openCardLayout();

  const roleElement = { ...readTextElement(studio), role: 'title' };

  studio.setDesignElement(element_text_1.id, roleElement);

  return studio;
}

/**
 * Renders the variant axis fields within the given studio.
 */
function renderVariantFields(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <VariantAxisFields elementId={element_text_1.id} />
    </DesignStudioProvider>,
  );
}

/**
 * Reads the layout's text element from the store.
 */
function readTextElement(studio: DesignStudioStore): FlatTextElement {
  return studio.getDesignElement<FlatTextElement>(
    element_text_1.id,
    layout_card_1.id,
  );
}

/**
 * Reads the style of the layout's text element.
 */
function readTextElementStyle(studio: DesignStudioStore): TypographyStyle {
  return readTextElement(studio).style;
}

/**
 * Reads the layout's container element from the store.
 */
function readContainerElement(
  studio: DesignStudioStore,
): FlatContainerDesignElement {
  return studio.getDesignElement<FlatContainerDesignElement>(
    element_container_1.id,
    layout_card_1.id,
  );
}

/**
 * Reads the style of the layout's container element.
 */
function readContainerStyle(studio: DesignStudioStore): ContainerStyle {
  return readContainerElement(studio).style;
}

/**
 * Marks the layout's container element static with a fully
 * configured background image.
 */
function seedStaticBackgroundImage(studio: DesignStudioStore): void {
  const element = readContainerElement(studio);

  studio.setDesignElement(element_container_1.id, {
    ...element,
    static: true,
    style: {
      ...element.style,
      backgroundImage: 'cover.png',
      backgroundImageFit: 'contain',
    },
  });
}

/**
 * Reads the style of the active layout's root element.
 */
function readRootStyle(studio: DesignStudioStore): RootStyle {
  return studio.getDesignElement<FlatRootDesignElement>('root').style;
}

/**
 * Checks whether the active layout's root has a panel docked to
 * the given side.
 */
function hasPanelOnSide(
  studio: DesignStudioStore,
  side: PagePanelSide,
): boolean {
  return readPanel(studio, side) !== null;
}

/**
 * Reads the panel docked to the given side of the active layout's
 * root, or null when the side has none.
 */
function readPanel(studio: DesignStudioStore, side: PagePanelSide) {
  const root = studio.getDesignElement<FlatRootDesignElement>('root');

  for (const childId of root.children) {
    const child = studio.getDesignElement(childId);

    if (child?.type === 'page-panel' && child.side === side) {
      return child;
    }
  }

  return null;
}

/**
 * Sets the active layout root's background treatment.
 */
function seedRootBackground(
  studio: DesignStudioStore,
  background: RootBackground,
): void {
  const root = studio.getDesignElement<FlatRootDesignElement>('root');

  studio.setDesignElement('root', {
    ...root,
    style: { ...root.style, background },
  });
}

/**
 * Renders the container style editor bound to the active layout's
 * root element within the given studio.
 */
function renderRootEditor(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <ContainerStyleEditor elementId="root" />
    </DesignStudioProvider>,
  );
}

/**
 * Renders the background image section bound to the layout's
 * container element within the given studio.
 */
function renderBackgroundImageFields(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <BackgroundField />
    </DesignStudioProvider>,
  );
}

/**
 * Renders the background image section bound to the layout's
 * container element.
 */
const BackgroundField: React.FC = () => {
  const editor = useStyleEditor(element_container_1.id);

  return (
    <BackgroundImageSection
      elementId={element_container_1.id}
      editor={editor}
    />
  );
};

/**
 * Reads the role variant selections of the layout's text element.
 */
function readRoleVariants(
  studio: DesignStudioStore,
): Record<string, string> | undefined {
  const element = readTextElement(studio);

  // The role fields sit alongside the element's own, so they are
  // read through the role element shape
  if (!isRoleElement(element)) {
    return undefined;
  }

  return element.roleVariants;
}
