export function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg;

  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;

  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}
