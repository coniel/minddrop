import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { DateElement } from '../DateElement.types';
import { DateElementConfig } from '../DateElementConfig';
import { DateElementRenderer } from './DateElementRenderer';

const { titleDesignElement } = DesignElementFixtures;

// A date element mapped to the Due property, with content of its
// own which it never falls back to.
const dateElement: DateElement = {
  ...titleDesignElement,
  type: DateElementConfig.type,
  property: 'Due',
  content: 'Placeholder',
};

// The schema with the Due property
const properties: PropertiesSchema = [{ type: 'date', name: 'Due' }];

// The time the tests run at
const now = new Date(2025, 5, 15, 12);

// The Due property's value. Built after the clock is pinned, since
// pinning replaces the Date class and a date built before it fails
// the renderer's instanceof check.
let due: Date;

/**
 * Renders the element with the given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The rendered element's box.
 */
function renderDate(element: DateElement, values: PropertyMap = {}) {
  // Render the element with the property values
  const { container } = render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <DateElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );

  // Find the element's box
  return container.querySelector<HTMLElement>('.design-text-element')!;
}

describe('DateElementRenderer', () => {
  beforeEach(() => {
    // Pin the clock
    vi.setSystemTime(now);

    due = new Date(2025, 0, 15);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders the mapped date at medium length by default', () => {
    renderDate(dateElement, { Due: due });

    expect(screen.getByText('15 Jan 2025')).toBeInTheDocument();
  });

  it('renders the date in the style set', () => {
    renderDate({ ...dateElement, dateStyle: 'long' }, { Due: due });

    expect(screen.getByText('15 January 2025')).toBeInTheDocument();
  });

  it('follows the date with the time when set to', () => {
    renderDate({ ...dateElement, showTime: true }, { Due: due });

    expect(screen.getByText('15 Jan 2025, 00:00')).toBeInTheDocument();
  });

  it('renders the date relative to now when set to', () => {
    // Two days before now
    const recent = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    renderDate(
      { ...dateElement, mode: 'relative', dateStyle: 'long', showTime: true },
      { Due: recent },
    );

    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  it('renders the current date when unmapped', () => {
    renderDate({ ...dateElement, property: undefined }, { Due: due });

    expect(screen.getByText('15 Jun 2025')).toBeInTheDocument();
    expect(screen.queryByText(dateElement.content!)).toBeNull();
  });

  it('renders nothing when the property has no value', () => {
    const box = renderDate(dateElement);

    expect(box.textContent).toBe('');
    expect(screen.queryByText(dateElement.content!)).toBeNull();
  });
});
