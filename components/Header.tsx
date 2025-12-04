
import React from 'react';
import { HeaderProps } from '../types';
import { Instagram, Linkedin, Palette } from 'lucide-react';

interface ExtendedHeaderProps extends HeaderProps {
    onSocialUpdate?: (delta: number) => void;
}

const Header: React.FC<ExtendedHeaderProps> = ({ xp, money, streak, socialGoal, onSocialUpdate }) => {
  // Level Logic
  const LEVELS = [
      { min: 0, title: 'Junior', rank: 'NIVEAU 1', next: 500 },
      { min: 500, title: 'Freelance', rank: 'NIVEAU 2', next: 1500 },
      { min: 1500, title: 'Closer', rank: 'NIVEAU 3', next: 3000 },
      { min: 3000, title: 'Machine', rank: 'NIVEAU 4', next: 5000 },
      { min: 5000, title: 'Boss', rank: 'NIVEAU 5', next: 99999 }
  ];

  let currentLevel = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].min) {
          currentLevel = LEVELS[i];
          break;
      }
  }

  const nextXp = currentLevel.next;
  const currentInLevel = xp - currentLevel.min;
  const needed = nextXp - currentLevel.min;
  const progressPercent = Math.min(100, Math.max(0, (currentInLevel / needed) * 100));
  
  const moneyGoal = 10000;
  const moneyPercent = Math.min(100, (money / moneyGoal) * 100);

  // Icons mapping
  const PlatformIcon = socialGoal?.platform === 'LinkedIn' ? Linkedin : (socialGoal?.platform === 'Behance' ? Palette : Instagram);

  return (
    <>
      {/* TOP BAR */}
      <div className="app-header">
        <div className="app-header-left">
            <div className="app-logo">⚡</div>
            <div className="app-title-group">
                <div className="app-title">Focus Arena</div>
                <div className="app-subtitle">Task gamification</div>
            </div>
        </div>
        <div className="app-header-right">
            <div className="streak-pill">
                <span className="streak-dot"></span>
                <span className="streak-count">Streak {streak}</span>
            </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid-stats">
        {/* Profile Card */}
        <div className="card card-profile">
            <div className="avatar-box">🚀</div>
            <div className="profile-info flex-1 min-w-0">
                <p style={{margin: 0, fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                    {currentLevel.rank}
                </p>
                <h2 className="truncate">{currentLevel.title}</h2>
                <div className="progress-container">
                    <div className="bar bar-xp" style={{width: `${progressPercent}%`}}></div>
                </div>
            </div>
        </div>

        {/* Money Card */}
        <div className="card ca-box">
            <div className="ca-label">
                <span>CA Fictif</span>
            </div>
            <span className="ca-value text-xl">{money}€</span>
            <div className="ca-track mt-auto">
                <div className="ca-fill" style={{width: `${moneyPercent}%`}}></div>
            </div>
        </div>
      </div>

      {/* SOCIAL GOAL CARD (NEW & BIG) */}
      {socialGoal && onSocialUpdate && (
        <div className="card p-4 mb-4 border-pink-500/30 bg-pink-900/10">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                        <PlatformIcon size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Objectif {socialGoal.platform}</div>
                        <div className="text-lg font-black text-white">{socialGoal.current} <span className="text-sm text-pink-400 font-medium">/ {socialGoal.target}</span></div>
                    </div>
                </div>
                <div className="text-right">
                     <div className="text-xs font-bold text-pink-400">{Math.round((socialGoal.current / socialGoal.target) * 100)}%</div>
                </div>
            </div>

            {/* Big Progress Bar */}
            <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mb-4 relative">
                 <div 
                    className="h-full bg-gradient-to-r from-pink-600 to-purple-500 transition-all duration-500" 
                    style={{width: `${Math.min(100, (socialGoal.current / socialGoal.target) * 100)}%`}}
                 ></div>
                 {/* Scanlines effect */}
                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] opacity-30"></div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-4 gap-2">
                <button onClick={() => onSocialUpdate(-10)} className="bg-slate-800 border border-slate-700 text-rose-400 hover:bg-rose-900/30 hover:border-rose-500/50 py-2 rounded-lg text-xs font-bold transition-all">-10</button>
                <button onClick={() => onSocialUpdate(-1)} className="bg-slate-800 border border-slate-700 text-rose-300 hover:bg-rose-900/30 hover:border-rose-500/50 py-2 rounded-lg text-xs font-bold transition-all">-1</button>
                <button onClick={() => onSocialUpdate(1)} className="bg-slate-800 border border-slate-700 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-500/50 py-2 rounded-lg text-xs font-bold transition-all">+1</button>
                <button onClick={() => onSocialUpdate(10)} className="bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-emerald-900/30 hover:border-emerald-500/50 py-2 rounded-lg text-xs font-bold transition-all">+10</button>
            </div>
        </div>
      )}
    </>
  );
};

export default Header;
