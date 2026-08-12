/**
 * Top level directories which contain packages rather than files, and so
 * whose package label includes the child directory (e.g. `features/databases`).
 */
const PACKAGE_CONTAINERS = ['apps', 'data-views', 'features', 'packages', 'ui'];

/**
 * Label used for files which sit at the repo root.
 */
const ROOT_LABEL = 'root';

export interface PackageFileGroup {
  /**
   * The package label, e.g. `features/databases`.
   */
  label: string;

  /**
   * Repo-relative paths of the files belonging to the package.
   */
  files: string[];
}

/**
 * Groups repo-relative file paths by the package they belong to, preserving
 * the order in which each package and its files first appear.
 */
export function groupFilesByPackage(files: string[]): PackageFileGroup[] {
  const groups: PackageFileGroup[] = [];

  files.forEach((file) => {
    const label = resolvePackageLabel(file);

    // Add the file to its package group, creating the group if needed
    const group = groups.find((candidate) => candidate.label === label);

    if (group) {
      group.files.push(file);
    } else {
      groups.push({ label, files: [file] });
    }
  });

  return groups;
}

/**
 * Resolves the package label for a repo-relative file path.
 */
function resolvePackageLabel(path: string): string {
  const segments = path.split('/');

  // Files at the repo root have no package
  if (segments.length < 2) {
    return ROOT_LABEL;
  }

  // Package containers use the container and package name as the label
  if (PACKAGE_CONTAINERS.includes(segments[0]) && segments.length > 2) {
    return `${segments[0]}/${segments[1]}`;
  }

  return segments[0];
}
