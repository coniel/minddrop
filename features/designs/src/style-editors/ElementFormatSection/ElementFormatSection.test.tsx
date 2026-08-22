import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DateElement,
  DesignElement,
  Layout,
  NumberElement,
  UrlElement,
} from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../../DesignStudioStore';
import { cleanup, setup } from '../../test-utils';
import {
  FlatDateElement,
  FlatNumberElement,
  FlatUrlElement,
} from '../../types';
import { DateFormatFields } from './DateFormatFields';
import { NumberFormatFields } from './NumberFormatFields';
import { UrlFormatFields } from './UrlFormatFields';
import { elementFormatEditors } from './elementFormatEditors';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

// A URL element, built from the text element fixture's base shape
const element_url: UrlElement = {
  ...element_text_1,
  id: 'url-element',
  type: 'url',
};

// A date element in the default absolute mode
const element_date: DateElement = {
  ...element_text_1,
  id: 'date-element',
  type: 'date',
};

// A number element carrying a full format, for checking that
// editing one field leaves the others alone
const element_number: NumberElement = {
  ...element_text_1,
  id: 'number-element',
  type: 'number',
  format: {
    decimals: 2,
    thousandsSeparator: 'comma',
    prefix: '$',
    suffix: ' USD',
    signDisplay: 'always',
  },
};

describe('element format editors', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  describe('registry', () => {
    it('has an editor for each element type which formats its value', () => {
      expect(elementFormatEditors.url).toBe(UrlFormatFields);
      expect(elementFormatEditors.date).toBe(DateFormatFields);
      expect(elementFormatEditors.number).toBe(NumberFormatFields);
    });

    it('has no editor for element types displaying their value as is', () => {
      expect(elementFormatEditors.text).toBeUndefined();
      expect(elementFormatEditors.container).toBeUndefined();
      expect(elementFormatEditors.image).toBeUndefined();
    });
  });

  describe('<UrlFormatFields />', () => {
    it('renders a switch per URL part', () => {
      const studio = studioWith(element_url);

      render(
        <DesignStudioProvider store={studio}>
          <UrlFormatFields elementId={element_url.id} />
        </DesignStudioProvider>,
      );

      screen.getByText('designs.url-show-protocol');
      screen.getByText('designs.url-show-subdomain');
      screen.getByText('designs.url-show-domain');
      screen.getByText('designs.url-show-tld');
      screen.getByText('designs.url-show-path');
    });

    it('writes the toggled part to the element', () => {
      const studio = studioWith(element_url);

      const { container } = render(
        <DesignStudioProvider store={studio}>
          <UrlFormatFields elementId={element_url.id} />
        </DesignStudioProvider>,
      );

      // The protocol switch is the first of the five
      const protocolSwitch = container.querySelectorAll('[role="switch"]')[0];

      fireEvent.click(protocolSwitch);

      const element = studio.getDesignElement<FlatUrlElement>(element_url.id);

      // Parts default to visible, so the first toggle hides one
      expect(element.showProtocol).toBe(false);
    });
  });

  describe('<DateFormatFields />', () => {
    it('renders the mode toggle and absolute date controls', () => {
      const studio = studioWith(element_date);

      render(
        <DesignStudioProvider store={studio}>
          <DateFormatFields elementId={element_date.id} />
        </DesignStudioProvider>,
      );

      screen.getByText('designs.date-format.mode.date');
      screen.getByText('designs.date-format.mode.relative');
      screen.getByText('designs.date-format.show-time');
    });

    it('disables the style and time controls in relative mode', () => {
      // A date element already set to relative mode
      const relativeElement: DateElement = {
        ...element_date,
        format: { mode: 'relative', dateStyle: 'medium', showTime: false },
      };

      const studio = studioWith(relativeElement);

      const { container } = render(
        <DesignStudioProvider store={studio}>
          <DateFormatFields elementId={relativeElement.id} />
        </DesignStudioProvider>,
      );

      // A relative date describes an interval, so neither the
      // style preset nor the time apply to it
      const timeSwitch = container.querySelector('[role="switch"]');

      expect(timeSwitch?.getAttribute('aria-disabled')).toBe('true');
    });

    it('writes the selected mode to the element format', () => {
      const studio = studioWith(element_date);

      render(
        <DesignStudioProvider store={studio}>
          <DateFormatFields elementId={element_date.id} />
        </DesignStudioProvider>,
      );

      fireEvent.click(screen.getByText('designs.date-format.mode.relative'));

      const element = studio.getDesignElement<FlatDateElement>(element_date.id);

      expect(element.format?.mode).toBe('relative');
    });
  });

  describe('<NumberFormatFields />', () => {
    it('renders the format controls', () => {
      const studio = studioWith(element_number);

      render(
        <DesignStudioProvider store={studio}>
          <NumberFormatFields elementId={element_number.id} />
        </DesignStudioProvider>,
      );

      screen.getByText('designs.number-format.thousands-separator.label');
      screen.getByText('designs.number-format.decimals.label');
      screen.getByText('designs.number-format.prefix');
      screen.getByText('designs.number-format.suffix');
    });

    it('preserves the other format fields when one changes', () => {
      const studio = studioWith(element_number);

      const { container } = render(
        <DesignStudioProvider store={studio}>
          <NumberFormatFields elementId={element_number.id} />
        </DesignStudioProvider>,
      );

      // Change the prefix, the first of the two plain text fields.
      // The decimals field is excluded, since a number input renders
      // a text input of its own.
      const prefixField = container.querySelectorAll(
        'input.text-input-input:not(.number-input-input)',
      )[0];

      fireEvent.change(prefixField, { target: { value: '£' } });

      const element = studio.getDesignElement<FlatNumberElement>(
        element_number.id,
      );

      // The edited field is written, and the rest of the format
      // survives the merge
      expect(element.format).toEqual({
        decimals: 2,
        thousandsSeparator: 'comma',
        prefix: '£',
        suffix: ' USD',
        signDisplay: 'always',
      });
    });
  });
});

/**
 * Creates a studio holding a design whose card layout contains
 * only the given element.
 */
function studioWith(element: DesignElement): DesignStudioStore {
  const layout: Layout = {
    ...layout_card_1,
    tree: { ...layout_card_1.tree, children: [element] },
  };

  const studio = createDesignStudioStore();

  studio.initialize({ ...design_books, layouts: [layout] });
  studio.setActiveLayout(layout.id);

  return studio;
}
