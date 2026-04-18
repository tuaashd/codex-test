export type MetricRecord = {
  id: string;
  label: string;
  value: number;
};

export type ChartKind = 'bar' | 'line' | 'pie';

export type MetricSummary = {
  total: number;
  average: number;
  maxItem: MetricRecord | null;
  itemCount: number;
};
