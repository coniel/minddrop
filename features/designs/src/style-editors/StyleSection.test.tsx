import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import { TransientViewStateProvider } from '@minddrop/ui-primitives';
import { cleanup, setup } from '../test-utils';
import { StyleSection, StyleSectionResetContext } from './StyleSection';

// The keys the section under test governs
const SectionKeys = ['fontSize', 'fontWeight'];

// The label the section renders, and the field standing in for its
// contents. The field is a plain sentinel rather than a
// translation key, since the queries translate known keys.
const SectionLabel = 'designsStudio.style.sections.typography';
const FieldLabel = 'field-under-test';

describe('<StyleSection />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('starts collapsed when none of its keys are set', () => {
    render(<TestSection />);

    // The section is offered by label, with its fields hidden
    screen.getByText(SectionLabel);
    expect(screen.queryByText(FieldLabel)).toBeNull();
  });

  it('opens when one of its keys is set', () => {
    render(<TestSection initialStyle={{ fontSize: 'lg' }} />);

    // A set value cannot hide inside a closed section
    screen.getByText(FieldLabel);
  });

  it('opens and closes when the header is clicked', () => {
    render(<TestSection />);

    fireEvent.click(screen.getByText(SectionLabel));

    screen.getByText(FieldLabel);

    fireEvent.click(screen.getByText(SectionLabel));

    expect(screen.queryByText(FieldLabel)).toBeNull();
  });

  it('enables the default styling when expanded', () => {
    render(<TestSection defaultKey="fontSize" defaultValue="md" />);

    fireEvent.click(screen.getByText(SectionLabel));

    // Opening set the default, so the section styles without a
    // first field interaction
    screen.getByText('fontSize:md');
  });

  it('clears every governed key and collapses when cleared', () => {
    render(
      <TestSection initialStyle={{ fontSize: 'lg', fontWeight: 'bold' }} />,
    );

    // The section opened itself around the set values
    screen.getByText(FieldLabel);

    // The header button clears rather than collapses while values
    // are set
    fireEvent.click(screen.getByLabelText('designs.clear-custom-styling'));

    // Every governed key is unset, and the section closed with them
    screen.getByText('empty-style');
    expect(screen.queryByText(FieldLabel)).toBeNull();
  });

  it('reopens a section which was left open', () => {
    // Stands in for the tab the studio is rendered in
    const bag: Record<string, unknown> = {};
    const value = {
      get: (key: string) => bag[key],
      set: (key: string, storedValue: unknown) => {
        bag[key] = storedValue;
      },
    };

    const panel = render(
      <TransientViewStateProvider value={value}>
        <TestSection />
      </TransientViewStateProvider>,
    );

    fireEvent.click(screen.getByText(SectionLabel));

    // Switch away from the tab, which unmounts the panel
    panel.unmount();

    render(
      <TransientViewStateProvider value={value}>
        <TestSection />
      </TransientViewStateProvider>,
    );

    screen.getByText(FieldLabel);
  });

  it('collapses an open section when the reset signal fires', () => {
    const view = render(
      <StyleSectionResetContext.Provider value={0}>
        <TestSection />
      </StyleSectionResetContext.Provider>,
    );

    fireEvent.click(screen.getByText(SectionLabel));

    screen.getByText(FieldLabel);

    // The panel-level reset bumps the signal
    view.rerender(
      <StyleSectionResetContext.Provider value={1}>
        <TestSection />
      </StyleSectionResetContext.Provider>,
    );

    expect(screen.queryByText(FieldLabel)).toBeNull();
  });

  it('holds a permanent section open without a header button', () => {
    render(<TestSection permanent initialStyle={{ fontSize: 'lg' }} />);

    // The fields are there without opening anything. The panel
    // header's reset covers a permanent section's values, so it
    // offers neither a toggle nor a clear of its own.
    screen.getByText(FieldLabel);
    expect(screen.queryByLabelText('actions.expand')).toBeNull();
    expect(screen.queryByLabelText('designs.clear-custom-styling')).toBeNull();
  });

  it('renders nothing when all of its fields are suppressed', () => {
    const { container } = render(<TestSection suppressFields />);

    // A section whose fields a role controls leaves no label
    // behind to click
    expect(screen.queryByText(SectionLabel)).toBeNull();
    expect(container.querySelector('.designs-style-section')).toBeNull();
  });
});

interface TestSectionProps {
  /**
   * The style the section reads its governed keys from.
   */
  initialStyle?: Record<string, unknown>;

  /**
   * Whether to render the section with no fields, standing in for
   * a role controlling all of them.
   */
  suppressFields?: boolean;

  /**
   * Whether the section stays open.
   */
  permanent?: boolean;

  /**
   * The key the section sets on expand, standing in for a
   * section's default styling.
   */
  defaultKey?: string;

  /**
   * The value the section sets on expand.
   */
  defaultValue?: string;
}

/**
 * Renders a style section over local style state, so the test can
 * assert what the section wrote without a studio instance.
 */
const TestSection: React.FC<TestSectionProps> = ({
  initialStyle = {},
  suppressFields = false,
  permanent = false,
  defaultKey,
  defaultValue,
}) => {
  const [style, setStyle] = useState<Record<string, unknown>>(initialStyle);

  // Read a governed key
  function getValue(key: string) {
    return style[key];
  }

  // Write a governed key, deleting it when cleared
  function setValue(key: string, value: unknown) {
    setStyle((currentStyle) => {
      const nextStyle = { ...currentStyle };

      if (value === undefined) {
        delete nextStyle[key];
      } else {
        nextStyle[key] = value;
      }

      return nextStyle;
    });
  }

  return (
    <>
      <StyleSection
        label={SectionLabel}
        keys={SectionKeys}
        permanent={permanent}
        getValue={getValue}
        setValue={setValue}
        onOpen={
          defaultKey ? () => setValue(defaultKey, defaultValue) : undefined
        }
      >
        {!suppressFields && <span>{FieldLabel}</span>}
      </StyleSection>

      {/** Markers proving what the style holds, since an absent key
       * cannot be asserted on directly **/}
      {Object.keys(style).length === 0 && <span>empty-style</span>}
      {Object.entries(style).map(([key, value]) => (
        <span key={key}>{`${key}:${value}`}</span>
      ))}
    </>
  );
};
