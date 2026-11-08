export interface BadgeProps {
  children?: React.ReactNode;
  tone?: "leaf" | "rose" | "sky" | "apricot" | "honey" | "mauve" | "neutral";
  icon?: string;
  /** Leading colour dot (category marker) */
  dot?: boolean;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
