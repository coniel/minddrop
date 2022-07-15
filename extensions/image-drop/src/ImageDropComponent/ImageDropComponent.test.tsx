import React from 'react';
import {
  cleanup as cleanupRender,
  render,
  act,
  fireEvent,
  imageFile,
} from '@minddrop/test-utils';
import { DataInsert } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { Drop, Drops } from '@minddrop/drops';
import { Files } from '@minddrop/files';
import { i18n } from '@minddrop/i18n';
import { setup, cleanup, core } from '../test-utils';
import { ImageDropData } from '../types';
import { ImageDropComponent } from './ImageDropComponent';
import { ImageDropConfig } from '../ImageDropConfig';

jest.spyOn(Files, 'getUrl').mockReturnValue('image-url');

const imageDataInsert: DataInsert = {
  action: 'insert',
  types: ['files'],
  data: {},
  files: [imageFile],
};

const withFile: Drop<ImageDropData> = Resources.generateDocument('drops:drop', {
  type: 'image',
  file: 'file-id',
});
const withoutFile: Drop<ImageDropData> = Resources.generateDocument(
  'drops:drop',
  {
    type: 'image',
  },
);

describe('<ImageDrop />', () => {
  beforeEach(() => {
    setup();
    // Load test drops
    Drops.store.load(core, [withFile, withoutFile]);
  });

  afterEach(() => {
    act(() => {
      cleanup();
      cleanupRender();
      jest.clearAllMocks();
    });
  });

  describe('with file', () => {
    it('renders the image', () => {
      // Render a drop with a file
      const { getByRole } = render(<ImageDropComponent {...withFile} />);

      // Should render the image (which has an empty alt value)
      expect(getByRole('img').getAttribute('src')).toBe('image-url');
    });

    it('does not render the placeholder', () => {
      // Render a drop with a file
      const { queryByText } = render(<ImageDropComponent {...withFile} />);

      // Get the placeholder text
      const placeholder = i18n.t('imagePlaceholder');

      // Should not render the placeholder
      expect(queryByText(placeholder)).toBeNull();
    });

    // An image drop can have both a file and a data
    // insert if the drop is rerendered afer the file
    // has been saved and the data insert is still in
    // the drop data inserts store.
    describe('with data insert', () => {
      it('renders the image using the file URL', async () => {
        // Create a drop from an image data insert.
        // The data insert will be available to the drop
        // component via the drop data inserts store.
        const drops = Drops.createFromDataInsert(core, imageDataInsert, [
          ImageDropConfig,
        ]);
        const drop = Object.values(drops)[0] as Drop<ImageDropData>;

        // Add a file ID to the drop
        drop.file = 'image-file-id';

        await act(async () => {
          // Render the drop
          const { findByRole } = render(<ImageDropComponent {...drop} />);

          // Should render the image
          const image = await findByRole('img');

          // Should render the image using the file's URL
          // rather than the data insert file's base64 data.
          expect(image.getAttribute('src')).toBe('image-url');
        });
      });

      it('does not save the data insert file again', async () => {
        jest.spyOn(Files, 'save');

        // Create a drop from an image data insert.
        // The data insert will be available to the drop
        // component via the drop data inserts store.
        const drops = Drops.createFromDataInsert(core, imageDataInsert, [
          ImageDropConfig,
        ]);
        const drop = Object.values(drops)[0] as Drop<ImageDropData>;

        // Add a file ID to the drop
        drop.file = 'image-file-id';

        act(() => {
          // Render the drop
          render(<ImageDropComponent {...drop} />);
        });

        // Wait for a second to allow the useEffect hooks
        // to run after rerenders.
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        // Should not save the file
        expect(Files.save).not.toHaveBeenCalled();
      });
    });

    describe('file input', () => {
      it('saves the file', async () => {
        jest.spyOn(Files, 'save');

        await act(async () => {
          // Render a drop with a file
          const { getByTestId, getByRole } = render(
            <ImageDropComponent {...withFile} />,
          );

          // Simulate a file selection
          fireEvent.change(getByTestId('file-input'), {
            target: { files: [imageFile] },
          });

          // Wait for a second to allow rerender
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });

          // Should save the file
          expect(Files.save).toHaveBeenCalledWith(expect.anything(), imageFile);
          // Should set the file data URL as the image URL
          expect(
            getByRole('img')
              .getAttribute('src')
              .startsWith('data:image/jpeg;base64'),
          ).toBeTruthy();
        });
      });
    });
  });

  describe('without file', () => {
    it('does not render an image', () => {
      // Render a drop without an image file
      const { queryByRole } = render(<ImageDropComponent {...withoutFile} />);

      // Should not render the image
      expect(queryByRole('img')).toBeNull();
    });

    describe('without data insert', () => {
      it('renders the placeholder', () => {
        // Render a drop without an image file
        const { getByText } = render(<ImageDropComponent {...withoutFile} />);

        // Get the placeholder text
        const placeholder = i18n.t('imagePlaceholder');

        // Should render placeholder text
        getByText(placeholder);
      });

      describe('file input', () => {
        it('saves the file', async () => {
          jest.spyOn(Files, 'save');

          await act(async () => {
            // Render a drop with a file
            const { getByTestId, getByRole } = render(
              <ImageDropComponent {...withoutFile} />,
            );

            // Simulate a file selection
            fireEvent.change(getByTestId('file-input'), {
              target: { files: [imageFile] },
            });

            // Wait for a second to allow rerender
            await new Promise((resolve) => {
              setTimeout(resolve, 1000);
            });

            // Should save the file
            expect(Files.save).toHaveBeenCalledWith(
              expect.anything(),
              imageFile,
            );
            // Should set the file data URL as the image URL
            expect(
              getByRole('img')
                .getAttribute('src')
                .startsWith('data:image/jpeg;base64'),
            ).toBeTruthy();
          });
        });
      });
    });

    describe('with data insert', () => {
      it('renders the image using the inserted file', async () => {
        // Create a drop from an image data insert.
        // The data insert will be available to the drop
        // component via the drop data inserts store.
        const drops = Drops.createFromDataInsert(core, imageDataInsert, [
          ImageDropConfig,
        ]);
        const drop = Object.values(drops)[0];

        await act(async () => {
          // Render the drop
          const { findByRole } = render(<ImageDropComponent {...drop} />);

          // Should render the image
          const image = await findByRole('img');

          // Should render the image using the data URL
          expect(
            image.getAttribute('src').startsWith('data:image/jpeg;base64'),
          ).toBeTruthy();
        });
      });

      it('saves the image file and adds it to the drop', (done) => {
        jest.spyOn(Drops, 'update');
        // Create a drop from an image data insert.
        // The data insert will be available to the drop
        // component via the drop data inserts store.
        const drops = Drops.createFromDataInsert(core, imageDataInsert, [
          ImageDropConfig,
        ]);
        const drop = Object.values(drops)[0];

        act(() => {
          // Render the drop
          render(<ImageDropComponent {...drop} />);
        });

        Drops.addEventListener(core, 'drops:drop:update', ({ data }) => {
          const updatedDrop = data.after as Drop<ImageDropData>;

          // Drop should have a file
          expect(updatedDrop.file).toBeDefined();
          expect(Drops.update).toHaveBeenCalledTimes(1);
          done();
        });
      });

      it('saves the image file only once', async () => {
        jest.spyOn(Files, 'save');

        // Create a drop from an image data insert.
        // The data insert will be available to the drop
        // component via the drop data inserts store.
        const drops = Drops.createFromDataInsert(core, imageDataInsert, [
          ImageDropConfig,
        ]);
        const drop = Object.values(drops)[0];

        act(() => {
          // Render the drop
          render(<ImageDropComponent {...drop} />);
        });

        // Wait for a second to allow the useEffect hooks
        // to run after rerenders.
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        // Should only save the file once
        expect(Files.save).toHaveBeenCalledTimes(1);
      });

      it('does not render the placeholder', async () => {
        // Create a drop from an image data insert.
        // The data insert will be available to the drop
        // component via the drop data inserts store.
        const drops = Drops.createFromDataInsert(core, imageDataInsert, [
          ImageDropConfig,
        ]);
        const drop = Object.values(drops)[0];

        act(() => {
          // Render the drop
          const { queryByText } = render(<ImageDropComponent {...drop} />);

          // Get the placeholder text
          const placeholder = i18n.t('imagePlaceholder');

          // Should not render the placeholder
          expect(queryByText(placeholder)).toBeNull();
        });
      });

      describe('file input', () => {
        it('saves the file', async () => {
          jest.spyOn(Files, 'save');

          // Create a drop from an image data insert.
          // The data insert will be available to the drop
          // component via the drop data inserts store.
          const drops = Drops.createFromDataInsert(core, imageDataInsert, [
            ImageDropConfig,
          ]);
          const drop = Object.values(drops)[0];

          await act(async () => {
            // Render a drop with a file
            const { getByTestId, getByRole } = render(
              <ImageDropComponent {...drop} />,
            );

            // Simulate a file selection
            fireEvent.change(getByTestId('file-input'), {
              target: { files: [imageFile] },
            });

            // Wait for a second to allow rerender
            await new Promise((resolve) => {
              setTimeout(resolve, 1000);
            });

            // Should save the file
            expect(Files.save).toHaveBeenCalledWith(
              expect.anything(),
              imageFile,
            );
            // Should set the file data URL as the image URL
            expect(
              getByRole('img')
                .getAttribute('src')
                .startsWith('data:image/jpeg;base64'),
            ).toBeTruthy();
          });
        });
      });
    });
  });
});
