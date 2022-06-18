import React from 'react';
import {
  cleanup as cleanupRender,
  render,
  waitFor,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { Resources } from '@minddrop/resources';
import { Drop, Drops } from '@minddrop/drops';
import { Files } from '@minddrop/files';
import { i18n } from '@minddrop/i18n';
import { setup, cleanup, core } from '../test-utils';
import { BookmarkDropData } from '../types';
import { BookmarkDropComponent } from './BookmarkDropComponent';
import { getBookmarkPreview } from '../getBookmarkPreview';

jest.spyOn(Files, 'getUrl').mockReturnValue('image-url');
jest.mock('../getBookmarkPreview');

const withPreview: Drop<BookmarkDropData> = Resources.generateDocument(
  'drops:drop',
  {
    type: 'bookmark',
    url: 'https://minddrop.app',
    hasPreview: true,
    title: 'MindDrop',
    image: 'file-id',
    description:
      'Organize your projects, studies, research, and ideas into a visual workspace.',
  },
);
const withoutPreview: Drop<BookmarkDropData> = Resources.generateDocument(
  'drops:drop',
  {
    type: 'bookmark',
    url: 'https://minddrop.app',
    hasPreview: false,
  },
);
const withoutUrl: Drop<BookmarkDropData> = Resources.generateDocument(
  'drops:drop',
  {
    type: 'bookmark',
    url: '',
    hasPreview: false,
  },
);

describe('<BookmarkDrop />', () => {
  beforeEach(() => {
    setup();
    // Load test drops
    Drops.store.load(core, [withPreview, withoutPreview, withoutUrl]);
  });

  afterEach(() => {
    cleanup();
    cleanupRender();
    jest.clearAllMocks();
  });

  describe('with preview', () => {
    it('renders the link', () => {
      // Render a drop with preview data
      const { getByRole } = render(<BookmarkDropComponent {...withPreview} />);

      // Should render the link
      getByRole('link');
    });

    it('renders the title', () => {
      // Render a drop with preview data
      const { getByText } = render(<BookmarkDropComponent {...withPreview} />);

      // Should render the title
      getByText(withPreview.title);
    });

    it('renders the description', () => {
      // Render a drop with preview data
      const { getByText } = render(<BookmarkDropComponent {...withPreview} />);

      // Should render the description
      getByText(withPreview.description);
    });

    it('renders the URL', () => {
      // Render a drop with preview data
      const { getByText } = render(<BookmarkDropComponent {...withPreview} />);

      // Should render the URL
      getByText(withPreview.url);
    });

    it('renders the image', () => {
      // Render a drop with preview data
      const { getByAltText } = render(
        <BookmarkDropComponent {...withPreview} />,
      );

      // Should render the image (which has an empty alt value)
      expect(getByAltText('').getAttribute('src')).toBe('image-url');
    });

    it('does not fetch the preview', async () => {
      // Render a drop with preview data
      render(<BookmarkDropComponent {...withPreview} />);

      // Should not call 'getBookmarkPreview'
      expect(getBookmarkPreview).not.toHaveBeenCalled();
    });
  });

  describe('wihtout preview', () => {
    it('fetches the preview', async () => {
      // Render a drop without preview data
      render(<BookmarkDropComponent {...withoutPreview} />);

      await waitFor(() => {
        // Should call 'getBookmarkPreview' with the drop
        // ID and URL.
        expect(getBookmarkPreview).toHaveBeenCalledWith(
          expect.anything(),
          withoutPreview.id,
          withoutPreview.url,
          expect.anything(),
        );
        // Should only fetch preview once
        expect(getBookmarkPreview).toHaveBeenCalledTimes(1);
      });
    });

    it('renders the link', () => {
      // Render a drop without preview data
      const { getByRole } = render(<BookmarkDropComponent {...withPreview} />);

      // Should render the link
      getByRole('link');
    });
  });

  describe('without URL', () => {
    it('does not render the link', () => {
      // Render a drop without a URL
      const { queryByRole } = render(<BookmarkDropComponent {...withoutUrl} />);

      // Should not render the link
      expect(queryByRole('link')).toBeNull();
    });

    it('renders placeholder text', () => {
      // Render a drop without a URL
      const { getByText } = render(<BookmarkDropComponent {...withoutUrl} />);

      // Get the placeholder text
      const placeholder = i18n.t('bookmarkPlaceholder');

      // Should render placeholder text
      getByText(placeholder);
    });

    it('opens the URL form popover when clicked', async () => {
      // Render a drop without a URL
      const { getByText, findByPlaceholderText } = render(
        <BookmarkDropComponent {...withoutUrl} />,
      );

      // Get the placeholder text
      const placeholder = i18n.t('bookmarkPlaceholder');

      act(() => {
        // Click the drop
        fireEvent.click(getByText(placeholder));
      });

      // Should render the placeholder form
      await findByPlaceholderText('https://...');
    });
  });

  describe('URL form', () => {
    it('updates the drop URL', async () => {
      // Render a drop without a URL
      const { getByText, findByPlaceholderText } = render(
        <BookmarkDropComponent {...withoutUrl} />,
      );

      // Get i18n text values
      const placeholder = i18n.t('bookmarkPlaceholder');
      const saveButton = i18n.t('save');

      act(() => {
        // Click the drop to open the form
        fireEvent.click(getByText(placeholder));
      });

      // Type a URL into the URL field
      fireEvent.change(await findByPlaceholderText('https://...'), {
        target: { value: 'https://minddrop.app' },
      });

      // Submit the form
      act(() => {
        fireEvent.click(getByText(saveButton));
      });

      // Get the updated drop
      const drop = Drops.get<BookmarkDropData>(withoutUrl.id);

      // Drop should have the URL
      expect(drop.url).toBe('https://minddrop.app');
    });
  });
});
