import { useMemo, useState } from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Tag, Tags } from '@minddrop/tags';
import {
  Combobox,
  ComboboxOption,
  ComboboxTriggerSize,
  ComboboxTriggerVariant,
} from '@minddrop/ui-primitives';

// Sentinel option value identifying the create-on-type option
const CreateOptionValue = 'tags-combobox:create';

export interface TagsComboboxProps {
  /**
   * The selected tag names.
   */
  value: string[];

  /**
   * Callback fired with the new selected tag names.
   */
  onChange: (value: string[]) => void;

  /**
   * The ID of the tag group the selection is limited to. Tags
   * created on type are created in this group. All tags are
   * selectable when omitted.
   */
  group?: string;

  /**
   * Visual style of the trigger.
   * @default 'outline'
   */
  variant?: ComboboxTriggerVariant;

  /**
   * Min-height of the trigger.
   * @default 'lg'
   */
  size?: ComboboxTriggerSize;

  /**
   * Placeholder shown when no tags are selected.
   * @default 'tags.field.placeholder'
   */
  placeholder?: TranslationKey;

  /**
   * Controls the popup's open state.
   */
  open?: boolean;

  /**
   * Callback fired when the popup's open state changes.
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Renders a multi value tag picker. Selected tags are shown as
 * chips colored by the tag's color. Entering an unknown name
 * offers to create the tag.
 */
export const TagsCombobox: React.FC<TagsComboboxProps> = ({
  value,
  onChange,
  group,
  variant = 'outline',
  size = 'lg',
  placeholder = 'tags.field.placeholder',
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  // The current search query, controlled to drive create-on-type
  const [query, setQuery] = useState('');
  const tags = Tags.useAll();
  // The selectable tags, limited to the group when one is set
  const selectableTags = Tags.useAll(group);

  // The selectable tags as options, alphabetical
  const options = useMemo<ComboboxOption[]>(
    () =>
      [...selectableTags]
        .sort((tagA, tagB) => tagA.name.localeCompare(tagB.name))
        .map(tagToOption),
    [selectableTags],
  );

  // The query stripped of surrounding whitespace, used as the
  // created tag's name
  const trimmedQuery = query.trim();

  // Whether the query names an existing selectable tag. Tag names
  // are unique case-insensitively.
  const queryTagExists = selectableTags.some(
    (tag) => tag.name.toLowerCase() === trimmedQuery.toLowerCase(),
  );

  // Append a create option while the query names an unknown tag.
  // Items are grouped to opt out of list virtualization, which
  // does not support a controlled open state.
  const groups = useMemo(() => {
    const items =
      !trimmedQuery || queryTagExists
        ? options
        : [
            ...options,
            {
              label: t('tags.field.create', { name: trimmedQuery }),
              value: CreateOptionValue,
            },
          ];

    return [{ value: 'tags', items }];
  }, [options, trimmedQuery, queryTagExists, t]);

  // The selected tag names as options, reusing the listed option
  // instances so the list marks them as selected
  const selected = useMemo(
    () =>
      value.map((name) => {
        // Reuse the listed option when the tag is selectable
        const option = options.find((candidate) => candidate.value === name);

        if (option) {
          return option;
        }

        // Look up selected tags outside the group limit, so their
        // chips keep the tag color.
        const tag = tags.find((candidate) => candidate.name === name);

        // Fall back to a default color chip for unknown names
        return tag ? tagToOption(tag) : { label: name, value: name };
      }),
    [value, options, tags],
  );

  // Persist the picked tag names, creating the queried tag first
  // when the create option was picked
  async function handleValueChange(
    picked: ComboboxOption | ComboboxOption[] | null,
  ): Promise<void> {
    // Ignore single values, which never occur in multi-select mode
    if (!Array.isArray(picked)) {
      return;
    }

    // Reset the search for the next pick
    setQuery('');

    // The picked existing tag names
    const names = picked
      .filter((option) => option.value !== CreateOptionValue)
      .map((option) => option.value);

    // Create the queried tag and append it to the value
    if (picked.some((option) => option.value === CreateOptionValue)) {
      const tag = await Tags.create(trimmedQuery, undefined, group);

      onChange([...names, tag.name]);

      return;
    }

    onChange(names);
  }

  return (
    <Combobox
      multiple
      variant={variant}
      size={size}
      groups={groups}
      placeholder={t(placeholder)}
      searchPlaceholder="tags.field.searchPlaceholder"
      emptyText={t('tags.field.noResults')}
      value={selected}
      onValueChange={handleValueChange}
      inputValue={query}
      onInputValueChange={setQuery}
      filter={filterItem}
      {...(open !== undefined && { open })}
      {...(onOpenChange && { onOpenChange })}
    />
  );
};

/**
 * Converts a tag to a combobox option keyed by the tag's name.
 *
 * @param tag - The tag to convert.
 * @returns The tag's option.
 */
function tagToOption(tag: Tag): ComboboxOption {
  return {
    label: tag.name,
    value: tag.name,
    contentIcon: tag.icon,
    color: tag.color,
  };
}

/**
 * Matches items against the search query by tag name, always
 * keeping the create option visible.
 *
 * @param item - The item being filtered.
 * @param query - The current search query.
 * @returns Whether the item matches the query.
 */
function filterItem(item: ComboboxOption, query: string): boolean {
  // Always match the create option, as it is derived from the query
  if (item.value === CreateOptionValue) {
    return true;
  }

  return item.label.toLowerCase().includes(query.trim().toLowerCase());
}
