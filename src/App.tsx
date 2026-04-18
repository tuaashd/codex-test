import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const HomePage = lazy(async () => {
  const module = await import('./pages/HomePage');
  return { default: module.HomePage };
});

const ChartsPage = lazy(async () => {
  const module = await import('./pages/ChartsPage');
  return { default: module.ChartsPage };
});

const LabPage = lazy(async () => {
  const module = await import('./pages/LabPage');
  return { default: module.LabPage };
});

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050b16] text-sm uppercase tracking-[0.32em] text-slate-400">
          Loading workspace
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
