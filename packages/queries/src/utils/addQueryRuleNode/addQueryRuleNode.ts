import { QueryRule, QueryRuleGroup } from '../../types';

/**
 * Appends a rule or group to the group with the given ID,
 * returning a new rule tree. Returns the tree unchanged if no
 * group matches the ID.
 *
 * @param group - The root of the rule tree.
 * @param groupId - The ID of the group to append to.
 * @param node - The rule or group to append.
 *
 * @returns The updated rule tree.
 */
export function addQueryRuleNode(
  group: QueryRuleGroup,
  groupId: string,
  node: QueryRule | QueryRuleGroup,
): QueryRuleGroup {
  // Append to this group when it is the target
  if (group.id === groupId) {
    return { ...group, rules: [...group.rules, node] };
  }

  // Recurse into nested groups
  return {
    ...group,
    rules: group.rules.map((child) => {
      if (child.type === 'group') {
        return addQueryRuleNode(child, groupId, node);
      }

      return child;
    }),
  };
}
