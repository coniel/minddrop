/**
 * Select.stories.tsx
 * Dev reference for the Select component.
 */

import { Select } from './Select';
import { SelectItem } from './SelectItem';
import { Button } from '../Button';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

const SORT_OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Date created', value: 'created' },
  { label: 'Date modified', value: 'modified' },
  { label: 'Size', value: 'size' },
];

const ORDER_OPTIONS = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export const SelectStories = () => (
  <Story title="Select">

    <StorySection title="Variants" description="Mirrors Button variants (minus solid) so Select integrates seamlessly in toolbars alongside buttons. Default is 'outline'.">
      <StoryRow>
        <StoryItem label="ghost"><Select variant="ghost" options={SORT_OPTIONS} placeholder="Sort by..." /></StoryItem>
        <StoryItem label="subtle"><Select variant="subtle" options={SORT_OPTIONS} placeholder="Sort by..." /></StoryItem>
        <StoryItem label="outline (default)"><Select variant="outline" options={SORT_OPTIONS} placeholder="Sort by..." /></StoryItem>
        <StoryItem label="filled"><Select variant="filled" options={SORT_OPTIONS} placeholder="Sort by..." /></StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection title="Sizes" description="Identical heights and padding to Button. Always match sizes when composing Select and Button together.">
      <StoryRow>
        <StoryItem label="sm"><Select variant="outline" size="sm" options={ORDER_OPTIONS} placeholder="Order..." /></StoryItem>
        <StoryItem label="md (default)"><Select variant="outline" size="md" options={ORDER_OPTIONS} placeholder="Order..." /></StoryItem>
        <StoryItem label="lg"><Select variant="outline" size="lg" options={ORDER_OPTIONS} placeholder="Order..." /></StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection title="Value vs placeholder" description="Placeholder uses muted color to signal no selection. Selected value uses regular text color.">
      <StoryRow>
        <StoryItem label="placeholder"><Select variant="outline" options={SORT_OPTIONS} placeholder="Sort by..." /></StoryItem>
        <StoryItem label="value selected"><Select variant="outline" options={SORT_OPTIONS} value="name" /></StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection title="Custom children" description="Pass SelectItem children directly when you need icons, groupings, or custom item layouts.">
      <StoryRow>
        <StoryItem label="custom items">
          <Select variant="outline" placeholder="View as...">
            <SelectItem label="List" value="list" />
            <SelectItem label="Grid" value="grid" />
            <SelectItem label="Board" value="board" />
          </Select>
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection title="Composition with Button" description="Matching variant and size ensures consistent height, padding, and color across the row.">
      <StoryRow>
        <StoryItem label="ghost toolbar">
          <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
            <Select variant="ghost" size="md" options={SORT_OPTIONS} placeholder="Sort by..." />
            <Select variant="ghost" size="md" options={ORDER_OPTIONS} placeholder="Order..." />
            <Button variant="ghost" startIcon="filter">Filter</Button>
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow>
        <StoryItem label="filled toolbar">
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Select variant="filled" size="md" options={SORT_OPTIONS} value="name" />
            <Select variant="filled" size="md" options={ORDER_OPTIONS} value="asc" />
            <Button variant="filled" startIcon="plus">New</Button>
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow>
        <StoryItem label="subtle panel row">
          <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
            <Select variant="subtle" size="sm" options={ORDER_OPTIONS} value="asc" />
            <Button variant="subtle" size="sm" startIcon="settings" />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

  </Story>
);
