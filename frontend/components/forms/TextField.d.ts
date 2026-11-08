export interface TextFieldProps {
  label?: string;
  hint?: string;
  /** Shows a quiet "Optional" tag next to the label */
  optional?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Lucide icon name shown inside the field */
  icon?: string;
  suffix?: string;
  type?: string;
  style?: React.CSSProperties;
}
export declare function TextField(props: TextFieldProps): JSX.Element;
