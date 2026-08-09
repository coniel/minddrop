import { QueryRuleGroup } from '../../types';

/**
 * Removes the rule or group with the given ID from the rule
 * tree, returning a new tree. Returns the tree unchanged if no
 * node matches the ID. The root group cannot be removed.
 *
 * @param group - The root of the rule tree.
 * @param nodeId - The ID of the rule or group to remove.
 *
 * @returns The updated rule tree.
 */
export function removeQueryRuleNode(
  group: QueryRuleGroup,
  nodeId: string,
): QueryRuleGroup {
  return {
    ...group,
    rules: group.rules
      // Drop the target node from this group
      .filter((child) => child.id !== nodeId)
      // Recurse into remaining nested groups
      .map((child) => {
        if (child.type === 'group') {
          return removeQueryRuleNode(child, nodeId);
        }

        return child;
      }),
  };
}
