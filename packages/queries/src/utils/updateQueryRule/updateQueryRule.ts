import { QueryRule, QueryRuleGroup } from '../../types';

export type UpdateQueryRuleData = Partial<
  Pick<QueryRule, 'property' | 'operator' | 'value'>
>;

/**
 * Applies a partial update to the rule with the given ID,
 * returning a new rule tree. Returns the tree unchanged if no
 * rule matches the ID.
 *
 * @param group - The root of the rule tree.
 * @param ruleId - The ID of the rule to update.
 * @param data - The rule fields to update.
 *
 * @returns The updated rule tree.
 */
export function updateQueryRule(
  group: QueryRuleGroup,
  ruleId: string,
  data: UpdateQueryRuleData,
): QueryRuleGroup {
  return {
    ...group,
    rules: group.rules.map((child) => {
      // Recurse into nested groups
      if (child.type === 'group') {
        return updateQueryRule(child, ruleId, data);
      }

      // Apply the update to the target rule
      if (child.id === ruleId) {
        return { ...child, ...data };
      }

      return child;
    }),
  };
}
