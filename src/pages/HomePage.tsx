import { Link } from 'react-router-dom';

const featureItems = [
  {
    title: '动态图表切换',
    description: '在同一份运营数据上切换柱状、折线与饼图，不为演示额外维护多套状态。',
  },
  {
    title: '本地持久化编辑',
    description: '首次使用自动写入 mock 数据，后续变更直接保存到 localStorage，刷新后依然可用。',
  },
  {
    title: '即时分析摘要',
    description: '总量、均值、头部渠道占比随数据实时变化，保留轻量分析视角而不过度堆砌模块。',
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#060b16] text-slate-100">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-90" />
        <div className="absolute inset-x-0 top-[-14rem] h-[26rem] bg-[radial-gradient(circle,rgba(78,116,255,0.28),transparent_52%)]" />
        <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(89,208,197,0.18),transparent_62%)] blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-14 pt-6 lg:px-10">
          <header className="flex items-center justify-between py-4">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.32em] text-accentSoft/90">Sales Insight Studio</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/lab"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-accent/50 hover:bg-white/10"
              >
                打开增长实验室
              </Link>
              <Link
                to="/charts"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-accent/50 hover:bg-white/10"
              >
                进入图表工作台
              </Link>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm uppercase tracking-[0.4em] text-accentSoft/90">运营 / 销售 / 趋势洞察</p>
              <h1 className="font-display text-5xl font-semibold leading-[0.95] text-white md:text-6xl lg:text-7xl">
                把本地数据
                <span className="block text-accentSoft">变成可操作的增长视图</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                一个前端即可运行的分析工作台。无需后端、无需数据库，直接用 mock 初始化数据并在浏览器里持续编辑、对比、观察趋势。
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/charts"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-accent/90"
                >
                  查看动态图表
                </Link>
                <Link
                  to="/lab"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                >
                  进入增长实验室
                </Link>
                <a
                  href="#capabilities"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                >
                  了解能力结构
                </a>
              </div>
            </div>

            <div className="relative h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(10,18,39,0.88),rgba(7,12,28,0.56))] shadow-glow">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
              <div className="absolute left-8 top-8 right-8 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live Overview</p>
                  <p className="mt-3 font-display text-4xl text-white">3.7K</p>
                  <p className="mt-2 text-sm text-slate-400">当前总转化规模</p>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  +12.4% 本周波动
                </div>
              </div>

              <div className="absolute inset-x-8 bottom-10 top-36 flex items-end gap-4">
                {[48, 68, 42, 84, 58, 76].map((height, index) => (
                  <div key={height} className="relative flex h-full flex-1 items-end">
                    <div className="absolute inset-x-0 bottom-0 top-4 rounded-full bg-white/[0.03]" />
                    <div
                      className="relative w-full rounded-full bg-[linear-gradient(180deg,rgba(89,208,197,0.98),rgba(78,116,255,0.52))] shadow-[0_12px_36px_rgba(78,116,255,0.28)]"
                      style={{ height: `${height}%`, animationDelay: `${index * 120}ms` }}
                    />
                  </div>
                ))}
              </div>

              <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-3 text-sm text-slate-300">
                <div className="border-t border-white/10 pt-3">渠道效率稳定在头部平台</div>
                <div className="border-t border-white/10 pt-3">本地编辑后立即重绘趋势</div>
                <div className="border-t border-white/10 pt-3">适合演示、原型与轻量分析</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-t border-white/8 bg-[#08101f] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-accentSoft/80">能力结构</p>
              <h2 className="mt-4 max-w-sm font-display text-3xl text-white md:text-4xl">把单页原型做得足够像真实工作台</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {featureItems.map((item) => (
                <article key={item.title} className="border-t border-white/10 pt-4">
                  <h3 className="font-display text-xl text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-accentSoft/80">Persistence</p>
            <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">首次打开写入默认数据，之后就交给浏览器本地状态管理</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
              项目不接入服务端接口。图表页读取统一数据源，数据编辑、摘要指标和图表 option 都围绕同一份记录数组派生，适合做前端作品、产品演示和轻量运营沙盘。
            </p>
          </div>
          <div className="space-y-4 border border-white/10 bg-white/[0.03] p-6">
            <div>
              <p className="text-sm text-slate-400">数据来源</p>
              <p className="mt-2 text-2xl text-white">Mock → localStorage</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">图表类型</p>
              <p className="mt-2 text-2xl text-white">柱状 / 折线 / 饼图</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">交互方式</p>
              <p className="mt-2 text-2xl text-white">编辑即更新</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">新增页面</p>
              <p className="mt-2 text-2xl text-white">策略预演实验室</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 px-6 py-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-accentSoft/80">Start</p>
            <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">先整理原始数据，再到增长实验室推演下一轮动作</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/charts"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-slate-100"
            >
              打开 Charts Workspace
            </Link>
            <Link
              to="/lab"
              className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              打开 Growth Lab
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
