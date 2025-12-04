
import React, { useState } from 'react';
import { Task, SocialGoal } from '../types';
import { generateMissionBrief, generateGrowthTactics, AiBrief, GrowthTacticResult } from '../services/geminiService';
import { Loader2, Zap, Briefcase } from 'lucide-react';

interface GeneratorProps {
  onAccept: (tasks: Task[]) => void;
  socialGoal?: SocialGoal;
}

type GenMode = 'brief' | 'growth';

const Generator: React.FC<GeneratorProps> = ({ onAccept, socialGoal }) => {
  const [mode, setMode] = useState<GenMode>('brief');
  
  // States Brief
  const [sector, setSector] = useState('random');
  const [projectType, setProjectType] = useState('random');
  const [visualStyle, setVisualStyle] = useState('random');
  
  // Loading & Results
  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState<AiBrief | null>(null);
  const [growthResult, setGrowthResult] = useState<GrowthTacticResult | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setBrief(null); setGrowthResult(null);
    
    try {
        if (mode === 'brief') {
            const res = await generateMissionBrief(sector, projectType, visualStyle);
            if (res) setBrief(res);
        } else if (mode === 'growth' && socialGoal) {
            const res = await generateGrowthTactics(socialGoal);
            if (res) setGrowthResult(res);
        }
    } catch(e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAccept = () => {
      let newTasks: Task[] = [];
      const today = new Date().toISOString().split('T')[0];

      if (brief) {
          newTasks = brief.smartWorkflow.steps.map((step, idx) => ({
              id: Date.now() + idx,
              title: step.title,
              date: today,
              cat: step.category as any,
              xp: step.xp,
              value: step.value,
              completed: false
          }));
      } else if (growthResult) {
          newTasks = growthResult.tasks.map((t, idx) => ({
              id: Date.now() + idx,
              title: t.title,
              date: today,
              cat: t.cat as any,
              xp: t.xp,
              value: t.value,
              completed: false
          }));
      }

      onAccept(newTasks);
      setBrief(null);
      setGrowthResult(null);
  };

  return (
    <>
        <div className="card gen-card">
            {/* TABS MODE */}
            <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl mb-4">
                <button 
                    onClick={() => setMode('brief')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${mode === 'brief' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    <Briefcase size={14}/> Brief Créatif
                </button>
                <button 
                    onClick={() => setMode('growth')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${mode === 'growth' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    <Zap size={14}/> Growth Tactic
                </button>
            </div>

            {mode === 'brief' && (
                <>
                    <h3 className="section-title mt-0">Configuration</h3>
                    <div className="gen-controls">
                        <select value={sector} onChange={e => setSector(e.target.value)}>
                            <option value="random">🎲 Industrie Aléatoire</option>
                            <option value="Cosmetic">Beauté</option>
                            <option value="Food">Food & Drink</option>
                            <option value="Fashion">Mode</option>
                            <option value="Tech">Tech</option>
                        </select>
                        <select value={projectType} onChange={e => setProjectType(e.target.value)}>
                            <option value="random">🎲 Projet Aléatoire</option>
                            <option value="Identity">Identité Visuelle</option>
                            <option value="Packaging">Packaging 3D</option>
                            <option value="Motion">Motion Design</option>
                        </select>
                        <select value={visualStyle} onChange={e => setVisualStyle(e.target.value)}>
                            <option value="random">🎨 Style Aléatoire</option>
                            <option value="Minimal">Minimal</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Cyberpunk">Cyberpunk</option>
                        </select>
                    </div>
                </>
            )}

            {mode === 'growth' && (
                <>
                     <h3 className="section-title mt-0 text-emerald-400">Tactical Growth AI</h3>
                     <p className="text-xs text-slate-400 mb-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        L'IA analyse ton objectif social ({socialGoal?.current}/{socialGoal?.target}) et génère 3 tâches ciblées pour aujourd'hui.
                     </p>
                </>
            )}

            <button className="btn-main" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mx-auto" size={16}/> : 'Générer la Mission'}
            </button>
        </div>

        {/* RESULTS - RECEIPT STYLE */}
        {(brief || growthResult) && (
            <div className="brief-paper">
                <div className="bp-deadline">
                    {brief ? `DEADLINE: ${brief.smartWorkflow.estimatedDuration}J` : 'TODAY'}
                </div>

                <div className="bp-header">
                    <span className="bp-label">
                        {brief ? 'Mission Brief' : 'Growth Plan'}
                    </span>
                    <h1 className="bp-title">
                        {brief?.brandName || 'Tactique Journalière'}
                    </h1>
                </div>

                {brief && (
                    <>
                        <div className="bp-grid">
                            <div><div className="bp-h3">Type</div><div className="bp-val">{brief.projectType}</div></div>
                            <div><div className="bp-h3">Budget</div><div className="bp-val">{brief.smartWorkflow.totalBounty}€</div></div>
                        </div>
                        <div className="bp-section">
                            <div className="bp-h2">Le client</div>
                            <p className="bp-text">{brief.productName} - {brief.moodDescription}</p>
                        </div>
                    </>
                )}

                <div className="bp-section">
                    <div className="bp-h2">Tâches à valider</div>
                    <ul className="bp-list">
                        {brief && brief.smartWorkflow.steps.map((s, i) => <li key={i}>{s.title}</li>)}
                        {growthResult && growthResult.tasks.map((t, i) => <li key={i}>{t.title}</li>)}
                    </ul>
                </div>

                <button className="btn-accept" onClick={handleAccept}>✅ Accepter le challenge</button>
            </div>
        )}
    </>
  );
};

export default Generator;
