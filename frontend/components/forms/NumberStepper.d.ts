export interface NumberStepperProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  unit?: string;
  size?: "sm" | "md";
}
export declare function NumberStepper(props: NumberStepperProps): JSX.Element;
