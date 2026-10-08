import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import {
  registerBackendUtilsAdapter,
  unregisterBackendUtilsAdapter,
} from '@minddrop/utils';
import { cleanup } from '../../../test-utils';
import { LinkElement } from '../LinkElement.types';
import { LinkElementConfig } from '../LinkElementConfig';
import { LinkElementRenderer } from './LinkElementRenderer';

const { titleDesignElement } = DesignElementFixtures;

// A link element mapped to the Website property
const linkElement: LinkElement = {
  ...titleDesignElement,
  type: LinkElementConfig.type,
  property: 'Website',
  content: 'https://placeholder.example',
};

// The schema with the Website property
const properties: PropertiesSchema = [{ type: 'url', name: 'Website' }];

// The Website property's value
const website = 'https://example.com/page';

// The address the most recent click opened
let openedUrl: string | null;

// Whether a click reached the element's parent
let parentClicked: boolean;

/**
 * Renders the element inside a parent recording clicks, with the
 * given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The rendered link.
 */
function renderLink(element: LinkElement, values: PropertyMap = {}) {
  // Render the element with the property values
  const { container } = render(
    <div onClick={() => (parentClicked = true)}>
      <DesignPropertiesProvider properties={properties} values={values}>
        <LinkElementRenderer element={element} />
      </DesignPropertiesProvider>
    </div>,
  );

  // Find the link
  return container.querySelector('.design-link-element')!;
}

describe('LinkElementRenderer', () => {
  beforeEach(() => {
    // Reset what the previous test recorded
    openedUrl = null;
    parentClicked = false;

    // Record the address each openUrl call opens
    registerBackendUtilsAdapter({
      openUrl: async (url) => {
        openedUrl = url;
      },
      openFile: async () => {},
      showItemInFolder: async () => {},
      getWebpageHtml: async () => '',
    });
  });

  afterEach(() => {
    // Unmount and drop the recording adapter
    cleanup();
    unregisterBackendUtilsAdapter();
  });

  it('renders the mapped address', () => {
    renderLink(linkElement, { Website: website });

    expect(screen.getByText(website)).toBeInTheDocument();
  });

  it('shows the parts of the address the element sets', () => {
    renderLink(
      { ...linkElement, urlParts: ['domain', 'tld'] },
      { Website: website },
    );

    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('shows the parts of its own content the element sets when unmapped', () => {
    renderLink({
      ...linkElement,
      property: undefined,
      urlParts: ['domain', 'tld'],
    });

    expect(screen.getByText('placeholder.example')).toBeInTheDocument();
  });

  it('shows the whole address when none of the parts set are in it', () => {
    renderLink(
      { ...linkElement, urlParts: ['subdomain'] },
      { Website: website },
    );

    expect(screen.getByText(website)).toBeInTheDocument();
  });

  it('opens the whole address when showing part of it', () => {
    renderLink(
      { ...linkElement, urlParts: ['domain', 'tld'] },
      { Website: website },
    );

    fireEvent.click(screen.getByText('example.com'));

    expect(openedUrl).toBe(website);
  });

  it('opens the address when clicked', () => {
    renderLink(linkElement, { Website: website });

    fireEvent.click(screen.getByText(website));

    expect(openedUrl).toBe(website);
  });

  it('does not navigate the window to the address', () => {
    renderLink(linkElement, { Website: website });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    screen.getByText(website).dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
  });

  it('does not propagate the click to its parent', () => {
    renderLink(linkElement, { Website: website });

    fireEvent.click(screen.getByText(website));

    expect(parentClicked).toBe(false);
  });

  it('renders its own content when unmapped', () => {
    renderLink({ ...linkElement, property: undefined }, { Website: website });

    expect(screen.getByText(linkElement.content!)).toBeInTheDocument();
  });

  it('renders its own content when the property has no value', () => {
    renderLink(linkElement);

    expect(screen.getByText(linkElement.content!)).toBeInTheDocument();
  });

  it('renders its own content when the property is empty', () => {
    renderLink(linkElement, { Website: '' });

    expect(screen.getByText(linkElement.content!)).toBeInTheDocument();
  });

  it('opens its own content when unmapped', () => {
    renderLink({ ...linkElement, property: undefined });

    fireEvent.click(screen.getByText(linkElement.content!));

    expect(openedUrl).toBe(linkElement.content);
  });

  it('opens nothing without an address', () => {
    const link = renderLink({
      ...linkElement,
      property: undefined,
      content: undefined,
    });

    fireEvent.click(link);

    expect(openedUrl).toBe(null);
  });
});
