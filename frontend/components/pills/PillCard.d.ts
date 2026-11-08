/** @startingPoint section="Pills" subtitle="My Pills list card with stock meter" viewport="700x420" */
export interface PillCardProps {
  name: string;
  /** e.g. "1000 IU · 1 tablet" */
  dose?: string;
  category?: string;
  /** CSS colour for the compartment tile, e.g. "var(--cat-vitamin)" */
  categoryColor?: string;
  categoryTone?: "leaf" | "rose" | "sky" | "apricot" | "honey" | "mauve" | "neutral";
  compartment?: number;
  count?: number;
  total?: number;
  /** Forwarded to StockMeter */
  lowAt?: number;
  outAt?: number;
  /** Summarised schedule, e.g. "Every day · 8:00 am" */
  schedule?: string;
  paused?: boolean;
  onClick?: () => void;
}
export declare function PillCard(props: PillCardProps): JSX.Element;
