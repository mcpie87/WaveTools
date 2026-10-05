'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { LoadingStep, LoadingStepStatus } from '../hooks/useMapData';

interface MapLoadingScreenProps {
  steps: LoadingStep[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StepIcon({ status }: { status: LoadingStepStatus }) {
  if (status === 'done') {
    return (
      <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--loading-success)' }} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'error') {
    return (
      <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--loading-error)' }} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === 'loading') {
    return (
      <svg className="w-4 h-4 shrink-0 animate-spin" style={{ color: 'var(--loading-active)' }} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <path d="M8 1.5A6.5 6.5 0 0 1 14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  // pending
  return (
    <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--loading-muted)', opacity: 0.4 }} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

function ElapsedTime({ step }: { step: LoadingStep }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (step.status !== 'loading') return;
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, [step.status]);

  if (step.status === 'pending') return null;

  const elapsed = step.status === 'loading'
    ? now - (step.startedAt ?? now)
    : (step.completedAt ?? 0) - (step.startedAt ?? 0);

  if (elapsed < 200) return null;

  return (
    <span
      className="text-[11px] font-mono tabular-nums ml-auto pl-3 shrink-0"
      style={{ color: 'var(--loading-muted)' }}
    >
      {(elapsed / 1000).toFixed(1)}s
    </span>
  );
}

function DownloadProgress({ step }: { step: LoadingStep }) {
  if (step.status !== 'loading' || step.progress === undefined) return null;

  const percent = Math.round(step.progress * 100);
  const hasBytes = step.downloadedBytes !== undefined;

  return (
    <div className="ml-6 mr-1 mt-1 mb-0.5">
      {/* Per-step progress bar */}
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--loading-track)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percent}%`,
            background: 'var(--loading-bar)',
          }}
        />
      </div>
      {hasBytes && (
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] font-mono" style={{ color: 'var(--loading-muted)' }}>
            {formatBytes(step.downloadedBytes!)}
            {step.totalBytes ? ` / ${formatBytes(step.totalBytes)}` : ''}
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--loading-muted)' }}>
            {percent}%
          </span>
        </div>
      )}
    </div>
  );
}

export function MapLoadingScreen({ steps }: MapLoadingScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const { doneCount, totalCount, overallPercent } = useMemo(() => {
    const total = steps.length;
    const done = steps.filter(s => s.status === 'done').length;

    // Weight the overall bar by actual step progress
    let weightedDone = 0;
    for (const step of steps) {
      if (step.status === 'done') {
        weightedDone += 1;
      } else if (step.status === 'loading') {
        // Use actual download progress if available, otherwise estimate 30%
        weightedDone += step.progress ?? 0.3;
      }
    }
    const percent = Math.round((weightedDone / total) * 100);
    return { doneCount: done, totalCount: total, overallPercent: Math.min(percent, 99) };
  }, [steps]);

  const allDone = doneCount === totalCount;
  const hasError = steps.some(s => s.status === 'error');

  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{ backgroundColor: 'rgb(var(--base-100))' }}
    >
      {/* Theme-aware CSS custom properties for the loading screen */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --loading-active: #2563eb;
          --loading-success: #16a34a;
          --loading-error: #dc2626;
          --loading-muted: rgb(var(--base-400));
          --loading-fg: hsl(var(--foreground));
          --loading-fg-dim: hsl(var(--muted-foreground));
          --loading-card-bg: rgb(var(--base-200));
          --loading-card-border: rgb(var(--base-300));
          --loading-track: rgb(var(--base-300));
          --loading-bar: linear-gradient(90deg, #2563eb, #7c3aed);
          --loading-glow-1: rgba(37, 99, 235, 0.06);
          --loading-glow-2: rgba(124, 58, 237, 0.04);
          --loading-step-active-bg: rgba(37, 99, 235, 0.06);
          --loading-step-error-bg: rgba(220, 38, 38, 0.06);
        }
        .dark {
          --loading-active: #60a5fa;
          --loading-success: #4ade80;
          --loading-error: #f87171;
          --loading-glow-1: rgba(96, 165, 250, 0.06);
          --loading-glow-2: rgba(167, 139, 250, 0.04);
          --loading-step-active-bg: rgba(96, 165, 250, 0.06);
          --loading-step-error-bg: rgba(248, 113, 113, 0.06);
        }
        @keyframes loading-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}} />

      {/* Ambient background glow */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--loading-glow-1) 0%, transparent 70%)',
            top: '10%',
            left: '20%',
            animation: 'loading-pulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--loading-glow-2) 0%, transparent 70%)',
            bottom: '10%',
            right: '15%',
            animation: 'loading-pulse 5s ease-in-out infinite 1s',
          }}
        />
      </div>

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: 'var(--loading-card-bg)',
            border: '1px solid var(--loading-card-border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'var(--loading-step-active-bg)',
                border: '1px solid var(--loading-card-border)',
              }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: 'var(--loading-active)' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight" style={{ color: 'var(--loading-fg)' }}>
                Loading Map
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--loading-fg-dim)' }}>
                Preparing interactive map data
              </p>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: 'var(--loading-fg-dim)' }}>
                {hasError ? 'Error loading data' : allDone ? 'Ready' : `${overallPercent}% complete`}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--loading-muted)' }}>
                {doneCount}/{totalCount}
              </span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--loading-track)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${allDone ? 100 : overallPercent}%`,
                  background: hasError
                    ? 'linear-gradient(90deg, var(--loading-error), var(--loading-error))'
                    : 'var(--loading-bar)',
                  boxShadow: hasError
                    ? '0 0 8px rgba(220,38,38,0.3)'
                    : '0 0 8px rgba(37,99,235,0.3)',
                }}
              />
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-0.5">
            {steps.map((step, i) => (
              <div key={step.id}>
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300"
                  style={{
                    transitionDelay: `${i * 50}ms`,
                    backgroundColor: step.status === 'loading'
                      ? 'var(--loading-step-active-bg)'
                      : step.status === 'error'
                      ? 'var(--loading-step-error-bg)'
                      : 'transparent',
                  }}
                >
                  <StepIcon status={step.status} />
                  <span
                    className="text-sm transition-colors duration-300"
                    style={{
                      color: step.status === 'done'
                        ? 'var(--loading-muted)'
                        : step.status === 'loading'
                        ? 'var(--loading-fg)'
                        : step.status === 'error'
                        ? 'var(--loading-error)'
                        : 'var(--loading-muted)',
                      opacity: step.status === 'pending' ? 0.5 : 1,
                    }}
                  >
                    {step.label}
                  </span>
                  <ElapsedTime step={step} />
                </div>
                <DownloadProgress step={step} />
              </div>
            ))}
          </div>

          {/* Error hint */}
          {hasError && (
            <div
              className="mt-4 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: 'var(--loading-step-error-bg)',
                border: '1px solid var(--loading-error)',
                borderColor: 'color-mix(in srgb, var(--loading-error) 30%, transparent)',
              }}
            >
              <p className="text-xs" style={{ color: 'var(--loading-error)', opacity: 0.8 }}>
                Some resources failed to load. Check your connection and try refreshing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
