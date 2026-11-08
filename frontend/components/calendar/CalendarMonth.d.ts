export interface CalendarDayInfo {
  /** Palette token name without "--", e.g. "oat", "honey", "tan", "mauve", "leaf-50" */
  tone?: string;
  /** CSS colours of dose dots (category colours) */
  dots?: string[];
  paused?: boolean;
}
/** @startingPoint section="Schedule" subtitle="Monday-first month of soft day tiles" viewport="700x560" */
export interface CalendarMonthProps {
  year: number;
  /** 0-indexed month */
  month: number;
  days?: Record<number, CalendarDayInfo>;
  today?: number;
  selected?: number;
  /** Days after this date render as empty outlines (outside the planned range) */
  rangeEnd?: Date;
  onSelect?: (day: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
}
export declare function CalendarMonth(props: CalendarMonthProps): JSX.Element;
