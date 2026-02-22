export function omitPath<T extends { path?: string }>(obj: T): Omit<T, 'path'> {
  const { path, ...rest } = obj;

  return rest as Omit<T, 'path'>;
}
