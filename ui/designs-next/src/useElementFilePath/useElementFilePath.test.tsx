import { afterEach, describe, expect, it } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '../DesignPropertiesProvider';
import { cleanup } from '../test-utils';
import { useElementFilePath } from './useElementFilePath';

const { titleDesignElement } = DesignElementFixtures;

// The schema holding the Cover and Pages properties
const properties: PropertiesSchema = [
  { type: 'image', name: 'Cover' },
  { type: 'image', name: 'Pages' },
];

// The values, the Cover a file's path and the Pages several
const values: PropertyMap = {
  Cover: '/workspace/Entry/cover.png',
  Pages: ['/workspace/Entry/page-1.png', '/workspace/Entry/page-2.png'],
};

interface ProbeProps {
  /**
   * The element to resolve the file path of.
   */
  element: DesignElement;
}

/**
 * Renders the path the hook resolves for an element, 'none' when
 * it resolves none.
 */
const PathProbe: React.FC<ProbeProps> = ({ element }) => {
  const path = useElementFilePath(element);

  return <div data-testid="path">{path ?? 'none'}</div>;
};

/**
 * Renders the probe on an element mapped to the given property.
 *
 * @param property - The property the element maps to.
 * @returns The probe's text.
 */
function renderProbe(property?: string): string {
  render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <PathProbe element={{ ...titleDesignElement, property }} />
    </DesignPropertiesProvider>,
  );

  return screen.getByTestId('path').textContent ?? '';
}

describe('useElementFilePath', () => {
  afterEach(cleanup);

  it("returns the mapped property's file path", () => {
    expect(renderProbe('Cover')).toBe(values.Cover);
  });

  it('returns null when the element is unmapped', () => {
    expect(renderProbe()).toBe('none');
  });

  it('returns null when the property holds several files', () => {
    expect(renderProbe('Pages')).toBe('none');
  });
});
