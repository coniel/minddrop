/**
 * The platform a build is for. Matches the names the base layout's platform
 * detection reports.
 */
export type DownloadPlatform = 'mac' | 'windows' | 'linux';

export interface Download {
  /**
   * The platform this build runs on.
   */
  platform: DownloadPlatform;

  /**
   * The platform's name, as it is shown on the button.
   */
  name: string;

  /**
   * Where the build is downloaded from.
   */
  href: string;
}

/**
 * Where every build is published. The per-platform links point here until
 * there are release assets to link to directly.
 */
export const releasesUrl = 'https://github.com/coniel/minddrop/releases';

/**
 * The builds offered on the download section, in the order they are shown.
 */
export const downloads: Download[] = [
  { platform: 'mac', name: 'Mac', href: releasesUrl },
  { platform: 'windows', name: 'Windows', href: releasesUrl },
  { platform: 'linux', name: 'Linux', href: releasesUrl },
];
