
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Task, TaskCategory } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onReschedule?: (id: number) => void;
  isCompact?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onReschedule, isCompact }) => {
  const catLabel = (cat: TaskCategory) => {
      switch(cat) {
          case 'prod': return 'CREA';
          case 'sale': return 'BIZ';
          case 'social': return 'SOCIAL';
          case 'admin': return 'ADM';
          default: return 'TASK';
      }
  };

  const catClass = (cat: TaskCategory) => {
      switch(cat) {
          case 'prod': return 'bg-prod';
          case 'sale': return 'bg-sale';
          case 'social': return 'bg-social';
          case 'admin': return 'bg-admin';
          default: return 'bg-prod';
      }
  };

  return (
    <li className={`task ${task.completed ? 'done' : ''} ${isCompact ? 'compact' : ''}`} onClick={() => onToggle(task.id)}>
      <div className="task-left">
        <div className="checkbox"></div>
        <div className="task-content">
            <div className="task-title truncate min-w-0" style={isCompact ? {fontSize: '0.8em'} : {}} title={task.title}>
                {task.title}
            </div>
            <div className="task-meta">
                <span className={`badge ${catClass(task.cat)}`}>{catLabel(task.cat)}</span>
                {!isCompact && <span>+{task.xp} XP</span>}
                {!isCompact && task.value && task.value > 0 && <span>+{task.value}€</span>}
            </div>
        </div>
      </div>
      <button 
        className="btn-del" 
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
};

export default TaskItem;
