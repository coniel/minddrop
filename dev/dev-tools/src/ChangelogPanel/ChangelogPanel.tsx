import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Check } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import {
  Button,
  CalendarPopover,
  IconButton,
  ScrollArea,
  Select,
} from '@minddrop/ui-primitives';
import { ISSUE_PACKAGES, getPackageColor } from '../IssuesPanel/constants';
import { Changelog, Issue, IssuePackage } from '../types';
import './ChangelogPanel.css';

interface ChangelogPanelProps {
  changelogs: Changelog[];
  issues: Issue[];
  selectedChangelogId: number | null;
  onSelectChangelog: (changelogId: number | null) => void;
  onChangelogChange: (changelogId: number, changes: Partial<Changelog>) => void;
  onCreateChangelog: () => void;
  onDeleteChangelog: (changelogId: number) => void;
}

function PackageSelectItem({ value, label }: { value: string; label: string }) {
  return (
    <SelectPrimitive.Item value={value} className="select-item">
      <SelectPrimitive.ItemIndicator className="select-item-indicator">
        <Check size={12} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="select-item-text">
        {label}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function PackageItems() {
  return (
    <>
      {ISSUE_PACKAGES.map((packageItem) => (
        <PackageSelectItem
          key={packageItem.value}
          value={packageItem.value}
          label={packageItem.label}
        />
      ))}
    </>
  );
}

function getPackageLabel(value: string): string {
  return (
    ISSUE_PACKAGES.find((packageItem) => packageItem.value === value)?.label ??
    value
  );
}

/**
 * Returns the current Helsinki datetime as YYYY-MM-DD HH:MM.
 */
export function getEffectiveDate(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Helsinki',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === 'year')!.value;
  const month = parts.find((part) => part.type === 'month')!.value;
  const day = parts.find((part) => part.type === 'day')!.value;
  const hour = parts.find((part) => part.type === 'hour')!.value;
  const minute = parts.find((part) => part.type === 'minute')!.value;

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * Formats a date string (YYYY-MM-DD or YYYY-MM-DD HH:MM) for display.
 */
export function formatDate(dateString: string): string {
  try {
    // Extract just the date portion (YYYY-MM-DD)
    const datePart = dateString.slice(0, 10);
    const date = new Date(datePart + 'T00:00:00');

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns the effective grouping date for a changelog entry.
 * Entries before 8 AM are considered part of the previous day.
 */
function getGroupingDate(dateString: string): string {
  // Date-only entries (YYYY-MM-DD) group by their date as-is
  if (dateString.length <= 10) {
    return dateString;
  }

  // Extract hours from YYYY-MM-DD HH:MM format
  const hours = parseInt(dateString.slice(11, 13), 10);

  // If before 8 AM, shift to previous day
  if (hours < 8) {
    const date = new Date(dateString.slice(0, 10) + 'T00:00:00');
    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  return dateString.slice(0, 10);
}

/**
 * Groups changelogs by effective date (8 AM cutoff), sorted
 * newest first. Within each group, entries are sorted by number
 * descending.
 */
export function groupChangelogsByDate(
  changelogs: Changelog[],
): { date: string; items: Changelog[] }[] {
  // Sort by full date string descending, then by number descending
  const sorted = [...changelogs].sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }

    return b.number - a.number;
  });

  const groups: { date: string; items: Changelog[] }[] = [];

  for (const changelog of sorted) {
    // Derive effective grouping date using the 8 AM cutoff
    const effectiveDate = getGroupingDate(changelog.date);
    const last = groups[groups.length - 1];

    if (last && last.date === effectiveDate) {
      last.items.push(changelog);
    } else {
      groups.push({ date: effectiveDate, items: [changelog] });
    }
  }

  return groups;
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
      className="changelog-panel-detail-title"
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );
}

function ChangelogRow({
  changelog,
  onClick,
}: {
  changelog: Changelog;
  onClick: () => void;
}) {
  const packages = changelog.packages.filter(
    (packageValue) => packageValue.length > 0,
  );

  return (
    <div className="changelog-panel-row" onClick={onClick}>
      <span className="changelog-panel-row-number">#{changelog.number}</span>
      <div className="changelog-panel-row-content">
        <div className="changelog-panel-row-title-line">
          <span className="changelog-panel-row-title">
            {changelog.title || 'Untitled'}
          </span>
          {packages.map((packageValue) => (
            <span
              key={packageValue}
              className="changelog-panel-chip"
              style={
                {
                  '--chip-color': getPackageColor(packageValue),
                } as React.CSSProperties
              }
            >
              {getPackageLabel(packageValue)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ChangelogPanel: React.FC<ChangelogPanelProps> = ({
  changelogs,
  issues,
  selectedChangelogId,
  onSelectChangelog,
  onChangelogChange,
  onCreateChangelog,
  onDeleteChangelog,
}) => {
  const selectedChangelog =
    changelogs.find((changelog) => changelog.id === selectedChangelogId) ??
    null;

  // --- Detail view ---
  if (selectedChangelog) {
    const selectedPackages = selectedChangelog.packages.filter(
      (packageValue) => packageValue.length > 0,
    );

    return (
      <div className="changelog-panel-detail">
        <div className="changelog-panel-detail-header">
          <IconButton
            icon="arrow-left"
            label="Back to list"
            size="sm"
            onClick={() => onSelectChangelog(null)}
          />
          <span className="changelog-panel-detail-title-number">
            #{selectedChangelog.number}
          </span>
          <DebouncedTitleInput
            key={selectedChangelog.id}
            defaultValue={selectedChangelog.title}
            onChange={(title) =>
              onChangelogChange(selectedChangelog.id, { title })
            }
          />
          <IconButton
            icon="trash-2"
            label="Delete changelog"
            size="sm"
            onClick={() => {
              onDeleteChangelog(selectedChangelog.id);
              onSelectChangelog(null);
            }}
          />
        </div>

        <div className="changelog-panel-detail-fields">
          <CalendarPopover
            mode="single"
            selected={
              new Date(selectedChangelog.date.slice(0, 10) + 'T00:00:00')
            }
            onSelect={(date: Date | undefined) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');

                // Preserve the time portion if it exists
                const timePart =
                  selectedChangelog.date.length > 10
                    ? selectedChangelog.date.slice(10)
                    : '';

                onChangelogChange(selectedChangelog.id, {
                  date: `${year}-${month}-${day}${timePart}`,
                });
              }
            }}
          >
            <Button variant="subtle" size="sm" startIcon="calendar">
              {formatDate(selectedChangelog.date)}
            </Button>
          </CalendarPopover>
          <Select
            size="sm"
            variant="subtle"
            value={undefined}
            placeholder="Add package"
            onValueChange={(value: IssuePackage) => {
              if (!selectedPackages.includes(value)) {
                onChangelogChange(selectedChangelog.id, {
                  packages: [...selectedPackages, value],
                });
              }
            }}
          >
            <PackageItems />
          </Select>
          {selectedPackages.map((packageValue) => (
            <span
              key={packageValue}
              className="changelog-panel-chip"
              style={
                {
                  '--chip-color': getPackageColor(packageValue),
                  cursor: 'pointer',
                } as React.CSSProperties
              }
              onClick={() =>
                onChangelogChange(selectedChangelog.id, {
                  packages: selectedPackages.filter(
                    (value) => value !== packageValue,
                  ),
                })
              }
            >
              {getPackageLabel(packageValue)} ×
            </span>
          ))}

          {/* Issue linking */}
          <Select
            size="sm"
            variant="subtle"
            value={undefined}
            placeholder="Add issue"
            onValueChange={(value: string) => {
              const issueNumber = parseInt(value, 10);

              if (!selectedChangelog.issues.includes(issueNumber)) {
                onChangelogChange(selectedChangelog.id, {
                  issues: [...selectedChangelog.issues, issueNumber],
                });
              }
            }}
          >
            {issues.map((issue) => (
              <PackageSelectItem
                key={issue.number}
                value={String(issue.number)}
                label={`#${issue.number} ${issue.title}`}
              />
            ))}
          </Select>
          {selectedChangelog.issues.map((issueNumber) => (
            <span
              key={issueNumber}
              className="changelog-panel-chip"
              style={
                {
                  '--chip-color': 'var(--color-neutral-7)',
                  cursor: 'pointer',
                } as React.CSSProperties
              }
              onClick={() =>
                onChangelogChange(selectedChangelog.id, {
                  issues: selectedChangelog.issues.filter(
                    (value) => value !== issueNumber,
                  ),
                })
              }
            >
              #{issueNumber} ×
            </span>
          ))}

          <div className="changelog-panel-detail-fields-spacer" />
        </div>

        <ScrollArea className="changelog-panel-detail-editor">
          <MarkdownEditor
            key={selectedChangelog.id}
            initialValue={selectedChangelog.content}
            onDebouncedChange={(content) =>
              onChangelogChange(selectedChangelog.id, { content })
            }
          />
        </ScrollArea>
      </div>
    );
  }

  // --- List view ---
  const groups = groupChangelogsByDate(changelogs);

  return (
    <div className="changelog-panel">
      <div className="changelog-panel-toolbar">
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-regular)',
          }}
        >
          {changelogs.length} {changelogs.length === 1 ? 'entry' : 'entries'}
        </span>
        <div className="changelog-panel-toolbar-spacer" />
        <IconButton
          icon="plus"
          label="New changelog"
          size="sm"
          onClick={onCreateChangelog}
        />
      </div>

      {groups.length === 0 ? (
        <div className="changelog-panel-empty">
          <span>No changelog entries.</span>
        </div>
      ) : (
        <ScrollArea>
          <div className="changelog-panel-list">
            {groups.map((group) => (
              <React.Fragment key={group.date}>
                <div className="changelog-panel-date-label">
                  {formatDate(group.date)}
                </div>
                {group.items.map((changelog) => (
                  <ChangelogRow
                    key={changelog.id}
                    changelog={changelog}
                    onClick={() => onSelectChangelog(changelog.id)}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
