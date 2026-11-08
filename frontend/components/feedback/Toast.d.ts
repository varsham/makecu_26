export interface ToastProps {
  message: string;
  /** Lucide icon in a lime circle. Default "sprout" */
  icon?: string;
  visible?: boolean;
  tone?: "dark" | "light";
}
export declare function Toast(props: ToastProps): JSX.Element;
