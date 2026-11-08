export interface IconButtonProps {
  /** Lucide icon name */
  icon: string;
  /** Accessible label (required — there is no visible text) */
  label: string;
  variant?: "plain" | "soft" | "solid" | "card";
  /** Diameter in px; never below 44 on touch screens */
  size?: number;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
