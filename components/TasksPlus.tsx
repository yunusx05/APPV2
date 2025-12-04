import React from 'react';
import AddTask from './AddTask';
import { SheetImporter } from './SheetImporter';
import { Task } from '../types';

interface TasksPlusProps {
  onAdd: (task: Task) => void;
  onImport: (tasks: Task[]) => void;
}

const TasksPlus: React.FC<TasksPlusProps> = ({ onAdd, onImport }) => {
  return (
    <div className="space-y-6 animate-slideUp">
      
      <div className="card p-6 border-indigo-500/30">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            ✨ Création Rapide
        </h2>
        <AddTask onAdd={onAdd} />
      </div>

      <div className="card p-6 border-emerald-500/30">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            📗 Import en masse
        </h2>
        <SheetImporter onImport={onImport} />
      </div>
    </div>
  );
};

export default TasksPlus;