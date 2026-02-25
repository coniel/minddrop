/**
 * Calendar.stories.tsx
 * Dev reference for the Calendar component.
 */
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Button } from '../Button';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { Calendar } from './Calendar';
import { CalendarPopover } from './CalendarPopover';

const TODAY = new Date();

export const CalendarStories = () => {
  const [single, setSingle] = useState<Date | undefined>(undefined);
  const [multi, setMulti] = useState<Date[] | undefined>(undefined);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  return (
    <Story title="Calendar">
      {/* --------------------------------------------------------
          DEFAULT
          Uncontrolled, no selection mode. Today is highlighted
          in the primary color with a semibold weight.
      -------------------------------------------------------- */}
      <StorySection
        title="Default"
        description="Uncontrolled calendar. Today is highlighted in primary color. Navigation arrows flanking the month label."
      >
        <StoryRow>
          <StoryItem label="default">
            <Calendar />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SINGLE SELECTION
          Controlled. Selected day gets a solid-primary button.
      -------------------------------------------------------- */}
      <StorySection
        title="Single selection"
        description="mode='single'. Selected day uses the solid primary surface — same token as a solid Button."
      >
        <StoryRow>
          <StoryItem
            label={`selected: ${single ? single.toLocaleDateString() : 'none'}`}
          >
            <Calendar mode="single" selected={single} onSelect={setSingle} />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          MULTIPLE SELECTION
      -------------------------------------------------------- */}
      <StorySection
        title="Multiple selection"
        description="mode='multiple'. Each selected day is independently toggled."
      >
        <StoryRow>
          <StoryItem label={`${multi?.length ?? 0} selected`}>
            <Calendar mode="multiple" selected={multi} onSelect={setMulti} />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          RANGE SELECTION
          Start and end get solid-primary buttons. Middle days
          get the light primary background spanning the full cell.
      -------------------------------------------------------- */}
      <StorySection
        title="Range selection"
        description="mode='range'. Start/end use solid primary; middle days span the light primary surface across the full cell width."
      >
        <StoryRow>
          <StoryItem
            label={
              range?.from
                ? `${range.from.toLocaleDateString()} → ${range.to?.toLocaleDateString() ?? '...'}`
                : 'none'
            }
          >
            <Calendar mode="range" selected={range} onSelect={setRange} />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DISABLED DATES
      -------------------------------------------------------- */}
      <StorySection
        title="Disabled dates"
        description="Past days and weekends disabled. Disabled days are dimmed and non-interactive."
      >
        <StoryRow>
          <StoryItem label="before today + weekends">
            <Calendar
              mode="single"
              disabled={[{ before: TODAY }, { dayOfWeek: [0, 6] }]}
            />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          MULTIPLE MONTHS
      -------------------------------------------------------- */}
      <StorySection
        title="Multiple months"
        description="numberOfMonths=2 lays months side by side with a gap."
      >
        <StoryRow>
          <StoryItem label="2 months">
            <Calendar numberOfMonths={2} />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          CALENDAR POPOVER
      -------------------------------------------------------- */}
      <StorySection
        title="CalendarPopover"
        description="Calendar inside a Popover. Pass any element as the trigger child. Calendar and Popover props are forwarded automatically."
      >
        <StoryRow>
          <StoryItem label="single selection">
            <CalendarPopover
              mode="single"
              selected={single}
              onSelect={setSingle}
            >
              <Button variant="outline" size="sm">
                {single ? single.toLocaleDateString() : 'Pick a date'}
              </Button>
            </CalendarPopover>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
