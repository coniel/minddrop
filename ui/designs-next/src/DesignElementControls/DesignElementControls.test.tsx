import { afterEach, describe, expect, it } from 'vitest';
import {
  DesignElement,
  DesignElementConfigs,
  DesignElementSettingGroup,
  DesignElementSettingsMenuProps,
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
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignElementControls } from './DesignElementControls';

// The elements passed to the most recent onElementsChange call
let changedElements: DesignElement[] | null;

// A bottom-pinned body below the fluid-height cover, whose vertical
// pin the cover overrides.
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

// Stand-in element settings menu writing an element-specific setting
const StubSettingsMenu: React.FC<
  DesignElementSettingsMenuProps<StubElement>
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
   * Defaults to the element on its own, so nothing overrides it.
   */
  elements?: DesignElement[];

  /**
   * Whether the design is aspect-locked.
   */
  aspectLocked?: boolean;
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

  it('holds the width modes behind a menu, with the current mode pressed', () => {
    renderControls();

    expect(screen.queryByLabelText('Fluid width')).toBeNull();

    openMenu('Width');

    // The icon fixture is pinned right
    expect(screen.getByLabelText('Fluid width')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByLabelText('Fixed width, pinned right')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('reports the chosen width mode', () => {
    renderControls();
    openMenu('Width');

    fireEvent.click(screen.getByLabelText('Fixed width, pinned left'));

    expect(changedElement(iconDesignElement.id)?.widthMode).toBe('fixed-left');
  });

  it('reflects and toggles natural height', () => {
    renderControls();

    const toggle = screen.getByLabelText('Natural height');

    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);

    expect(changedElement(iconDesignElement.id)?.naturalHeight).toBe(true);
  });

  it('mutes the pin choices while overridden', () => {
    // The fixture layout sits the fixed icon beside the fluid title
    renderControls({ elements: designElements });
    openMenu('Width');

    // The three pin toggles mute, the fluid toggle does not
    expect(
      document.querySelectorAll('.design-element-controls-pin-overridden'),
    ).toHaveLength(3);
  });

  it('does not mute the pin choices without an override', () => {
    renderControls();
    openMenu('Width');

    expect(
      document.querySelectorAll('.design-element-controls-pin-overridden'),
    ).toHaveLength(0);
  });

  it('offers height modes instead of natural height when aspect-locked', () => {
    renderControls({ aspectLocked: true });

    expect(screen.queryByLabelText('Natural height')).toBeNull();

    openMenu('Height');

    // The element has no height mode, meaning fluid
    expect(screen.getByLabelText('Fluid height')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('reports the chosen height mode', () => {
    renderControls({ aspectLocked: true });
    openMenu('Height');

    fireEvent.click(screen.getByLabelText('Fixed height, pinned top'));

    expect(changedElement(iconDesignElement.id)?.heightMode).toBe('fixed-top');
  });

  it('mutes the vertical pin choices while overridden', () => {
    // The fluid-height cover above the pinned body overrides it
    renderControls({
      element: pinnedBody,
      elements: [coverDesignElement, pinnedBody],
      aspectLocked: true,
    });
    openMenu('Height');

    // The three vertical pin toggles mute
    expect(
      document.querySelectorAll('.design-element-controls-pin-overridden'),
    ).toHaveLength(3);
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

  it('renders the element type settings menu', () => {
    DesignElementConfigs.register<StubElement>({
      ...testElementConfig,
      settingsMenu: StubSettingsMenu,
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
