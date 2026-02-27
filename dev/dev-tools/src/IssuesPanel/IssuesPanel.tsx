import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { IconButton, ScrollArea, Select } from '@minddrop/ui-primitives';
import { Issue, IssueFeature, IssuePriority, IssueStatus, IssueType } from '../types';
import {
  FEATURE_COLORS,
  ISSUE_FEATURES,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  ISSUE_TYPES,
  PRIORITY_COLORS,
  STATUS_COLORS,
  STATUS_ICONS,
  TYPE_COLORS,
} from './constants';
import './IssuesPanel.css';

interface IssuesPanelProps {
  issues: Issue[];
  onIssueChange: (issueId: number, changes: Partial<Issue>) => void;
  onCreateIssue: () => void;
  onDeleteIssue: (issueId: number) => void;
}

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  ...ISSUE_STATUSES.map((status) => ({ value: status.value, label: status.label })),
];

const FEATURE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Features' },
  ...ISSUE_FEATURES.map((feature) => ({ value: feature.value, label: feature.label })),
];

const STATUS_OPTIONS = ISSUE_STATUSES.map((status) => ({
  value: status.value,
  label: status.label,
}));

const TYPE_OPTIONS = ISSUE_TYPES.map((type) => ({
  value: type.value,
  label: type.label,
}));

const PRIORITY_OPTIONS = ISSUE_PRIORITIES.map((priority) => ({
  value: priority.value,
  label: priority.label,
}));

const FEATURE_OPTIONS = ISSUE_FEATURES.map((feature) => ({
  value: feature.value,
  label: feature.label,
}));

function getFeatureLabel(value: string): string {
  return ISSUE_FEATURES.find((feature) => feature.value === value)?.label ?? value;
}

function getTypeLabel(value: string): string {
  return ISSUE_TYPES.find((type) => type.value === value)?.label ?? value;
}

function getPriorityLabel(value: string): string {
  return ISSUE_PRIORITIES.find((priority) => priority.value === value)?.label ?? value;
}

function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusIcon({ status }: { status: string }) {
  const icon = STATUS_ICONS[status];
  const color = STATUS_COLORS[status];

  return (
    <svg
      className="issues-panel-status-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ color }}
    >
      {icon === 'open' && (
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      )}
      {icon === 'in-progress' && (
        <>
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 1.5A6.5 6.5 0 0 1 14.5 8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {icon === 'done' && (
        <>
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path
            d="M5 8l2 2 4-4"
            stroke="var(--surface-app)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {icon === 'wontfix' && (
        <>
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <line
            x1="5.5"
            y1="8"
            x2="10.5"
            y2="8"
            stroke="var(--surface-app)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

function DebouncedTitleInput({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChangeRef.current(value);
      }, 300);
    },
    [],
  );

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <input
      className="issues-panel-detail-title"
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );
}

export const IssuesPanel: React.FC<IssuesPanelProps> = ({
  issues,
  onIssueChange,
  onCreateIssue,
  onDeleteIssue,
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [featureFilter, setFeatureFilter] = useState('all');

  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) ?? null;

  // --- Detail view ---
  if (selectedIssue) {
    return (
      <div className="issues-panel-detail">
        <div className="issues-panel-detail-header">
          <IconButton
            icon="arrow-left"
            label="Back to list"
            size="sm"
            onClick={() => setSelectedIssueId(null)}
          />
          <DebouncedTitleInput
            key={selectedIssue.id}
            defaultValue={selectedIssue.title}
            onChange={(title) => onIssueChange(selectedIssue.id, { title })}
          />
          <IconButton
            icon="trash-2"
            label="Delete issue"
            size="sm"
            onClick={() => {
              onDeleteIssue(selectedIssue.id);
              setSelectedIssueId(null);
            }}
          />
        </div>

        <div className="issues-panel-detail-fields">
          <Select
            size="sm"
            variant="subtle"
            value={selectedIssue.status}
            onValueChange={(value: IssueStatus) =>
              onIssueChange(selectedIssue.id, { status: value })
            }
            options={STATUS_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={selectedIssue.type}
            onValueChange={(value: IssueType) =>
              onIssueChange(selectedIssue.id, { type: value })
            }
            options={TYPE_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={selectedIssue.priority}
            onValueChange={(value: IssuePriority) =>
              onIssueChange(selectedIssue.id, { priority: value })
            }
            options={PRIORITY_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={selectedIssue.feature}
            onValueChange={(value: IssueFeature) =>
              onIssueChange(selectedIssue.id, { feature: value })
            }
            options={FEATURE_OPTIONS}
          />
          <div className="issues-panel-detail-fields-spacer" />
          <span className="issues-panel-detail-fields-created">
            #{selectedIssue.number} · {formatRelativeDate(selectedIssue.createdAt)}
          </span>
        </div>

        <ScrollArea className="issues-panel-detail-editor">
          <MarkdownEditor
            key={selectedIssue.id}
            initialValue={selectedIssue.content}
            onDebouncedChange={(content) =>
              onIssueChange(selectedIssue.id, { content })
            }
          />
        </ScrollArea>
      </div>
    );
  }

  // --- List view ---
  const filteredIssues = issues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) {
      return false;
    }

    if (featureFilter !== 'all' && issue.feature !== featureFilter) {
      return false;
    }

    return true;
  });

  const openCount = issues.filter((issue) => issue.status === 'open' || issue.status === 'in-progress').length;
  const closedCount = issues.filter((issue) => issue.status === 'done' || issue.status === 'wontfix').length;

  return (
    <div className="issues-panel">
      <div className="issues-panel-toolbar">
        <button
          className={`issues-panel-tab-button${statusFilter === 'all' || statusFilter === 'open' || statusFilter === 'in-progress' ? ' issues-panel-tab-button-active' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
        >
          <StatusIcon status="open" />
          {openCount} Open
        </button>
        <button
          className={`issues-panel-tab-button${statusFilter === 'done' || statusFilter === 'wontfix' ? ' issues-panel-tab-button-active' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'done' ? 'all' : 'done')}
        >
          <StatusIcon status="done" />
          {closedCount} Closed
        </button>
        <div className="issues-panel-toolbar-spacer" />
        <Select
          size="sm"
          variant="subtle"
          value={featureFilter}
          onValueChange={setFeatureFilter}
          options={FEATURE_FILTER_OPTIONS}
        />
        <IconButton
          icon="plus"
          label="New issue"
          size="sm"
          onClick={onCreateIssue}
        />
      </div>

      {filteredIssues.length === 0 ? (
        <div className="issues-panel-empty">
          <span>No issues found.</span>
        </div>
      ) : (
        <ScrollArea>
          <div className="issues-panel-list">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="issues-panel-row"
                onClick={() => setSelectedIssueId(issue.id)}
              >
                <StatusIcon status={issue.status} />
                <div className="issues-panel-row-content">
                  <div className="issues-panel-row-title-line">
                    <span className="issues-panel-row-title">
                      {issue.title || 'Untitled'}
                    </span>
                    <span
                      className="issues-panel-chip"
                      style={
                        {
                          '--chip-color': TYPE_COLORS[issue.type],
                        } as React.CSSProperties
                      }
                    >
                      {getTypeLabel(issue.type)}
                    </span>
                    <span
                      className="issues-panel-chip"
                      style={
                        {
                          '--chip-color': PRIORITY_COLORS[issue.priority],
                        } as React.CSSProperties
                      }
                    >
                      {getPriorityLabel(issue.priority)}
                    </span>
                    {issue.feature !== 'other' && (
                      <span
                        className="issues-panel-chip"
                        style={
                          {
                            '--chip-color': FEATURE_COLORS[issue.feature],
                          } as React.CSSProperties
                        }
                      >
                        {getFeatureLabel(issue.feature)}
                      </span>
                    )}
                  </div>
                  <div className="issues-panel-row-meta">
                    #{issue.number} opened {formatRelativeDate(issue.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
