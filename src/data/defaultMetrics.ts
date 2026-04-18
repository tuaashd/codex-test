import type { MetricRecord } from '../types/metrics';

export const STORAGE_KEY = 'sales-insight-metrics';

export const defaultMetrics: MetricRecord[] = [
  { id: 'social', label: '社媒广告', value: 1280 },
  { id: 'search', label: '搜索投放', value: 1720 },
  { id: 'private', label: '私域转化', value: 940 },
  { id: 'offline', label: '线下活动', value: 760 },
  { id: 'member', label: '复购会员', value: 1390 },
  { id: 'partner', label: '联名渠道', value: 1110 },
];
