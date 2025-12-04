
import React from 'react';
import { LayoutDashboard, Calendar, Sparkles, Plus } from 'lucide-react';
import { TabView } from '../types';

interface NavigationProps {
  currentTab: TabView;
  onSwitch: (tab: TabView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onSwitch }) => {
  return (
    <div className="nav scrollbar-hide">
      <button 
        className={currentTab === 'today' ? 'active' : ''} 
        onClick={() => onSwitch('today')}
      >
        <LayoutDashboard size={14} /> <span>Aujourd'hui</span>
      </button>

      <button 
        className={currentTab === 'calendar' ? 'active' : ''} 
        onClick={() => onSwitch('calendar')}
      >
        <Calendar size={14} /> <span>Planning</span>
      </button>

      <button 
        className={currentTab === 'generator' ? 'active' : ''} 
        onClick={() => onSwitch('generator')}
      >
        <Sparkles size={14} /> <span>Générateur</span>
      </button>

      <button 
        className={currentTab === 'tasks_plus' ? 'active' : ''} 
        onClick={() => onSwitch('tasks_plus')}
      >
        <Plus size={14} /> <span>Ajouter</span>
      </button>
    </div>
  );
};

export default Navigation;
