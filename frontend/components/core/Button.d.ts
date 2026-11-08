/** @startingPoint section="Core" subtitle="Pill-shaped buttons in five variants" viewport="700x260" */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = leaf green fill; secondary = white w/ hairline; soft = leaf tint; ghost = text only; danger = rose tint */
  variant?: "primary" | "secondary" | "soft" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** Lucide icon name shown before the label */
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
