import { Fs } from '@minddrop/file-system';
import { I18n } from '@minddrop/i18n';
import { DesignFileExtension } from '../constants';
import { loadDesigns } from '../loadDesigns';
import { locales } from '../locales';
import { readDesign } from '../readDesign';
import { resolveDesignsDirPath } from '../utils';

/**
 * Initializes designs: registers the package's translations, then
 * reads design files from the file system into the store.
 *
 * @dispatches designs-next:loaded
 */
export async function initializeDesigns(): Promise<void> {
  // Register the package's translations
  I18n.registerTranslations(locales);

  // Nothing to read if the designs directory does not exist yet.
  // The loaded event still fires so that listeners waiting on it
  // are not left hanging in a workspace with no designs.
  if (!(await Fs.exists(resolveDesignsDirPath()))) {
    loadDesigns([]);

    return;
  }

  // Read the entries in the designs directory
  const entries = await Fs.readDir(resolveDesignsDirPath());

  // Filter for design files
  const designFiles = entries.filter(
    (entry) => Fs.getFileExtension(entry.path) === DesignFileExtension,
  );

  // Read a design from each file, discarding files which are not
  // valid designs.
  const designs = (
    await Promise.all(designFiles.map((entry) => readDesign(entry.path)))
  ).filter((design) => design !== null);

  // Load the designs into the store
  loadDesigns(designs);
}
