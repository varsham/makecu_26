export interface RangeSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  /** Formats tick labels, e.g. (w) => w + "w" */
  formatValue?: (value: number) => string;
  showTicks?: boolean;
}
export declare function RangeSlider(props: RangeSliderProps): JSX.Element;
