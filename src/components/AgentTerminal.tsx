"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";
import {
  Play, Pause, RotateCcw, Cpu, ShieldCheck, Database,
  Sparkles, CheckCircle2, User, ChevronRight,
} from "lucide-react";

interface WorkflowStep {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  aiRole: string;
  humanRole: string;
  deliverable: string;
}

interface AgentData {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  specs: string[];
  systemPrompt: string;
  efficiency: string;
}

export default function AgentTerminal() {
  const t = useTranslations("terminal");

  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeAgent, setActiveAgent] = useState("context");

  const { ref: gridRef, inView: gridInView } = useInView(0.05);

  const steps: WorkflowStep[] = [
    { title: t("steps.0.title"), subtitle: t("steps.0.subtitle"), icon: <Cpu        className="w-5 h-5 text-brand-purple" />, aiRole: t("steps.0.aiRole"), humanRole: t("steps.0.humanRole"), deliverable: t("steps.0.deliverable") },
    { title: t("steps.1.title"), subtitle: t("steps.1.subtitle"), icon: <Sparkles   className="w-5 h-5 text-brand-purple" />, aiRole: t("steps.1.aiRole"), humanRole: t("steps.1.humanRole"), deliverable: t("steps.1.deliverable") },
    { title: t("steps.2.title"), subtitle: t("steps.2.subtitle"), icon: <Database   className="w-5 h-5 text-brand-purple" />, aiRole: t("steps.2.aiRole"), humanRole: t("steps.2.humanRole"), deliverable: t("steps.2.deliverable") },
    { title: t("steps.3.title"), subtitle: t("steps.3.subtitle"), icon: <ShieldCheck className="w-5 h-5 text-brand-purple" />, aiRole: t("steps.3.aiRole"), humanRole: t("steps.3.humanRole"), deliverable: t("steps.3.deliverable") },
  ];

  const agents: AgentData[] = [
    { id: "context",      name: t("agents.0.name"), role: t("agents.0.role"), icon: <Cpu        className="w-4 h-4 text-brand-purple" />, specs: t.raw("agents.0.specs") as string[], systemPrompt: t("agents.0.systemPrompt"), efficiency: t("agents.0.efficiency") },
    { id: "branding",     name: t("agents.1.name"), role: t("agents.1.role"), icon: <Sparkles   className="w-4 h-4 text-brand-purple" />, specs: t.raw("agents.1.specs") as string[], systemPrompt: t("agents.1.systemPrompt"), efficiency: t("agents.1.efficiency") },
    { id: "architecture", name: t("agents.2.name"), role: t("agents.2.role"), icon: <Database   className="w-4 h-4 text-brand-purple" />, specs: t.raw("agents.2.specs") as string[], systemPrompt: t("agents.2.systemPrompt"), efficiency: t("agents.2.efficiency") },
    { id: "qa",           name: t("agents.3.name"), role: t("agents.3.role"), icon: <ShieldCheck className="w-4 h-4 text-brand-purple" />, specs: t.raw("agents.3.specs") as string[], systemPrompt: t("agents.3.systemPrompt"), efficiency: t("agents.3.efficiency") },
  ];

  const agentKeys = ["context", "branding", "architecture", "qa"];

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((step) => {
            const next = (step + 1) % 4;
            setActiveAgent(agentKeys[next]);
            return next;
          });
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
    setProgress(0);
    setActiveAgent(agentKeys[idx]);
  };

  const handleAgentClick = (agentId: string) => {
    setActiveAgent(agentId);
    const idx = agentKeys.indexOf(agentId);
    if (idx !== -1) { setActiveStep(idx); setProgress(0); }
  };

  const restartSimulation = () => {
    setActiveStep(0);
    setProgress(0);
    setIsRunning(true);
    setActiveAgent("context");
  };

  return (
    <section id="pipeline" className="relative pb-24 bg-[#050505] overflow-hidden border-b border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-radial-purple opacity-[0.12] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Workflow grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          style={{
            opacity: gridInView ? 1 : 0,
            transform: gridInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
            transitionDelay: "100ms",
          }}
        >
          {/* Interactive Workflow Box */}
          <div className="lg:col-span-2 flex flex-col h-[480px] rounded-xl border border-white/8 bg-[#0d0d11]/60 backdrop-blur-md shadow-2xl overflow-hidden p-6 md:p-8 justify-between relative">

            {/* Header controls */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="text-xs font-bold tracking-wider text-slate-300">
                {t("interactiveTitle")}
              </span>
              <div className="flex items-center gap-3">
                {isRunning && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={restartSimulation}
                    className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-brand-purple hover:border-brand-purple/30 transition-all duration-300 cursor-pointer"
                    title="Recommencer"
                    aria-label="Recommencer la simulation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-brand-purple hover:border-brand-purple/30 transition-all duration-300 cursor-pointer"
                    aria-label={isRunning ? "Mettre en pause" : "Démarrer la simulation"}
                  >
                    {isRunning ? (
                      <Pause className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    )}</button>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-2 py-4">
              {steps.map((step, idx) => {
                const isActive    = idx === activeStep;
                const isCompleted = idx < activeStep;
                return (
                  <button
                    key={idx}
                    onClick={() => handleStepClick(idx)}
                    className="flex flex-col text-left group focus:outline-none cursor-pointer"
                  >
                    <div className="w-full bg-[#050505] h-1.5 rounded-full overflow-hidden mb-3 border border-white/5">
                      <div
                        className={`h-full transition-all duration-150 ${isActive ? "bg-brand-purple" : isCompleted ? "bg-purple-900/50" : "bg-transparent"}`}
                        style={{ width: isActive ? `${progress}%` : isCompleted ? "100%" : "0%" }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold font-mono uppercase tracking-wide block mb-1 ${
                        isActive ? "text-brand-purple" : "text-slate-500 group-hover:text-slate-400"
                      }`}
                    >  {t("stepLabel")} {idx + 1}
                    </span>
                    <span className={`text-[10px] md:text-xs font-bold leading-tight line-clamp-1 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                      {step.title.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stage detail */}
            <div
              key={activeStep}
              className="flex-1 bg-[#050505]/40 border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-between my-2 animate-in fade-in duration-300"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-normal">{steps[activeStep].title}</h4>
                    <span className="text-[10px] text-slate-500">{steps[activeStep].subtitle}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-[#0d0d11]/80 border border-purple-900/15">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-purple mb-1.5 font-mono">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{t("aiRoleLabel")}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{steps[activeStep].aiRole}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0d0d11]/80 border border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 mb-1.5 font-mono">
                      <User className="w-3.5 h-3.5" />
                      <span>{t("humanRoleLabel")}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{steps[activeStep].humanRole}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {t("deliverableLabel")}
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                  {steps[activeStep].deliverable}
                </span>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-4">
            {/* Status card */}
            <div className="p-5 rounded-xl border border-white/8 bg-[#0d0d11]/60 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-purple" />
                  {t("dashboardTitle")}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {t("dashboardStatus")}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t("velocityLabel")}</span>
                    <span className="text-brand-purple font-semibold">{t("velocityValue")}</span>
                  </div>
                  <div className="w-full bg-[#050505] rounded-full h-2">
                    <div className="bg-brand-purple h-2 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-[#050505] border border-white/5 text-center">
                      <div className="text-[10px] text-slate-400">{t("errorRateLabel")}</div>
                      <div className="text-sm font-bold text-slate-100">0.0%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#050505] border border-white/5 text-center">
                      <div className="text-[10px] text-slate-400">{t("qaQualityLabel")}</div>
                    <div className="text-sm font-bold text-emerald-400">100%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent selectors */}
            <div className="flex-1 p-5 rounded-xl border border-white/8 bg-[#0d0d11]/60 backdrop-blur-md flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 block font-mono">
                {t("agentSectionTitle")}
              </span>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleAgentClick(agent.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                      activeAgent === agent.id
                        ? "bg-brand-purple/10 border-brand-purple text-slate-100"
                        : "bg-slate-900/50 border-white/5 text-slate-400 hover:text-slate-200 hover:border-brand-purple/20"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span aria-hidden="true">{agent.icon}</span>
                      <span className="text-[10px] font-bold font-mono">{agent.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate leading-normal">{agent.role}</div>
                  </button>
                ))}
              </div>

              {/* Agent spec panel */}
              {agents.map((agent) => {
                if (agent.id !== activeAgent) return null;
                return (
                  <div
                    key={agent.id}
                    className="flex-1 p-3.5 rounded-lg bg-[#050505] border border-white/5 text-[11px] flex flex-col justify-between animate-in fade-in duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                        <span className="font-semibold text-slate-200">{agent.role}</span>
                        <span className="text-brand-purple font-bold font-mono text-[10px]">{agent.efficiency}</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-400 mb-3">
                        {agent.specs.map((spec, i) => (
                          <li key={i} className="flex items-center">
                            <ChevronRight className="w-3 h-3 text-brand-purple mr-1 shrink-0" aria-hidden="true" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-purple block mb-1 uppercase tracking-wider font-mono">
                        {t("systemPromptLabel")}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 leading-relaxed bg-slate-950/80 p-2 rounded border border-white/5 line-clamp-3">
                        "{agent.systemPrompt}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
