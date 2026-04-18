import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMetricsStorage } from '../hooks/useMetricsStorage';

type PresetId = 'balanced' | 'growth' | 'efficiency';

const formatter = new Intl.NumberFormat('zh-CN');

const presetMeta: Record<PresetId, { label: string; description: string }> = {
  balanced: {
    label: '稳健加码',
    description: '优先抬高头部渠道，控制整体波动。',
  },
  growth: {
    label: '活动冲刺',
    description: '放大高势能渠道，争取明显增量。',
  },
  efficiency: {
    label: '效率修复',
    description: '削弱低效消耗，把预算向高回报迁移。',
  },
};

const rankMetrics = (values: number[]) =>
  values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => right.value - left.value)
    .map((item) => item.index);

const buildPresetAdjustments = (values: number[], presetId: PresetId) => {
  const adjustments = new Array(values.length).fill(0);
  const ranking = rankMetrics(values);

  ranking.forEach((metricIndex, rankingIndex) => {
    if (presetId === 'balanced') {
      adjustments[metricIndex] = rankingIndex < 2 ? 8 : 4;
      return;
    }

    if (presetId === 'growth') {
      adjustments[metricIndex] = rankingIndex < 3 ? 18 : 10;
      return;
    }

    adjustments[metricIndex] = rankingIndex < 2 ? 12 : -6;
  });

  return adjustments;
};

export function LabPage() {
  const { metrics, summary } = useMetricsStorage();
  const [preset, setPreset] = useState<PresetId>('balanced');
  const [adjustments, setAdjustments] = useState<number[]>(() => metrics.map(() => 0));

  useEffect(() => {
    setAdjustments(buildPresetAdjustments(metrics.map((metric) => metric.value), preset));
  }, [metrics, preset]);

  const simulation = useMemo(() => {
    const channels = metrics.map((metric, index) => {
      const uplift = adjustments[index] ?? 0;
      const projectedValue = Math.max(0, Math.round(metric.value * (1 + uplift / 100)));
      const increment = projectedValue - metric.value;

      return {
        ...metric,
        uplift,
        projectedValue,
        increment,
      };
    });

    const projectedTotal = channels.reduce((accumulator, channel) => accumulator + channel.projectedValue, 0);
    const incrementalTotal = projectedTotal - summary.total;
    const bestOpportunity = [...channels].sort((left, right) => right.increment - left.increment)[0] ?? null;

    return {
      channels,
      projectedTotal,
      incrementalTotal,
      incrementalRate: summary.total > 0 ? (incrementalTotal / summary.total) * 100 : 0,
      bestOpportunity,
    };
  }, [adjustments, metrics, summary.total]);

  const maxProjected = simulation.channels.reduce(
    (currentMax, channel) => Math.max(currentMax, channel.projectedValue),
    1,
  );

  const handleAdjustmentChange = (index: number, nextValue: number) => {
    setAdjustments((currentAdjustments) =>
      currentAdjustments.map((value, currentIndex) => (currentIndex === index ? nextValue : value)),
    );
  };

  return (
    <main className="min-h-screen bg-[#050b16] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-accentSoft/80">Growth Lab</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">增长实验室</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              复用当前渠道数据做策略预演。你可以切换预设，或手动调节单渠道增幅，观察整体增量和机会分布。
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
              to="/charts"
              className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accentSoft transition hover:bg-accent/15"
            >
              查看图表工作台
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <div className="relative overflow-hidden border border-white/10 bg-[linear-gradient(150deg,rgba(8,16,31,0.94),rgba(12,22,41,0.88))] p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,208,197,0.16),transparent_32%)]" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Scenario</p>
              <h2 className="mt-2 font-display text-3xl text-white">从现有投放结构推演下一轮增长空间</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                页面不会改写原始业务数据，只做局部预演。适合在正式调整预算前，快速比较不同动作对总量的影响。
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-slate-400">当前总量</p>
                  <p className="mt-3 font-display text-3xl text-white">{formatter.format(summary.total)}</p>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-slate-400">预测总量</p>
                  <p className="mt-3 font-display text-3xl text-white">{formatter.format(simulation.projectedTotal)}</p>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-slate-400">预计增幅</p>
                  <p className="mt-3 font-display text-3xl text-white">
                    {simulation.incrementalRate >= 0 ? '+' : ''}
                    {simulation.incrementalRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Signal</p>
            <h2 className="mt-2 font-display text-2xl text-white">策略提示</h2>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-slate-400">预估新增规模</p>
                <p className="mt-2 font-display text-4xl text-white">
                  {simulation.incrementalTotal >= 0 ? '+' : ''}
                  {formatter.format(simulation.incrementalTotal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">当前最佳机会</p>
                <p className="mt-2 text-xl text-white">{simulation.bestOpportunity?.label ?? '暂无数据'}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {simulation.bestOpportunity
                    ? `这条渠道在当前方案下预计新增 ${formatter.format(simulation.bestOpportunity.increment)}。`
                    : '需要至少一条可用指标才能生成建议。'}
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 text-sm leading-7 text-slate-400">
                建议把实验室作为预算沟通页，把图表工作台作为原始数据整理页，两者分别处理“整理”和“预演”。
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="border border-white/10 bg-surface/55 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Presets</p>
            <h2 className="mt-2 font-display text-2xl text-white">选择策略模板</h2>

            <div className="mt-6 space-y-3">
              {(Object.keys(presetMeta) as PresetId[]).map((presetId) => {
                const isActive = presetId === preset;
                return (
                  <button
                    key={presetId}
                    type="button"
                    onClick={() => setPreset(presetId)}
                    className={`w-full border px-4 py-4 text-left transition ${
                      isActive
                        ? 'border-accent/40 bg-accent/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-display text-xl text-white">{presetMeta[presetId].label}</span>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{isActive ? 'Active' : 'Preset'}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{presetMeta[presetId].description}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,36,0.86),rgba(7,11,24,0.98))] p-5">
            <div className="flex flex-col gap-3 border-b border-white/8 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Channel Tuning</p>
                <h2 className="mt-2 font-display text-2xl text-white">逐渠道调节增幅</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-400">
                预设会先填充一组推荐值，之后你可以对每条渠道做独立微调，范围为 -20% 到 +40%。
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {simulation.channels.map((channel, index) => (
                <article key={channel.id} className="grid gap-4 border border-white/10 bg-white/[0.02] p-4 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.1fr)]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Channel {index + 1}</p>
                    <h3 className="mt-2 font-display text-2xl text-white">{channel.label}</h3>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>当前 {formatter.format(channel.value)}</span>
                      <span>预测 {formatter.format(channel.projectedValue)}</span>
                      <span>
                        变化 {channel.increment >= 0 ? '+' : ''}
                        {formatter.format(channel.increment)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>单渠道调节</span>
                      <span>
                        {channel.uplift >= 0 ? '+' : ''}
                        {channel.uplift}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="40"
                      step="1"
                      value={channel.uplift}
                      onChange={(event) => handleAdjustmentChange(index, Number(event.target.value))}
                      className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#59d0c5]"
                    />

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
                        <span>Projected Volume</span>
                        <span>{Math.round((channel.projectedValue / maxProjected) * 100)}%</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(89,208,197,0.95),rgba(78,116,255,0.9))]"
                          style={{ width: `${Math.max(8, (channel.projectedValue / maxProjected) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
