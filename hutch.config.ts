export default {
  // Hutch's built-in resolver ignores pnpm-lock.yaml and writes its own
  // hutch.lock, which would split the workspace off its lockfile.
  packageManager: 'pnpm',
};
