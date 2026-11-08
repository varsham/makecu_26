export interface DayPickerProps {
  /** Selected weekdays, 0 = Monday … 6 = Sunday */
  value?: number[];
  onChange?: (days: number[]) => void;
  size?: number;
}
export declare function DayPicker(props: DayPickerProps): JSX.Element;
