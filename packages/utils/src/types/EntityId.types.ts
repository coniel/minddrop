/**
 * A typed entity identifier in the format `<type>_<uuid>`, where
 * the type name is kebab-case and the type prefix is the substring
 * before the first underscore.
 */
export type EntityId<TType extends string = string> = `${TType}_${string}`;
