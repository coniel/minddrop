import { EntityId } from '@minddrop/utils';

export type AutomationId = EntityId<'automation'>;

export interface Automation {
  /**
   * A unique identifier for the automation.
   */
  id: AutomationId;

  /**
   * The user defined name of the automation.
   */
  name: string;

  /**
   * The user selected automation icon. Value depends on the
   * icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   */
  icon: string;

  /**
   * The date the automation was created.
   */
  created: Date;

  /**
   * The date the automation was last modified.
   */
  lastModified: Date;

  /**
   * Whether the automation runs when triggered.
   */
  enabled: boolean;

  /**
   * The nodes making up the automation graph.
   */
  nodes: AutomationNode[];

  /**
   * The connections between the graph's nodes.
   */
  connections: AutomationConnection[];

  /**
   * Whether the automation is virtual (exists only in memory,
   * not persisted to an automation file).
   */
  virtual?: boolean;

  /**
   * The ID of the entity which owns and persists the
   * automation. Only set on virtual automations.
   */
  owner?: EntityId;
}

/**
 * The data required to create a virtual automation.
 */
export type CreateVirtualAutomationData = Pick<Automation, 'id'> &
  Partial<Pick<Automation, 'name' | 'icon' | 'enabled'>> & {
    /**
     * The ID of the entity which owns and persists the automation.
     */
    owner: EntityId;
  };

/**
 * The data from which a virtual automation is hydrated, without
 * the fields derived at load time.
 */
export type VirtualAutomationData = Omit<
  Automation,
  'virtual' | 'owner' | 'created' | 'lastModified'
> & {
  /**
   * The ID of the entity which owns and persists the automation.
   */
  owner: EntityId;
};

/**
 * A node on the automation graph. Node types and their configs
 * are added as the automation flow is built out.
 */
export interface AutomationNode {
  /**
   * A unique identifier for the node, used as the edit target
   * when modifying the graph and as the connection endpoints.
   */
  id: string;

  /**
   * The node's type.
   */
  type: string;

  /**
   * The node's horizontal position on the automation canvas.
   */
  x: number;

  /**
   * The node's vertical position on the automation canvas.
   */
  y: number;
}

/**
 * A directed connection between two automation graph nodes,
 * from an output port to an input port.
 */
export interface AutomationConnection {
  /**
   * A unique identifier for the connection.
   */
  id: string;

  /**
   * The ID of the node the connection starts from.
   */
  from: string;

  /**
   * The ID of the node the connection leads to.
   */
  to: string;
}
