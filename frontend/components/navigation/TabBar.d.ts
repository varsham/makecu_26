export interface TabBarItem { id: string; label: string; /** Lucide icon name */ icon: string; }
export interface TabBarProps {
  items: TabBarItem[];
  value?: string;
  onChange?: (id: string) => void;
}
export declare function TabBar(props: TabBarProps): JSX.Element;
