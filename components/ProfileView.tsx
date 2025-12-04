
import React from 'react';
import { GameState } from '../types';
import { Crown, Star, Shield, Briefcase, AlertOctagon, RefreshCcw } from 'lucide-react';

interface ProfileViewProps {
  state: GameState;
  onResetApp?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ state, onResetApp }) => {
  const getLevel = (xp: number) => Math.floor(xp / 500) + 1;
  const freelanceLevel = getLevel(state.xpFreelance);
  const religionLevel = getLevel(state.xpReligion);

  return (
    <div className="animate-fadeIn pb-12 space-y-4">
      
      {/* IDENTITY CARD */}
      <div className="card card-profile flex-col text-center pt-8 pb-8 relative overflow-hidden">
          {/* Background effect */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
          
          <div className="relative z-10 w-24 h-24 rounded-3xl bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl shadow-2xl mb-4 mx-auto">
              🧔🏻‍♂️
          </div>
          <h2 className="relative z-10 text-2xl font-black text-white tracking-tight">Freelance 3D</h2>
          <div className="relative z-10 flex gap-2 justify-center mt-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-600 shadow-lg">Global LVL {Math.floor(state.xp / 1000) + 1}</span>
                {state.prestige > 0 && (
                    <span className="px-4 py-1.5 rounded-full bg-amber-500 text-black text-xs font-black uppercase flex items-center gap-1 shadow-lg shadow-amber-500/20">
                        <Crown size={12} /> P{state.prestige}
                    </span>
                )}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full px-4">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
                <Briefcase size={20} className="text-indigo-400 mb-2"/>
                <div className="text-2xl font-black text-white">{freelanceLevel}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Freelance</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
                <Shield size={20} className="text-teal-400 mb-2"/>
                <div className="text-2xl font-black text-white">{religionLevel}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Éthique</div>
            </div>
          </div>
      </div>

      {/* HALL OF FAME */}
      <div className="card">
          <h3 className="section-title mt-0 mb-4 flex items-center gap-2 text-amber-400">
              <Star size={16} fill="currentColor"/> Hall of Fame
          </h3>
          
          {state.archivedProjects.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/50 rounded-xl border border-slate-800/50">
                  <div className="text-3xl mb-2 opacity-30">🏆</div>
                  <div className="text-slate-500 text-sm font-medium">Aucun projet terminé</div>
                  <div className="text-slate-600 text-xs mt-1">Termine un brief pour entrer dans la légende</div>
              </div>
          ) : (
              <div className="space-y-3">
                  {state.archivedProjects.map((p) => (
                      <div key={p.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between group hover:border-slate-600 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg ${p.grade==='S'?'text-amber-400 bg-amber-900/20 border border-amber-500/30':(p.grade==='A'?'text-emerald-400 bg-emerald-900/20 border border-emerald-500/30':'text-slate-400 bg-slate-800')}`}>
                                  {p.grade}
                              </div>
                              <div>
                                  <div className="font-bold text-slate-200 text-sm">{p.title}</div>
                                  <div className="text-[10px] text-slate-500">{p.type}</div>
                              </div>
                          </div>
                          <div className="font-bold text-xs text-indigo-400">+{p.totalValue}€</div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* DANGER ZONE */}
      <div className="card border-red-900/30 bg-red-950/10 mt-8">
         <h3 className="text-red-500 font-bold flex items-center gap-2 mb-3 text-xs uppercase tracking-widest">
            <AlertOctagon size={14}/> Zone de Danger
         </h3>
         <p className="text-xs text-red-400/60 mb-4">
            Supprime toutes les données. Cette action est irréversible.
         </p>
         <button 
            onClick={onResetApp}
            className="w-full py-3 rounded-xl border border-red-600/50 text-red-500 font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
         >
            <RefreshCcw size={16} /> RÉINITIALISER L'APPLICATION
         </button>
      </div>

    </div>
  );
};

export default ProfileView;
