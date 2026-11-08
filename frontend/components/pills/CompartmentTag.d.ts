export interface CompartmentTagProps {
  /** Physical compartment number on the Sprout dispenser */
  number: number;
  /** Tile colour — usually the pill's category colour */
  color?: string;
  size?: "sm" | "md";
}
export declare function CompartmentTag(props: CompartmentTagProps): JSX.Element;
