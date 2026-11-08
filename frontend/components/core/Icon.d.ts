export interface IconProps {
  /** Lucide icon name in kebab-case, e.g. "pill", "calendar-days", "camera" */
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
