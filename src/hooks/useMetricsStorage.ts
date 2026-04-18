import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, defaultMetrics } from '../data/defaultMetrics';
import type { MetricRecord, MetricSummary } from '../types/metrics';

const formatLabel = (label: string, index: number) => {
  const nextLabel = label.trim();
  return nextLabel.length > 0 ? nextLabel : `指标 ${index + 1}`;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `metric-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const sanitizeMetric = (metric: Partial<MetricRecord>, index: number): MetricRecord | null => {
  const label = typeof metric.label === 'string' ? formatLabel(metric.label, index) : `指标 ${index + 1}`;
  const value = typeof metric.value === 'number' && Number.isFinite(metric.value) ? Math.max(0, metric.value) : 0;
  const id = typeof metric.id === 'string' && metric.id.trim().length > 0 ? metric.id : createId();

  return { id, label, value };
};

const normalizeMetrics = (value: unknown): MetricRecord[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => sanitizeMetric(item as Partial<MetricRecord>, index))
    .filter((item): item is MetricRecord => item !== null);
};

const persistMetrics = (metrics: MetricRecord[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
};

const loadMetrics = () => {
  if (typeof window === 'undefined') {
    return defaultMetrics;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    persistMetrics(defaultMetrics);
    return defaultMetrics;
  }

  try {
    const parsed = JSON.parse(stored) as unknown;
    const normalized = normalizeMetrics(parsed);

    if (normalized.length === 0) {
      persistMetrics(defaultMetrics);
      return defaultMetrics;
    }

    return normalized;
  } catch {
    persistMetrics(defaultMetrics);
    return defaultMetrics;
  }
};

export const useMetricsStorage = () => {
  const [metrics, setMetrics] = useState<MetricRecord[]>(() => loadMetrics());

  useEffect(() => {
    persistMetrics(metrics);
  }, [metrics]);

  const summary = useMemo<MetricSummary>(() => {
    const total = metrics.reduce((accumulator, item) => accumulator + item.value, 0);
    const average = metrics.length > 0 ? total / metrics.length : 0;
    const maxItem =
      metrics.length > 0
        ? metrics.reduce((currentMax, item) => (item.value > currentMax.value ? item : currentMax), metrics[0])
        : null;

    return {
      total,
      average,
      maxItem,
      itemCount: metrics.length,
    };
  }, [metrics]);

  const updateMetric = (id: string, patch: Partial<Omit<MetricRecord, 'id'>>) => {
    setMetrics((currentMetrics) =>
      currentMetrics.map((metric, index) => {
        if (metric.id !== id) {
          return metric;
        }

        return sanitizeMetric({ ...metric, ...patch, id }, index) ?? metric;
      }),
    );
  };

  const addMetric = () => {
    setMetrics((currentMetrics) => [
      ...currentMetrics,
      {
        id: createId(),
        label: `新增指标 ${currentMetrics.length + 1}`,
        value: 0,
      },
    ]);
  };

  const removeMetric = (id: string) => {
    setMetrics((currentMetrics) => currentMetrics.filter((metric) => metric.id !== id));
  };

  const resetMetrics = () => {
    setMetrics(defaultMetrics);
  };

  return {
    metrics,
    summary,
    updateMetric,
    addMetric,
    removeMetric,
    resetMetrics,
  };
};
