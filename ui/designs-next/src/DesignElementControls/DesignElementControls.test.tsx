import { afterEach, describe, expect, it } from 'vitest';
import {
  DesignElement,
  DesignElementConfigs,
  DesignElementSettingGroup,
  DesignElementSettingsControlsProps,
} from '@minddrop/designs-next';
import {
  DesignElementConfigsStore,
  bodyDesignElement,
  cardRows,
  coverDesignElement,
  designElements,
  iconDesignElement,
  testElementConfig,
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
 * @param settingGroups - The setting groups to register.
 */
function registerSettingGroups(settingGroups: DesignElementSettingGroup[]) {
  DesignElementConfigs.register({ ...testElementConfig, settingGroups });
}

interface StubElement extends DesignElement {
  /**
   * A stub element-specific setting.
   */
  framed?: boolean;
}

// Stand-in element settings controls writing an element-specific setting
const StubSettingsControls: React.FC<
  DesignElementSettingsControlsProps<StubElement>
> = ({ onSettingsChange }) => (
  <button
    type="button"
    aria-label="Framed"
    onClick={() => onSettingsChange({ framed: true })}
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
      selectedId={element.id}
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
    DesignElementConfigsStore.clear();
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

  it('reflects and toggles natural height', () => {
    renderControls();

    const toggle = screen.getByLabelText('Natural height');

    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);

    expect(changedElement(iconDesignElement.id)?.naturalHeight).toBe(true);
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

  it('offers height modes instead of natural height when aspect-locked', () => {
    renderControls({ aspectLocked: true });

    expect(screen.queryByLabelText('Natural height')).toBeNull();

    openMenu('designsNext.heightMode.label');

    // The element has no height mode, meaning fluid
    expect(
      screen.getByLabelText('designsNext.heightMode.fluid'),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports the chosen height mode', () => {
    renderControls({ aspectLocked: true });
    openMenu('designsNext.heightMode.label');

    fireEvent.click(screen.getByLabelText('designsNext.pin.label.top'));

    expect(changedElement(iconDesignElement.id)?.heightMode).toBe('fixed-top');
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

    expect(screen.queryByLabelText('Bold')).toBeNull();
  });

  it('renders the text setting group with toggles firing changes', () => {
    registerSettingGroups(['text']);
    renderControls();

    fireEvent.click(screen.getByLabelText('Bold'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({ bold: true });

    fireEvent.click(screen.getByLabelText('Italic'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({
      italic: true,
    });
  });

  it('renders the element type settings controls', () => {
    DesignElementConfigs.register<StubElement>({
      ...testElementConfig,
      settingsControls: StubSettingsControls,
    });
    renderControls();

    fireEvent.click(screen.getByLabelText('Framed'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({
      framed: true,
    });
  });

  it('renders the background group with its corner radius menu', () => {
    registerSettingGroups(['background']);
    renderControls();

    expect(screen.getByLabelText('Background')).toBeInTheDocument();
    expect(screen.getByLabelText('Corner radius')).toBeInTheDocument();
  });

  it('reports the corner radius chosen from its menu', () => {
    registerSettingGroups(['background']);
    renderControls();

    openMenu('Corner radius');
    fireEvent.click(screen.getByLabelText('Full'));

    expect(changedElement(iconDesignElement.id)).toMatchObject({
      cornerRadius: 'full',
    });
  });
});
