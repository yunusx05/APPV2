import React from 'react';
import { Task, ProjectSummary } from '../types';

interface ProjectsViewProps {
  tasks: Task[];
  projectAdjustments: Record<number, number>;
  onAdjust: (projectId: number, delta: number) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ tasks, projectAdjustments, onAdjust }) => {
  // Aggregate tasks into projects
  const projectsMap: Record<number, ProjectSummary> = {};

  tasks.filter(t => t.projectId).forEach(t => {
    if (!t.projectId) return;
    if (!projectsMap[t.projectId]) {
      projectsMap[t.projectId] = {
        projectId: t.projectId,
        title: t.projectTitle || "Projet Sans Titre",
        startDate: t.date,
        deadline: t.deadline || t.date,
        totalXp: 0,
        totalValue: 0,
        totalSteps: 0,
        doneSteps: 0,
        basePercent: 0,
        extraPercent: 0,
        progressPercent: 0
      };
    }
    const p = projectsMap[t.projectId];
    
    // Find earliest start and latest deadline
    if (t.date < p.startDate) p.startDate = t.date;
    if (t.deadline && t.deadline > p.deadline) p.deadline = t.deadline;

    p.totalXp += t.xp;
    p.totalValue += (t.value || 0);
    p.totalSteps += 1;
    if (t.completed) p.doneSteps += 1;
  });

  const projects = Object.values(projectsMap).sort((a,b) => a.deadline.localeCompare(b.deadline));

  // Calculate percentages
  projects.forEach(p => {
    const base = Math.round((p.doneSteps / p.totalSteps) * 100);
    const extra = projectAdjustments[p.projectId] || 0;
    p.basePercent = base;
    p.extraPercent = extra;
    p.progressPercent = Math.min(100, Math.max(0, base + extra));
  });

  if (projects.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center text-slate-500 italic border-dashed border-2 border-slate-700 animate-fadeIn">
        Aucun projet en cours. Accepte un brief dans le Générateur pour démarrer une mission multi-étapes.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="glass-card rounded-2xl p-4 mb-2">
        <h3 className="text-base font-bold text-white m-0">Vue Projets</h3>
        <p className="text-xs text-slate-400 mt-1">
          Suis ton avancement global sur les missions multi-étapes.
        </p>
      </div>

      {projects.map(p => {
        const isLate = new Date().toISOString().split('T')[0] > p.deadline && p.progressPercent < 100;
        const isDone = p.progressPercent >= 100;
        
        let statusColor = "text-amber-400 bg-amber-400/10 border-amber-400/20";
        let statusText = "En cours";
        
        if (isDone) {
            statusColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            statusText = "Terminé";
        } else if (isLate) {
            statusColor = "text-rose-400 bg-rose-400/10 border-rose-400/20";
            statusText = "Retard";
        }

        return (
          <div key={p.projectId} className="glass-card rounded-2xl p-5 hover:border-slate-600 transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
               <div>
                  <h4 className="font-bold text-lg text-slate-100">{p.title}</h4>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Du {new Date(p.startDate).toLocaleDateString('fr-FR')} au {new Date(p.deadline).toLocaleDateString('fr-FR')}
                  </div>
               </div>
               <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                 {statusText}
               </span>
            </div>

            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-700">
               <div 
                 className={`h-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-lime-500 to-green-500'}`} 
                 style={{ width: `${p.progressPercent}%` }}
               />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex gap-3 text-slate-400">
                   <span><strong className="text-white">{p.progressPercent}%</strong> complété</span>
                   <span><strong className="text-white">{p.doneSteps}/{p.totalSteps}</strong> étapes</span>
                   <span><strong className="text-white">{p.totalValue}€</strong> total</span>
                </div>
                
                <div className="flex items-center gap-1">
                    <button 
                      onClick={() => onAdjust(p.projectId, -10)}
                      className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-[10px] font-bold text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                        -10%
                    </button>
                    <span className="text-[10px] text-slate-500 px-1 font-mono">{p.extraPercent > 0 ? '+' : ''}{p.extraPercent}% manuel</span>
                    <button 
                      onClick={() => onAdjust(p.projectId, 10)}
                      className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-[10px] font-bold text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                        +10%
                    </button>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsView;
