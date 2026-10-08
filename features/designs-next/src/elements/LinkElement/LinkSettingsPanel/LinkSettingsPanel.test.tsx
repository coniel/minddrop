import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { LinkElement } from '../LinkElement.types';
import { LinkElementConfig } from '../LinkElementConfig';
import { LinkSettingsPanel } from './LinkSettingsPanel';

const { titleDesignElement } = DesignElementFixtures;

// The settings passed to the most recent change callback
let changedSettings: Partial<LinkElement> | null;

/**
 * Renders the panel on a link element with a recording change
 * callback.
 *
 * @param element - The link element the panel configures.
 */
function renderPanel(element: Partial<LinkElement> = {}) {
  changedSettings = null;

  render(
    <LinkSettingsPanel
      element={{
        ...titleDesignElement,
        type: LinkElementConfig.type,
        ...element,
      }}
      onChange={(settings) => {
        changedSettings = settings;
      }}
    />,
  );
}

describe('LinkSettingsPanel', () => {
  afterEach(cleanup);

  it('marks every part when the element has none set', () => {
    renderPanel();

    expect(screen.getByLabelText('Protocol')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Path')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the parts the element shows alone', () => {
    renderPanel({ urlParts: ['domain', 'tld'] });

    expect(screen.getByLabelText('Domain')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Protocol')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('hides a part when its toggle is turned off', () => {
    renderPanel();

    fireEvent.click(screen.getByLabelText('Protocol'));

    expect(changedSettings).toEqual({
      urlParts: ['subdomain', 'domain', 'tld', 'path'],
    });
  });

  it('stores a turned-on part in the order the parts are written', () => {
    renderPanel({ urlParts: ['domain', 'tld'] });

    fireEvent.click(screen.getByLabelText('Protocol'));

    expect(changedSettings).toEqual({
      urlParts: ['protocol', 'domain', 'tld'],
    });
  });

  it('keeps the last part shown', () => {
    renderPanel({ urlParts: ['domain'] });

    fireEvent.click(screen.getByLabelText('Domain'));

    expect(changedSettings).toBeNull();
  });
});
