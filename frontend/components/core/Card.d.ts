export interface CardProps {
  children?: React.ReactNode;
  /** white (default, lightly elevated) or a flat palette tint */
  tone?: "white" | "paper" | "oat" | "tan" | "honey" | "mauve" | "leaf" | "rose" | "sky" | "apricot";
  padding?: number | string;
  elevated?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
