
import React from 'react';
import { Task } from '../types';

interface StatsViewProps {
  tasks: Task[];
}

const StatsView: React.FC<StatsViewProps> = ({ tasks }) => {
  // 1. Calcul XP sur les 7 derniers jours
  const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
  });

  const xpData = last7Days.map(dateStr => {
      return tasks
          .filter(t => t.completed && (t.completedAt === dateStr || (!t.completedAt && t.date === dateStr)))
          .reduce((acc, t) => acc + t.xp, 0);
  });

  const maxXP = Math.max(...xpData, 100); // Échelle minimum de 100

  // 2. Répartition par catégorie
  const cats = ['prod', 'sale', 'social', 'admin'];
  const catLabels = { prod: 'Créa', sale: 'Biz', social: 'Social', admin: 'Admin' };
  const catColors = { prod: 'bg-blue-500', sale: 'bg-cyan-400', social: 'bg-pink-500', admin: 'bg-slate-400' };
  
  const totalCompleted = tasks.filter(t => t.completed).length || 1;
  const catStats = cats.map(cat => {
      const count = tasks.filter(t => t.completed && t.cat === cat).length;
      return {
          cat,
          label: catLabels[cat as keyof typeof catLabels],
          count,
          percent: Math.round((count / totalCompleted) * 100),
          color: catColors[cat as keyof typeof catColors]
      };
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
        {/* GRAPHIQUE BARRES XP (CSS ONLY) */}
        <div className="card">
            <h3 className="section-title mt-0 mb-4">XP Semaine</h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
                {xpData.map((val, i) => {
                    const height = (val / maxXP) * 100;
                    const dayLabel = new Date(last7Days[i]).toLocaleDateString('fr-FR', {weekday: 'short'});
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                             <div className="relative w-full bg-slate-800/50 rounded-t-lg h-full flex items-end overflow-hidden">
                                 <div 
                                    className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-500 rounded-t-lg relative group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    style={{ height: `${height}%` }}
                                 ></div>
                             </div>
                             <span className="text-[10px] uppercase font-bold text-slate-500">{dayLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* REPARTITION (BARRES PROGRESSION) */}
        <div className="card">
            <h3 className="section-title mt-0 mb-4">Répartition</h3>
            <div className="space-y-4">
                {catStats.map((stat) => (
                    <div key={stat.cat}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-slate-300">{stat.label}</span>
                            <span className="text-slate-500">{stat.count} tâches ({stat.percent}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${stat.color} transition-all duration-500`} 
                                style={{ width: `${stat.percent}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default StatsView;
