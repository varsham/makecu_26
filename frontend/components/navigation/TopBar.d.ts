export interface TopBarProps {
  title: string;
  /** Small line above the title, e.g. "Thursday, Aug 13" */
  eyebrow?: string;
  /** Shows a back chevron when set */
  onBack?: () => void;
  /** Right-side IconButtons */
  actions?: React.ReactNode;
  /** 30px title for top-level tabs; 20px for pushed screens */
  large?: boolean;
}
export declare function TopBar(props: TopBarProps): JSX.Element;
