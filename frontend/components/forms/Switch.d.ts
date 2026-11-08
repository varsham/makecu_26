export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  /** When set, renders a full row with label + optional description */
  label?: string;
  description?: string;
  disabled?: boolean;
}
export declare function Switch(props: SwitchProps): JSX.Element;
