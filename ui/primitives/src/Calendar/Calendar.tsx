import React from 'react';
import {
  DayPicker,
  DayPickerProps,
  DropdownNavProps,
  DropdownProps,
} from 'react-day-picker';
import { useTranslation } from '@minddrop/i18n';
import { IconButton } from '../IconButton';
import { Group } from '../Layout';
import { Select } from '../Select';
import './Calendar.css';

export type CalendarProps = DayPickerProps;

const MONTH_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

const WEEKDAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const START_MONTH = new Date(CURRENT_YEAR - 100, 0);
const END_MONTH = new Date(CURRENT_YEAR + 100, 11);

const YEAR_OPTIONS = Array.from({ length: 201 }, (_, i) => {
  const year = CURRENT_YEAR - 100 + i;
  return { value: String(year), label: String(year) };
});

const CALENDAR_CLASS_NAMES: DayPickerProps['classNames'] = {
  root: 'calendar',
  months: 'calendar-months',
  month: 'calendar-month',
  month_caption: 'calendar-month-caption',
  caption_label: 'calendar-caption-label',
  dropdowns: 'calendar-dropdowns',
  months_dropdown: 'calendar-months-dropdown',
  years_dropdown: 'calendar-years-dropdown',
  nav: 'calendar-nav',
  button_previous: 'calendar-button-previous',
  button_next: 'calendar-button-next',
  month_grid: 'calendar-month-grid',
  weekdays: 'calendar-weekdays',
  weekday: 'calendar-weekday',
  weeks: 'calendar-weeks',
  week: 'calendar-week',
  day: 'calendar-day',
  day_button: 'calendar-day-button',
  today: 'calendar-day-today',
  selected: 'calendar-day-selected',
  outside: 'calendar-day-outside',
  disabled: 'calendar-day-disabled',
  hidden: 'calendar-day-hidden',
  focused: 'calendar-day-focused',
  range_start: 'calendar-day-range-start',
  range_end: 'calendar-day-range-end',
  range_middle: 'calendar-day-range-middle',
  chevron: 'calendar-chevron',
};

function MonthDropdown({ value, onChange }: DropdownProps) {
  const { t } = useTranslation();

  const selectOptions = MONTH_KEYS.map((key, index) => ({
    value: String(index),
    label: t(`calendar.months.${key}`),
  }));

  const handleChange = (newValue: string) => {
    // DayPicker's handler reads e.target.value to resolve the month
    const event = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(event);
  };

  return (
    <Select
      variant="ghost"
      size="sm"
      value={value !== undefined ? String(value) : undefined}
      options={selectOptions}
      onValueChange={handleChange}
    />
  );
}

function YearDropdown({ value, onChange }: DropdownProps) {
  const handleChange = (newValue: string) => {
    const event = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(event);
  };

  return (
    <Select
      variant="ghost"
      size="sm"
      value={value !== undefined ? String(value) : undefined}
      options={YEAR_OPTIONS}
      onValueChange={handleChange}
    />
  );
}

function PrevMonthButton({
  'aria-label': ariaLabel,
  children: _children,
  color: _color,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <IconButton
      className="calendar-button-previous"
      icon="chevron-left"
      label={ariaLabel ?? ''}
      variant="ghost"
      size="sm"
      {...props}
    />
  );
}

function NextMonthButton({
  'aria-label': ariaLabel,
  children: _children,
  color: _color,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <IconButton
      className="calendar-button-next"
      icon="chevron-right"
      label={ariaLabel ?? ''}
      variant="ghost"
      size="sm"
      {...props}
    />
  );
}

function CalendarDropdownNav({ children, className }: DropdownNavProps) {
  return (
    <Group gap={1} align="center" justify="center" className={className}>
      {children}
    </Group>
  );
}

const CALENDAR_COMPONENTS: DayPickerProps['components'] = {
  MonthsDropdown: MonthDropdown,
  YearsDropdown: YearDropdown,
  DropdownNav: CalendarDropdownNav,
  PreviousMonthButton: PrevMonthButton,
  NextMonthButton: NextMonthButton,
};

export const Calendar = ({
  className,
  navLayout = 'around',
  captionLayout = 'dropdown',
  startMonth = START_MONTH,
  endMonth = END_MONTH,
  classNames: _classNames,
  components,
  formatters: consumerFormatters,
  ...props
}: CalendarProps) => {
  const { t } = useTranslation();

  const mergedClassNames = {
    ...CALENDAR_CLASS_NAMES,
    root: ['calendar', className].filter(Boolean).join(' '),
  };

  const mergedComponents = { ...CALENDAR_COMPONENTS, ...components };

  const mergedFormatters = {
    formatWeekdayName: (date: Date) =>
      t(`calendar.weekdaysShort.${WEEKDAY_KEYS[date.getDay()]}`),
    ...consumerFormatters,
  };

  // Cast required to work around TypeScript's discriminated union limitation
  const pickerProps = props as DayPickerProps;

  return (
    <DayPicker
      navLayout={navLayout}
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      components={mergedComponents}
      formatters={mergedFormatters}
      {...pickerProps}
      classNames={mergedClassNames}
    />
  );
};

Calendar.displayName = 'Calendar';
