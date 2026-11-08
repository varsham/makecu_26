export interface StockMeterProps {
  /** Pills remaining (refill amount minus dispensed since refill) */
  count: number;
  /** Pills at last refill */
  total: number;
  /** At or below → "Running low" (apricot). Default 7 */
  lowAt?: number;
  /** At or below → "Almost out" (rose). Default 3 */
  outAt?: number;
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function StockMeter(props: StockMeterProps): JSX.Element;
