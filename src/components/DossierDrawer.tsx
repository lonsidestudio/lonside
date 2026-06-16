"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { X, ArrowRight, CheckCircle, BarChart3, Clock, History, Layers, ExternalLink, Flame } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Project {
  id: string;
  title: string;
  tag: string;
  imageAlt: string;
  shortDesc: string;
  clientProblem: string;
  solution: string;
  timeSaved: string;
  qualityScore: string;
  perfScore: string;
  testimonial: {
    author: string;
    role: string;
    text: string;
  };
  timeline: {
    day: string;
    actor: string;
    action: string;
    status: "success" | "info" | "warning";
  }[];
  chartData: { name: string; Lonside: number; Standard: number }[];
  codeDiff: {
    filename: string;
    oldCode: string;
    newCode: string;
  };
  metrics: { label: string; value: string; detail: string }[];
}

export default function DossierDrawer() {
  const t = useTranslations("portfolioData");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"report" | "timeline" | "code" | "charts">("report");

  const rawProjects = t.raw("projects") as any[];

  const projects: Project[] = rawProjects.map((p) => ({
    ...p,
    timeline: p.timeline.map((item: any) => ({
      ...item,
      status: (item.actor.includes("Humain") || item.actor.includes("Human") || item.actor.includes("Expert")) ? "info" : "success"
    }))
  }));

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <section id="projects" className="relative py-24 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-semibold tracking-wide mb-4">
            <Flame className="w-3.5 h-3.5 text-brand-purple" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
            {t("title")}<span className="shimmer-text">{t("titleHighlight")}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-medium">
            {t("subtitle")}
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border border-white/8 hover:border-brand-purple/30"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-slate-900 border border-white/5 text-slate-400">
                  {project.tag}
                </span>
                <h3 className="text-lg font-bold text-white mt-4 mb-2">{project.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">{project.shortDesc}</p>

                <div className="space-y-3 mb-6 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{t("tabCharts")}</span>
                    <span className="text-brand-purple font-bold font-mono">{project.timeSaved}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-purple font-bold font-mono">{project.qualityScore}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-bold font-mono">{project.perfScore}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveProjectId(project.id);
                  setActiveTab("report");
                }}
                className="w-full flex items-center justify-center py-3 px-4 border border-white/10 hover:border-brand-purple/50 rounded-lg text-xs font-bold text-slate-200 hover:text-brand-purple bg-slate-900/50 hover:bg-brand-purple/5 transition-all duration-300 group cursor-pointer"
              >
                <span>{t("btnDetails")}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-out Technical Drawer */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setActiveProjectId(null)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-4xl bg-[#0d0d11] border-l border-white/8 h-full flex flex-col z-10 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121216]">
              <div>
                <span className="text-xs font-bold tracking-wider text-brand-purple font-mono">
                  {t("drawerTitle")}
                </span>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>Projet : {activeProject.title}</span>
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-purple-500/10 text-brand-purple border border-purple-500/20">
                    {activeProject.tag}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectId(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-brand-purple hover:bg-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/5 bg-[#121216] px-6 overflow-x-auto scrollbar-none whitespace-nowrap flex-nowrap">
              {[
                { id: "report", label: t("tabReport"), icon: <BarChart3 className="w-4 h-4" /> },
                { id: "timeline", label: t("tabTimeline"), icon: <History className="w-4 h-4" /> },
                { id: "code", label: t("tabCode"), icon: <Layers className="w-4 h-4" /> },
                { id: "charts", label: t("tabCharts"), icon: <BarChart3 className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`shrink-0 flex items-center space-x-2 py-4 px-4 border-b-2 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-brand-purple text-brand-purple"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 overflow-y-auto bg-[#030014]/40">
              {/* Tab 1: Report */}
              {activeTab === "report" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeProject.metrics.map((metric, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-slate-950/60 text-center">
                        <div className="text-2xl font-bold text-brand-purple font-mono">{metric.value}</div>
                        <div className="text-[11px] font-bold text-slate-200 mt-1">{metric.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{metric.detail}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-brand-purple mb-2">{t("clientProblem")}</h4>
                    <p className="text-sm text-slate-300 bg-slate-950/50 p-4 rounded-lg border border-white/5 leading-relaxed">
                      {activeProject.clientProblem}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-brand-purple mb-2">{t("approach")}</h4>
                    <p className="text-sm text-slate-300 bg-slate-950/50 p-4 rounded-lg border border-white/5 leading-relaxed">
                      {activeProject.solution}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 mb-4 tracking-wide">{t("traditionalMethod")}</h4>
                    <figure className="relative p-6 rounded-xl bg-slate-950/50 border border-white/8">
                      <blockquote className="text-sm text-slate-300 italic mb-4">
                        "{activeProject.testimonial.text}"
                      </blockquote>
                      <figcaption className="text-xs">
                        <strong className="text-slate-100">{activeProject.testimonial.author}</strong>
                        <span className="text-slate-500"> — {activeProject.testimonial.role}</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              )}

              {/* Tab 2: Timeline */}
              {activeTab === "timeline" && (
                <div className="relative pl-6 border-l-2 border-white/5 space-y-8 animate-in fade-in duration-300">
                  {activeProject.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-brand-purple bg-[#050505]">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
                      </span>

                      <div>
                        <span className="text-[10px] font-bold font-mono tracking-wider text-brand-purple">
                          {item.day} • {item.actor}
                        </span>
                        <p className="text-sm font-semibold text-slate-200 mt-0.5">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Comparative Method */}
              {activeTab === "code" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
                      <Layers className="w-4 h-4 text-brand-purple" />
                      <span>{activeProject.codeDiff.filename}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Old Method */}
                    <div className="border border-red-900/20 bg-red-950/5 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="text-red-400 font-bold tracking-wide text-xs mb-4 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <span>{t("traditionalMethod")}</span>
                        </div>
                        <ul className="space-y-3 text-slate-400 text-xs leading-relaxed">
                          {activeProject.codeDiff.oldCode.split("\n").map((line, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-red-500/70 mr-2">•</span>
                              <span>{line.replace(/^- /, "")}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* New Method */}
                    <div className="border border-emerald-900/20 bg-emerald-950/5 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="text-emerald-400 font-bold tracking-wide text-xs mb-4 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{t("lonsideMethod")}</span>
                        </div>
                        <ul className="space-y-3 text-slate-300 text-xs leading-relaxed">
                          {activeProject.codeDiff.newCode.split("\n").map((line, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-emerald-400 mr-2">✓</span>
                              <span>{line.replace(/^- /, "")}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Performance Charts */}
              {activeTab === "charts" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="text-sm text-slate-400 font-medium">
                    {t("chartsDesc")}
                  </p>

                  <div className="h-[280px] w-full bg-slate-950/40 p-4 rounded-xl border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activeProject.chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0d0d11", borderColor: "rgba(255, 255, 255, 0.08)" }}
                          labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                        />
                        <Bar dataKey="Lonside" name={t("chartLonsideLabel")} fill="#7c3aed" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Standard" name={t("chartStandardLabel")} fill="#64748b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-white/5 bg-[#121216] flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-brand-purple" />
                <span>{t("lastUpdate")}</span>
              </span>
              <button
                onClick={() => {
                  window.location.href = "/tarifs";
                }}
                className="px-5 py-2.5 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-xs font-bold text-white shadow-lg transition-all duration-300 flex items-center space-x-1 cursor-pointer"
              >
                <span>{t("ctaSimilar")}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
