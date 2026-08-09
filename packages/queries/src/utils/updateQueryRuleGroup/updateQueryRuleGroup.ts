import { QueryRuleGroup } from '../../types';

export type UpdateQueryRuleGroupData = Partial<
  Pick<QueryRuleGroup, 'combinator'>
>;

/**
 * Applies a partial update to the group with the given ID,
 * returning a new rule tree. Returns the tree unchanged if no
 * group matches the ID.
 *
 * @param group - The root of the rule tree.
 * @param groupId - The ID of the group to update.
 * @param data - The group fields to update.
 *
 * @returns The updated rule tree.
 */
export function updateQueryRuleGroup(
  group: QueryRuleGroup,
  groupId: string,
  data: UpdateQueryRuleGroupData,
): QueryRuleGroup {
  // Apply the update to this group when it is the target
  if (group.id === groupId) {
    return { ...group, ...data };
  }

  // Recurse into nested groups
  return {
    ...group,
    rules: group.rules.map((child) => {
      if (child.type === 'group') {
        return updateQueryRuleGroup(child, groupId, data);
      }

      return child;
    }),
  };
}
