
import React, { useState, useEffect } from 'react';
import { GameState, Task, TabView, SocialGoal, ArchivedProject } from './types';
import { playSuccessSound } from './utils/sound';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TaskItem from './components/TaskItem';
import Generator from './components/Generator';
import TasksPlus from './components/TasksPlus';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import AutoBackup from './components/AutoBackup';
import CalendarView from './components/CalendarView';
import { CheckCircle, Trophy, User } from 'lucide-react';

const STORAGE_KEY = 'manager_v52_pixel';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE: GameState = {
  xpFreelance: 0,
  xpReligion: 0,
  xp: 0,
  money: 0,
  streak: 0,
  prestige: 0,
  lastLoginDate: '',
  tasks: [],
  archivedProjects: [],
  startDate: null,
  projectAdjustments: {},
  currentGrowthGoal: undefined,
  socialGoal: {
    current: 120,
    target: 500,
    platform: 'Instagram',
    isAchieved: false
  }
};

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [currentTab, setCurrentTab] = useState<TabView>('today');
  const [isLoaded, setIsLoaded] = useState(false);

  // LOAD STATE
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({ ...INITIAL_STATE, ...parsed });
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
    setIsLoaded(true);
  }, []);

  // SAVE STATE
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  // STREAK LOGIC
  useEffect(() => {
    if (!isLoaded) return;
    const today = getTodayDate();
    if (state.lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        setState(prev => ({
            ...prev,
            lastLoginDate: today,
            streak: (prev.lastLoginDate === yesterdayStr) ? prev.streak + 1 : 1
        }));
    }
  }, [isLoaded]);

  const handleToggleTask = (id: number) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;
      
      const isCompleting = !task.completed;
      if (isCompleting) playSuccessSound();

      // Gestion XP spécifique
      let xpFreelance = prev.xpFreelance;
      let xpReligion = prev.xpReligion;
      if (task.cat === 'prod' || task.cat === 'biz' || task.cat === 'sale' || task.cat === 'social') {
          xpFreelance += isCompleting ? task.xp : -task.xp;
      } else {
          xpReligion += isCompleting ? task.xp : -task.xp;
      }

      // Gestion Archivage Projet
      let newArchived = [...prev.archivedProjects];
      // (Logique simplifiée pour l'instant)

      return {
        ...prev,
        xp: Math.max(0, prev.xp + (isCompleting ? task.xp : -task.xp)),
        xpFreelance: Math.max(0, xpFreelance),
        xpReligion: Math.max(0, xpReligion),
        money: Math.max(0, prev.money + (isCompleting ? (task.value || 0) : -(task.value || 0))),
        tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: isCompleting, completedAt: isCompleting ? getTodayDate() : undefined } : t),
        archivedProjects: newArchived
      };
    });
  };

  const handleDeleteTask = (id: number) => {
      if(window.confirm("Supprimer cette tâche ?")) {
          setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
      }
  };

  const handleAddTasks = (newTasks: Task | Task[]) => {
    const tasksToAdd = Array.isArray(newTasks) ? newTasks : [newTasks];
    setState(prev => ({ ...prev, tasks: [...prev.tasks, ...tasksToAdd] }));
    setCurrentTab('today');
  };

  const handleSocialUpdate = (delta: number) => {
      setState(prev => ({
          ...prev,
          socialGoal: {
              ...prev.socialGoal,
              current: Math.max(0, prev.socialGoal.current + delta)
          }
      }));
  };

  const handleResetApp = () => {
      if(confirm("ATTENTION : CELA VA TOUT EFFACER. Êtes-vous sûr ?")) {
          localStorage.removeItem(STORAGE_KEY);
          setState(INITIAL_STATE);
          window.location.reload();
      }
  };

  if (!isLoaded) return null;

  const todayDate = getTodayDate();
  const todayTasks = state.tasks.filter(t => t.date === todayDate);
  const weekTasks = [...state.tasks].sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div className="phone-shell">
        {/* HEADER (Top Bar + Stats Grid) */}
        <Header 
            xp={state.xp} 
            money={state.money} 
            streak={state.streak} 
            socialGoal={state.socialGoal}
            onSocialUpdate={handleSocialUpdate}
        />

        {/* CONTAINER WITH EXTRA BOTTOM PADDING FOR NAV */}
        <div className="container pb-28">
            {/* MAIN NAVIGATION PILLS */}
            <Navigation currentTab={currentTab} onSwitch={setCurrentTab} />

            {/* VIEW: TODAY */}
            {currentTab === 'today' && (
                <div className="view active animate-fadeIn">
                    {todayTasks.length === 0 ? (
                        <div className="empty-state">
                            Planning du jour vide.<br/>Va dans <strong>Générateur</strong> pour créer une mission.
                        </div>
                    ) : (
                        <ul>
                            {todayTasks.map(task => (
                                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* VIEW: WEEK/PLANNING */}
            {currentTab === 'calendar' && (
                 <CalendarView 
                    tasks={state.tasks} 
                    onToggle={handleToggleTask} 
                    onDelete={handleDeleteTask} 
                    onReschedule={() => {}} 
                 />
            )}

            {/* VIEW: GENERATOR */}
            {currentTab === 'generator' && (
                <div className="view active animate-fadeIn">
                    <Generator onAccept={handleAddTasks} socialGoal={state.socialGoal} />
                </div>
            )}

            {/* VIEW: TASKS PLUS (IMPORT/MANUAL) */}
            {currentTab === 'tasks_plus' && (
                <div className="view active animate-fadeIn">
                    <TasksPlus onAdd={handleAddTasks} onImport={handleAddTasks} />
                </div>
            )}

            {/* VIEW: STATS */}
            {currentTab === 'stats' && (
                <div className="view active animate-fadeIn">
                    <StatsView tasks={state.tasks} />
                </div>
            )}

             {/* VIEW: PROFILE */}
             {currentTab === 'profile' && (
                <div className="view active animate-fadeIn">
                    <ProfileView state={state} onResetApp={handleResetApp} />
                </div>
            )}
        </div>

        {/* BOTTOM NAV (VISUAL FOOTER) */}
        <div className="bottom-nav">
            <button className={`bottom-nav-item ${currentTab === 'today' ? 'active' : ''}`} onClick={() => setCurrentTab('today')}>
                <CheckCircle size={18} />
                <span>Tâches</span>
            </button>
            <button className={`bottom-nav-item ${currentTab === 'stats' ? 'active' : ''}`} onClick={() => setCurrentTab('stats')}>
                <Trophy size={18} />
                <span>Stats</span>
            </button>
            <button className={`bottom-nav-item ${currentTab === 'profile' ? 'active' : ''}`} onClick={() => setCurrentTab('profile')}>
                <User size={18} />
                <span>Profil</span>
            </button>
        </div>

        <AutoBackup />
    </div>
  );
};

export default App;
