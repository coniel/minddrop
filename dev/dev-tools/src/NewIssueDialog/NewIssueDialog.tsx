import React, { useEffect, useRef, useState } from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Check } from 'lucide-react';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { ScrollArea, Select } from '@minddrop/ui-primitives';
import { IssuePackage, IssuePriority, IssueStatus, IssueType } from '../types';
import {
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  ISSUE_TYPES,
  PACKAGE_GROUPS,
} from '../IssuesPanel/constants';
import './NewIssueDialog.css';

export interface NewIssueData {
  title: string;
  status: IssueStatus;
  type: IssueType;
  priority: IssuePriority;
  package: IssuePackage;
  content: string;
}

interface NewIssueDialogProps {
  issueNumber: number;
  onSubmit: (data: NewIssueData) => void;
  onClose: () => void;
}

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

function GroupedPackageItems() {
  return (
    <>
      {PACKAGE_GROUPS.map((group) => (
        <SelectPrimitive.Group key={group.workspace} className="select-group">
          <SelectPrimitive.GroupLabel className="select-group-label">
            {group.label}
          </SelectPrimitive.GroupLabel>
          {group.packages.map((packageItem) => (
            <PackageSelectItem
              key={packageItem.value}
              value={packageItem.value}
              label={packageItem.label}
            />
          ))}
        </SelectPrimitive.Group>
      ))}
    </>
  );
}

export const NewIssueDialog: React.FC<NewIssueDialogProps> = ({
  issueNumber,
  onSubmit,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<IssueStatus>('open');
  const [type, setType] = useState<IssueType>('task');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [issuePackage, setIssuePackage] = useState<IssuePackage>('other');
  const contentRef = useRef('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }

      if (event.key === 'Enter' && event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
        onSubmit({
          title: title.trim() || 'New Issue',
          status,
          type,
          priority,
          package: issuePackage,
          content: contentRef.current,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [title, status, type, priority, issuePackage, onSubmit, onClose]);

  return (
    <div className="new-issue-dialog-overlay" onMouseDown={onClose}>
      <div
        className="new-issue-dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="new-issue-dialog-title-row">
          <span className="new-issue-dialog-title-number">
            #{issueNumber}
          </span>
          <input
            ref={titleRef}
            className="new-issue-dialog-title"
            placeholder="Issue title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="new-issue-dialog-fields">
          <Select
            size="sm"
            variant="subtle"
            value={status}
            onValueChange={(value: IssueStatus) => setStatus(value)}
            options={STATUS_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={type}
            onValueChange={(value: IssueType) => setType(value)}
            options={TYPE_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={priority}
            onValueChange={(value: IssuePriority) => setPriority(value)}
            options={PRIORITY_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={issuePackage}
            onValueChange={(value: IssuePackage) => setIssuePackage(value)}
          >
            <GroupedPackageItems />
          </Select>
          <div className="new-issue-dialog-fields-spacer" />
          <span className="new-issue-dialog-hint">⌘↵ submit</span>
        </div>

        <ScrollArea className="new-issue-dialog-editor">
          <MarkdownEditor
            initialValue=""
            onDebouncedChange={(value) => {
              contentRef.current = value;
            }}
          />
        </ScrollArea>
      </div>
    </div>
  );
};
