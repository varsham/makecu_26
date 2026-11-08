export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  /** Sticky action area, usually a full-width Button */
  footer?: React.ReactNode;
}
/** Bottom sheet; positions absolutely inside its nearest positioned ancestor (the phone screen). */
export declare function Sheet(props: SheetProps): JSX.Element;
