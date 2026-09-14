import { afterEach, describe, expect, it } from 'vitest';
import {
  DesignElement,
  DesignElementConfigs,
  DesignElementSettingControl,
  DesignElementSettingControlProps,
  Designs,
  TextSettings,
} from '@minddrop/designs-next';
import {
  DesignElementConfigsRegistry,
  TestSlotName,
  bodyDesignElement,
  captionSlotElement,
  cardRows,
  coverDesignElement,
  designElements,
  iconDesignElement,
  slottedDesignElement,
  testElementConfig,
  testSlotElementConfig,
} from '@minddrop/designs-next/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { fireEvent, render, screen, userEvent } from '@minddrop/test-utils';
import { TextContentControls } from '../TextContentControls';
import { cleanup } from '../test-utils';
import { DesignElementControls } from './DesignElementControls';

// The elements passed to the most recent onElementsChange call
let changedElements: DesignElement[] | null;

// A bottom-pinned body, which the cover stands above
const pinnedBody: DesignElement = {
  ...bodyDesignElement,
  heightMode: 'fixed-bottom',
};

/**
 * Registers the box element type with the given setting groups so
 * the fixture element's menu shows them.
 *
 * @param settingControls - The setting controls to register.
 */
function registerSettingControls(
  settingControls: DesignElementSettingControl[],
) {
  DesignElementConfigs.register({ ...testElementConfig, settingControls });
}

/**
 * Registers the box element type as square, so the fixture element's
 * menu shows a square block's constraints.
 */
function registerSquare() {
  DesignElementConfigs.register({ ...testElementConfig, square: true });
}

interface StubElement extends DesignElement {
  /**
   * A stub element-specific setting.
   */
  framed?: boolean;
}

// Stand-in element settings controls writing an element-specific setting
const StubSettingControl: React.FC<
  DesignElementSettingControlProps<StubElement>
> = ({ onChange }) => (
  <button
    type="button"
    aria-label="Framed"
    onClick={() => onChange({ framed: true })}
  />
);

interface RenderControlsOptions {
  /**
   * The element the controls configure.
   */
  element?: DesignElement;

  /**
   * The design's elements, which the element's context comes from.
   * Defaults to the element on its own, so nothing neighbours it.
   */
  elements?: DesignElement[];

  /**
   * Whether the design is aspect-locked.
   */
  aspectLocked?: boolean;

  /**
   * The properties the design's elements can map to.
   */
  properties?: PropertiesSchema;

  /**
   * The selected element, when it is not the configured one.
   */
  selectedId?: string;
}

/**
 * Opens one of the controls' menus through its trigger.
 *
 * @param label - The trigger's label.
 */
function openMenu(label: string) {
  fireEvent.click(screen.getByLabelText(label));
}

/**
 * Rests on one of a menu's options, opening its tooltip.
 *
 * @param label - The option's label.
 */
async function hoverOption(label: string) {
  await userEvent.hover(screen.getByLabelText(label));
}

/**
 * Returns the configured element from the most recent change.
 *
 * @param elementId - The element's ID.
 * @returns The changed element.
 */
function changedElement(elementId: string) {
  return changedElements?.find((element) => element.id === elementId);
}

/**
 * Renders the controls for an element in a toolbar, with a
 * recording change callback.
 *
 * @param options - The element and design the controls work on.
 * @returns The render container.
 */
function renderControls(options: RenderControlsOptions = {}) {
  changedElements = null;

  const element = options.element ?? iconDesignElement;

  const { container } = render(
    <DesignElementControls
      elements={options.elements ?? [element]}
      selectedId={options.selectedId ?? element.id}
      rows={cardRows}
      properties={options.properties}
      aspectLocked={options.aspectLocked ?? false}
      onElementsChange={(elements) => {
        changedElements = elements;
      }}
    />,
  );

  return container;
}

describe('DesignElementControls', () => {
  afterEach(() => {
    cleanup();
    DesignElementConfigsRegistry.clear();
  });

  it('offers no sizing controls to an element filling a slot', () => {
    // A slot child takes its place from the block holding it
    renderControls({
      element: slottedDesignElement,
      elements: [slottedDesignElement, captionSlotElement],
      selectedId: captionSlotElement.id,
    });

    expect(screen.queryByLabelText('Width')).toBeNull();
    expect(screen.queryByLabelText('Content fit')).toBeNull();
  });

  it('offers the setting groups of an element filling a slot', () => {
    DesignElementConfigs.register({
      ...testSlotElementConfig,
      settingControls: ['font-size'],
    });

    renderControls({
      element: slottedDesignElement,
      elements: [slottedDesignElement, captionSlotElement],
      selectedId: captionSlotElement.id,
    });

    expect(screen.getByLabelText('Font size')).toBeInTheDocument();
  });

  it('leaves out the separator above a section with none before it', () => {
    DesignElementConfigs.register({
      ...testSlotElementConfig,
      propertyTypes: ['title'],
    });

    // A slot child has no sizing controls, so the content section it
    // opens with takes no separator above it.
    const container = renderControls({
      element: slottedDesignElement,
      elements: [slottedDesignElement, captionSlotElement],
      selectedId: captionSlotElement.id,
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    expect(screen.getByLabelText('designsNext.property.label')).toBeTruthy();
    expect(container.querySelector('.toolbar-separator')).toBeNull();
  });

  it("sets a held element's block to one line of its type size", async () => {
    DesignElementConfigs.register({
      ...testSlotElementConfig,
      settingControls: ['font-size'],
      resolveMinRowSpan: (element: DesignElement & TextSettings) =>
        Designs.resolveTextLineRowSpan(element.fontSize ?? 14),
    });

    renderControls({
      element: slottedDesignElement,
      elements: [slottedDesignElement, captionSlotElement],
      selectedId: captionSlotElement.id,
    });

    await userEvent.click(screen.getByLabelText('Font size'));
    await userEvent.click(screen.getByText('32'));

    // 32px text needs 12 units a line, whatever the block was
    expect(changedElement(captionSlotElement.id)?.rowSpan).toBe(12);
  });

  it('marks the property picker while the element is mapped', () => {
    DesignElementConfigs.register({
      ...testElementConfig,
      propertyTypes: ['title'],
    });

    renderControls({
      element: { ...iconDesignElement, property: 'Title' },
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    expect(screen.getByLabelText('designsNext.property.label')).toHaveClass(
      'icon-button-highlighted',
    );
  });

  it('leaves the property picker unmarked while it is unmapped', () => {
    DesignElementConfigs.register({
      ...testElementConfig,
      propertyTypes: ['title'],
    });

    renderControls({
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    expect(screen.getByLabelText('designsNext.property.label')).not.toHaveClass(
      'icon-button-highlighted',
    );
  });

  it("marks a slot's picker while the slot is filled", () => {
    DesignElementConfigs.register(testElementConfig);
    DesignElementConfigs.register({
      ...testSlotElementConfig,
      propertyTypes: ['title'],
    });

    renderControls({
      element: slottedDesignElement,
      elements: [
        slottedDesignElement,
        { ...captionSlotElement, property: 'Title' },
      ],
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    expect(screen.getByLabelText('Box')).toHaveClass('icon-button-highlighted');
  });

  it("fills a block's slot by mapping it to a property", async () => {
    DesignElementConfigs.register(testElementConfig);
    DesignElementConfigs.register({
      ...testSlotElementConfig,
      propertyTypes: ['title'],
    });

    renderControls({
      element: bodyDesignElement,
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    await userEvent.click(screen.getByLabelText('Box'));
    await userEvent.click(screen.getByText('Title'));

    // Added as an element of its own, held by the block in its slot
    expect(changedElements).toHaveLength(2);
    expect(changedElements?.[1]).toMatchObject({
      parent: bodyDesignElement.id,
      slot: TestSlotName,
      property: 'Title',
    });
  });

  it('remaps a filled slot to another property', async () => {
    DesignElementConfigs.register(testElementConfig);
    DesignElementConfigs.register({
      ...testSlotElementConfig,
      propertyTypes: ['title'],
    });

    renderControls({
      element: slottedDesignElement,
      elements: [slottedDesignElement, captionSlotElement],
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    await userEvent.click(screen.getByLabelText('Box'));
    await userEvent.click(screen.getByText('Title'));

    expect(changedElements).toHaveLength(2);
    expect(changedElement(captionSlotElement.id)?.property).toBe('Title');
  });

  it('empties a slot when its property is cleared', async () => {
    DesignElementConfigs.register(testElementConfig);
    DesignElementConfigs.register({
      ...testSlotElementConfig,
      propertyTypes: ['title'],
    });

    renderControls({
      element: slottedDesignElement,
      elements: [slottedDesignElement, captionSlotElement],
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    await userEvent.click(screen.getByLabelText('Box'));
    await userEvent.click(screen.getByText('designsNext.property.none'));

    expect(changedElements).toEqual([slottedDesignElement]);
  });

  it('renders nothing while nothing is selected', () => {
    const { container } = render(
      <DesignElementControls
        elements={designElements}
        selectedId={null}
        rows={cardRows}
        onElementsChange={() => undefined}
      />,
    );

    expect(container.querySelector('.floating-toolbar')).toBeNull();
  });

  it('carries the controls in a vertical toolbar', () => {
    const container = renderControls();

    expect(container.querySelector('.floating-toolbar')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('offers the properties to elements which take one', async () => {
    DesignElementConfigs.register({
      ...testElementConfig,
      propertyTypes: ['title'],
    });

    renderControls({
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    await userEvent.click(screen.getByLabelText('designsNext.property.label'));
    await userEvent.click(screen.getByText('Title'));

    expect(changedElement(iconDesignElement.id)?.property).toBe('Title');
  });

  it('marks the content control while the element has content', () => {
    DesignElementConfigs.register({
      ...testElementConfig,
      contentControls: TextContentControls,
    });

    renderControls({ element: { ...iconDesignElement, content: 'Body' } });

    expect(screen.getByLabelText('designsNext.content.label')).toHaveClass(
      'icon-button-highlighted',
    );
  });

  it('leaves the content control unmarked while it has none', () => {
    DesignElementConfigs.register({
      ...testElementConfig,
      contentControls: TextContentControls,
    });

    renderControls();

    expect(screen.getByLabelText('designsNext.content.label')).not.toHaveClass(
      'icon-button-highlighted',
    );
  });

  it("opens an element's static content in its content input", async () => {
    DesignElementConfigs.register({
      ...testElementConfig,
      contentControls: TextContentControls,
    });

    const element: DesignElement = { ...iconDesignElement, content: 'Body' };

    renderControls({ element });

    await userEvent.click(screen.getByLabelText('designsNext.content.label'));
    await userEvent.type(screen.getByRole('textbox'), '!');

    expect(changedElement(element.id)?.content).toBe('Body!');
  });

  it('leaves out the property picker for elements which take none', () => {
    renderControls({
      properties: [
        { type: 'title', name: 'Title', icon: 'lucide:type:default' },
      ],
    });

    expect(
      screen.queryByLabelText('designsNext.property.label'),
    ).not.toBeInTheDocument();
  });

  it('holds the width modes behind a menu, with the current mode pressed', () => {
    renderControls();

    expect(screen.queryByLabelText('designsNext.widthMode.fluid')).toBeNull();

    openMenu('designsNext.widthMode.label');

    // The icon fixture is pinned right
    expect(
      screen.getByLabelText('designsNext.widthMode.fluid'),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByLabelText('designsNext.pin.label.right'),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports the chosen width mode', () => {
    renderControls();
    openMenu('designsNext.widthMode.label');

    fireEvent.click(screen.getByLabelText('designsNext.pin.label.left'));

    expect(changedElement(iconDesignElement.id)?.widthMode).toBe('fixed-left');
  });

  it('holds the content fits behind a menu, with the current fit pressed', () => {
    renderControls();

    expect(screen.queryByLabelText('designsNext.contentFit.grow')).toBeNull();

    openMenu('designsNext.contentFit.label');

    // The icon fixture declares no fit, so it holds its height
    expect(
      screen.getByLabelText('designsNext.contentFit.fixed'),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByLabelText('designsNext.contentFit.grow'),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports the chosen content fit', () => {
    renderControls();
    openMenu('designsNext.contentFit.label');

    fireEvent.click(screen.getByLabelText('designsNext.contentFit.shrink'));

    expect(changedElement(iconDesignElement.id)?.contentFit).toBe('shrink');
  });

  it('drops the content fit for a square element', () => {
    registerSquare();
    renderControls();

    expect(screen.queryByLabelText('designsNext.contentFit.label')).toBeNull();
  });

  it('drops the fluid modes for a square element', async () => {
    registerSquare();
    renderControls({ aspectLocked: true });

    openMenu('designsNext.widthMode.label');

    expect(screen.queryByLabelText('designsNext.widthMode.fluid')).toBeNull();
    await hoverOption('designsNext.pin.label.left');

    openMenu('designsNext.heightMode.label');

    expect(screen.queryByLabelText('designsNext.heightMode.fluid')).toBeNull();
  });

  it('names the neighbour a width pin holds the element against', async () => {
    // The fixture layout sits the icon to the title's right
    renderControls({ elements: designElements });
    openMenu('designsNext.widthMode.label');
    await hoverOption('designsNext.pin.label.left');

    await screen.findByText('designsNext.pin.element.left');
  });

  it('names the design edge when nothing stands on that side', async () => {
    renderControls();
    openMenu('designsNext.widthMode.label');
    await hoverOption('designsNext.pin.label.left');

    await screen.findByText('designsNext.pin.edge.left');
  });

  it('offers height modes instead of the content fit when aspect-locked', () => {
    renderControls({ aspectLocked: true });

    expect(screen.queryByLabelText('designsNext.contentFit.label')).toBeNull();

    openMenu('designsNext.heightMode.label');

    // The element has no height mode, meaning fixed to the top edge
    expect(screen.getByLabelText('designsNext.pin.label.top')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('reports the chosen height mode', () => {
    renderControls({ aspectLocked: true });
    openMenu('designsNext.heightMode.label');

    // The element defaults to the top pin, so a change means another
    fireEvent.click(screen.getByLabelText('designsNext.pin.label.bottom'));

    expect(changedElement(iconDesignElement.id)?.heightMode).toBe(
      'fixed-bottom',
    );
  });

  it('names the neighbour a height pin holds the element against', async () => {
    // The cover stands above the body
    renderControls({
      element: pinnedBody,
      elements: [coverDesignElement, pinnedBody],
      aspectLocked: true,
    });
    openMenu('designsNext.heightMode.label');
    await hoverOption('designsNext.pin.label.top');

    await screen.findByText('designsNext.pin.element.top');
  });

  it('shows no setting groups for types without them', () => {
    renderControls();

    expect(screen.queryByLabelText('Font weight')).toBeNull();
  });

  it('renders the declared setting controls, firing changes', () => {
    registerSettingControls(['font-weight', 'font']);
    renderControls();

    openMenu('Font weight');
    fireEvent.click(screen.getByLabelText('Medium'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({
      fontWeight: 500,
    });

    openMenu('Font');
    fireEvent.click(screen.getByLabelText('Italic'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({
      italic: true,
    });
  });

  it("renders an element type's own control alongside the system ones", () => {
    DesignElementConfigs.register<StubElement>({
      ...testElementConfig,
      settingControls: ['font-size', StubSettingControl],
    });
    renderControls();

    expect(screen.getByLabelText('Font size')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Framed'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({
      framed: true,
    });
  });

  it('renders only the controls the element declares', () => {
    registerSettingControls(['background']);
    renderControls();

    expect(screen.getByLabelText('Background')).toBeInTheDocument();
    expect(screen.queryByLabelText('Corner radius')).toBeNull();
  });

  it('reports the corner radius chosen from its menu', () => {
    registerSettingControls(['corner-radius']);
    renderControls();

    openMenu('Corner radius');
    fireEvent.click(screen.getByLabelText('Full'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({
      cornerRadius: 'full',
    });
  });
});
