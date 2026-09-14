import { DataViewType } from '@minddrop/data-views';
import {
  Database,
  DatabaseEntryTemplateSearchResult,
  Databases,
} from '@minddrop/databases';
import { i18n } from '@minddrop/i18n';
import { Spaces } from '@minddrop/spaces';
import { Icons } from '@minddrop/ui-icons';
import { IconProp } from '@minddrop/ui-primitives';
import { fuzzySearchBy } from '@minddrop/utils';

// What creating the option makes
export type CreateOptionAction =
  | { type: 'group' }
  | { type: 'space' }
  | { type: 'database' }
  | { type: 'data-view'; viewType: string }
  | { type: 'entry'; databaseId: string; templateId?: string };

export interface CreateOption {
  /**
   * Identifies the option among the listed ones.
   */
  id: string;

  /**
   * The translated label, listed as given.
   */
  label: string;

  /**
   * Icon for the option.
   */
  icon?: IconProp;

  /**
   * Stringified content icon, for the options an entity's own icon
   * stands for.
   */
  contentIcon?: string;

  /**
   * What creating it makes.
   */
  action: CreateOptionAction;
}

export interface ResolveCreateOptionsParams {
  /**
   * The search term the options are matched against and ranked by.
   */
  query: string;

  /**
   * The data view types, one option each: a view is created as a
   * type rather than as a kind of its own.
   */
  viewTypes: DataViewType[];

  /**
   * The databases the query matched, an entry of each.
   */
  databases: Database[];

  /**
   * The entry templates the query matched, paired with the database
   * they belong to.
   */
  templates: DatabaseEntryTemplateSearchResult[];
}

// An option with the text it is matched by, which is not always its
// label: a database is found by its own name as much as by the name
// of its entries.
interface CreateCandidate {
  option: CreateOption;
  matchTexts: string[];
}

/**
 * Resolves the options a search term matches, of every kind the
 * sidebar can create, ranked as a single list.
 *
 * @param params - The search term and the entities matched by it.
 * @returns The matched options, ranked by match quality.
 */
export function resolveCreateOptions({
  query,
  viewTypes,
  databases,
  templates,
}: ResolveCreateOptionsParams): CreateOption[] {
  const candidates: CreateCandidate[] = [
    ...resolveFixedCandidates(),
    ...viewTypes.map(
      (viewType): CreateCandidate => ({
        matchTexts: [i18n.t(viewType.name)],
        option: {
          id: `data-view:${viewType.type}`,
          label: i18n.t(viewType.name),
          contentIcon: Icons.fromName(viewType.icon),
          action: { type: 'data-view', viewType: viewType.type },
        },
      }),
    ),
    ...databases.map(
      (database): CreateCandidate => ({
        matchTexts: [database.entryName, database.name],
        option: {
          id: `entry:${database.id}`,
          label: database.entryName,
          contentIcon: database.icon,
          action: { type: 'entry', databaseId: database.id },
        },
      }),
    ),
    ...templates.map(
      ({ database, template }): CreateCandidate => ({
        matchTexts: [template.name],
        option: {
          id: `template:${template.id}`,
          label: i18n.t('desktopApp.sidebar.create.entryTemplate', {
            name: database.entryName,
            template: template.name,
          }),
          contentIcon: database.icon,
          action: {
            type: 'entry',
            databaseId: database.id,
            templateId: template.id,
          },
        },
      }),
    ),
  ];

  return fuzzySearchBy(
    candidates,
    query,
    (candidate) => candidate.matchTexts,
  ).map((candidate) => candidate.option);
}

// The options which exist whatever the workspace holds
function resolveFixedCandidates(): CreateCandidate[] {
  const options: CreateOption[] = [
    {
      id: 'group',
      icon: 'folder-plus',
      label: i18n.t('entityGroups.labels.group'),
      action: { type: 'group' },
    },
    {
      id: 'space',
      icon: Spaces.constants.Icon,
      label: i18n.t('spaces.labels.space'),
      action: { type: 'space' },
    },
    {
      id: 'database',
      icon: Databases.constants.Icon,
      label: i18n.t('databases.labels.database'),
      action: { type: 'database' },
    },
  ];

  return options.map((option) => ({ option, matchTexts: [option.label] }));
}
