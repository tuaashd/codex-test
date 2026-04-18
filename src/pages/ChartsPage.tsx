import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildChartOption } from '../lib/chartOptions';
import { ReactEChartsCore, echarts } from '../lib/echarts';
import { useMetricsStorage } from '../hooks/useMetricsStorage';
import type { ChartKind } from '../types/metrics';

type DraftState = Record<string, { label: string; value: string }>;

const chartLabels: Record<ChartKind, string> = {
  bar: '柱状图',
  line: '折线图',
  pie: '饼图',
};

const formatter = new Intl.NumberFormat('zh-CN');

const toDraftState = (metrics: ReturnType<typeof useMetricsStorage>['metrics']): DraftState =>
  Object.fromEntries(metrics.map((metric) => [metric.id, { label: metric.label, value: String(metric.value) }]));

export function ChartsPage() {
  const { metrics, summary, updateMetric, addMetric, removeMetric, resetMetrics } = useMetricsStorage();
  const [chartKind, setChartKind] = useState<ChartKind>('bar');
  const [drafts, setDrafts] = useState<DraftState>(() => toDraftState(metrics));

  useEffect(() => {
    setDrafts(toDraftState(metrics));
  }, [metrics]);

  const chartOption = useMemo(() => buildChartOption(chartKind, metrics), [chartKind, metrics]);

  const handleLabelChange = (id: string, nextLabel: string) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [id]: {
        ...currentDrafts[id],
        label: nextLabel,
      },
    }));

    if (nextLabel.trim().length > 0) {
      updateMetric(id, { label: nextLabel });
    }
  };

  const handleLabelBlur = (id: string) => {
    const currentMetric = metrics.find((metric) => metric.id === id);

    if (!currentMetric) {
      return;
    }

    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [id]: {
        label: currentMetric.label,
        value: currentDrafts[id]?.value ?? String(currentMetric.value),
      },
    }));
  };

  const handleValueChange = (id: string, nextValue: string) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [id]: {
        ...currentDrafts[id],
        value: nextValue,
      },
    }));

    if (nextValue.trim() === '') {
      return;
    }

    const parsed = Number(nextValue);

    if (Number.isFinite(parsed) && parsed >= 0) {
      updateMetric(id, { value: parsed });
    }
  };

  const handleValueBlur = (id: string) => {
    const currentMetric = metrics.find((metric) => metric.id === id);

    if (!currentMetric) {
      return;
    }

    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [id]: {
        label: currentDrafts[id]?.label ?? currentMetric.label,
        value: String(currentMetric.value),
      },
    }));
  };

  return (
    <main className="min-h-screen bg-[#050b16] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-accentSoft/80">Charts Workspace</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">运营数据动态图表</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              同一份数据统一驱动摘要指标、编辑面板与 ECharts 图表。默认使用浏览器本地存储，无需接入后端。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              返回首页
            </Link>
            <Link
              to="/lab"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              打开增长实验室
            </Link>
            <button
              type="button"
              onClick={resetMetrics}
              className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accentSoft transition hover:bg-accent/15"
            >
              重置默认数据
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">总值</p>
            <p className="mt-3 font-display text-4xl text-white">{formatter.format(summary.total)}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">平均值</p>
            <p className="mt-3 font-display text-4xl text-white">{formatter.format(Math.round(summary.average))}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">头部渠道</p>
            <p className="mt-3 font-display text-2xl text-white">{summary.maxItem?.label ?? '暂无数据'}</p>
            <p className="mt-2 text-sm text-slate-400">
              {summary.maxItem ? formatter.format(summary.maxItem.value) : '等待添加数据'}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="border border-white/10 bg-surface/55 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Data Control</p>
                <h2 className="mt-2 font-display text-2xl text-white">编辑渠道数据</h2>
              </div>
              <button
                type="button"
                onClick={addMetric}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                新增指标
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {metrics.length === 0 ? (
                <div className="border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
                  当前没有可展示的数据，请先新增一条指标。
                </div>
              ) : null}

              {metrics.map((metric, index) => (
                <div key={metric.id} className="space-y-3 border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Metric {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeMetric(metric.id)}
                      className="text-xs text-rose-300 transition hover:text-rose-200"
                    >
                      删除
                    </button>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-400">名称</span>
                    <input
                      value={drafts[metric.id]?.label ?? metric.label}
                      onChange={(event) => handleLabelChange(metric.id, event.target.value)}
                      onBlur={() => handleLabelBlur(metric.id)}
                      className="w-full border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/40"
                      placeholder="输入渠道名称"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-400">数值</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={drafts[metric.id]?.value ?? String(metric.value)}
                      onChange={(event) => handleValueChange(metric.id, event.target.value)}
                      onBlur={() => handleValueBlur(metric.id)}
                      className="w-full border border-white/10 bg-[#0b1223] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent/40"
                      placeholder="输入非负数"
                    />
                  </label>
                </div>
              ))}
            </div>
          </aside>

          <section className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,36,0.86),rgba(7,11,24,0.98))] p-5">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Visualization</p>
                <h2 className="mt-2 font-display text-2xl text-white">图表随数据实时刷新</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(chartLabels) as ChartKind[]).map((kind) => {
                  const isActive = kind === chartKind;
                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setChartKind(kind)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        isActive
                          ? 'bg-accent text-white'
                          : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      {chartLabels[kind]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>当前图表: {chartLabels[chartKind]}</span>
                <span>数据项: {summary.itemCount}</span>
                <span>本地持久化: 已启用</span>
              </div>

              {metrics.length > 0 ? (
                <ReactEChartsCore echarts={echarts} option={chartOption} style={{ height: '460px', width: '100%' }} />
              ) : (
                <div className="flex h-[460px] items-center justify-center border border-dashed border-white/10 text-sm text-slate-400">
                  暂无数据可供渲染，请新增一条指标后再查看图表。
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
