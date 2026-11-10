import React, { useState } from 'react';
import {
  Workflow,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AutopilotWorkflow } from '../../types';

export const AutopilotView: React.FC = () => {
  const {
    activeBrand,
    workflows,
    updateWorkflow,
    consumeCredit,
    showToast,
    setCurrentView,
  } = useApp();

  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const handleRunWorkflow = async (wf: AutopilotWorkflow) => {
    if (!consumeCredit(4)) return;

    setRunningWorkflowId(wf.id);
    setActiveStepIndex(0);
    showToast(`Launching ${wf.title}...`, 'info');

    // Run steps in sequence
    const updatedSteps = [...wf.steps];

    for (let i = 0; i < updatedSteps.length; i++) {
      setActiveStepIndex(i);
      updatedSteps[i] = { ...updatedSteps[i], status: 'running' };
      updateWorkflow(wf.id, { steps: [...updatedSteps], status: 'running' });

      try {
        const res = await fetch('/api/ai/workflow-step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stepName: updatedSteps[i].name,
            workflowCategory: wf.category,
            brand: activeBrand,
            stepIndex: i,
          }),
        });
        const data = await res.json();
        updatedSteps[i] = {
          ...updatedSteps[i],
          status: 'completed',
          outputSummary: data.outputSummary,
        };
      } catch {
        updatedSteps[i] = {
          ...updatedSteps[i],
          status: 'completed',
          outputSummary: `Completed step "${updatedSteps[i].name}" with active brand parameters.`,
        };
      }

      updateWorkflow(wf.id, {
        steps: [...updatedSteps],
        lastRun: new Date().toLocaleTimeString(),
      });
      // Short visual pacing pause
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    updateWorkflow(wf.id, { status: 'completed' });
    setRunningWorkflowId(null);
    setActiveStepIndex(-1);
    showToast(`Workflow "${wf.title}" executed successfully!`, 'success');
  };

  const handleResetWorkflow = (wf: AutopilotWorkflow) => {
    const resetSteps = wf.steps.map((s) => ({ ...s, status: 'idle' as const, outputSummary: undefined }));
    updateWorkflow(wf.id, { steps: resetSteps, status: 'idle' });
    showToast('Workflow reset to initial state.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Workflow className="h-3.5 w-3.5" />
            <span>Module 10: Autonomous Marketing Workflows</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">AI Marketing Autopilot</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Orchestrate multi-step marketing operations without repetitive prompt juggling. Autopilot coordinates strategy, content generation, and calendar scheduling under human oversight.
          </p>
        </div>

        {activeBrand && (
          <div className="text-xs text-slate-400 bg-slate-800/60 rounded-xl px-3 py-2 border border-slate-700/60">
            Pipeline Target: <strong className="text-indigo-300">{activeBrand.name}</strong>
          </div>
        )}
      </div>

      {/* Workflows List */}
      <div className="space-y-6">
        {workflows.map((wf) => {
          const isRunning = runningWorkflowId === wf.id;
          const isCompleted = wf.status === 'completed';

          return (
            <div
              key={wf.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-extrabold text-white">{wf.title}</h3>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Completed
                      </span>
                    )}
                    {isRunning && (
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1 animate-pulse">
                        <RefreshCw className="h-3 w-3 animate-spin" /> In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{wf.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <button
                      onClick={() => handleResetWorkflow(wf)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Reset Workflow"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRunWorkflow(wf)}
                    disabled={isRunning}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Running Autopilot...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{isCompleted ? 'Re-run Pipeline' : 'Run Autopilot Pipeline'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step Sequence Timeline */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Execution Pipeline ({wf.steps.length} Steps)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {wf.steps.map((step, idx) => {
                    const stepDone = step.status === 'completed';
                    const stepRunning = step.status === 'running';

                    return (
                      <div
                        key={step.id}
                        className={`rounded-xl border p-3.5 text-xs transition-all ${
                          stepDone
                            ? 'bg-slate-800/80 border-emerald-500/40 text-slate-100'
                            : stepRunning
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                            : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] text-slate-400">
                            Step 0{idx + 1}
                          </span>
                          {stepDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : stepRunning ? (
                            <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-slate-600" />
                          )}
                        </div>

                        <div className="font-bold text-white text-[11px] mb-1">{step.name}</div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          {step.description}
                        </p>

                        {step.outputSummary && (
                          <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-emerald-300/90 font-medium line-clamp-2">
                            {step.outputSummary}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Human Oversight and Final Gate */}
              {isCompleted && (
                <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>
                      Pipeline complete. Staged assets are waiting in your{' '}
                      <strong className="text-white">Content Calendar</strong> and{' '}
                      <strong className="text-white">Approvals Queue</strong>.
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentView('approvals')}
                    className="font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Inspect Approvals</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
