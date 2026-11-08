export interface PillSelectTileProps {
  name: string;
  compartment: number;
  /** Category colour, e.g. "var(--cat-heart)" */
  color?: string;
  count?: number;
  selected?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
}
export declare function PillSelectTile(props: PillSelectTileProps): JSX.Element;
