import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TaskItem from './TaskItem';

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onReschedule: (id: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onToggle, onDelete, onReschedule }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay(); // 0 (Sun) - 6 (Sat)
    return day === 0 ? 6 : day - 1; // Convert to Mon (0) - Sun (6)
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month); // 0 = Mon
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const cells = [];
  const totalCells = 42; // 6 rows * 7 cols

  // Cells
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - firstDayIndex;
    let cellDate = new Date(year, month, dayOffset + 1);
    const dateStr = cellDate.toISOString().split('T')[0];
    const isCurrentMonth = cellDate.getMonth() === month;
    const isSelected = dateStr === selectedDateStr;
    
    // Data for cell
    const dayTasks = tasks.filter(t => t.date === dateStr);
    const deadlines = tasks.filter(t => t.deadline === dateStr && t.projectId); // Simplified deadline check, ideally one per project

    cells.push({
      dateObj: cellDate,
      dateStr,
      dayNum: cellDate.getDate(),
      isCurrentMonth,
      isSelected,
      taskCount: dayTasks.length,
      deadlineCount: new Set(deadlines.map(d => d.projectId)).size
    });
  }

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectedTasks = tasks.filter(t => t.date === selectedDateStr);
  const selectedDateObj = new Date(selectedDateStr);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="animate-fadeIn">
      <div className="card mb-4 p-4">
        <div className="flex items-center justify-between mb-6">
           <button onClick={handlePrev} className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300">
             <ChevronLeft size={16} />
           </button>
           <h2 className="text-lg font-bold text-white uppercase tracking-wider">
             {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
           </h2>
           <button onClick={handleNext} className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300">
             <ChevronRight size={16} />
           </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => (
            <div 
              key={cell.dateStr}
              onClick={() => setSelectedDateStr(cell.dateStr)}
              className={`
                min-h-[70px] rounded-xl p-2 cursor-pointer border transition-all duration-200 relative
                ${cell.isCurrentMonth ? 'bg-slate-800/60' : 'bg-slate-900/30 opacity-50'}
                ${cell.isSelected 
                  ? 'border-sky-500/80 shadow-[0_0_15px_rgba(14,165,233,0.3)] bg-slate-800/90' 
                  : 'border-slate-700/30 hover:border-slate-500/50 hover:bg-slate-800'
                }
              `}
            >
              <div className={`text-xs font-bold mb-1 ${cell.isSelected ? 'text-sky-400' : 'text-slate-400'}`}>
                {cell.dayNum}
              </div>
              
              <div className="space-y-1">
                {cell.taskCount > 0 && (
                   <div className="text-[9px] font-semibold text-slate-300 bg-slate-700/50 rounded px-1 w-fit">
                     {cell.taskCount} tâche{cell.taskCount > 1 ? 's' : ''}
                   </div>
                )}
                {cell.deadlineCount > 0 && (
                   <div className="text-[9px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 rounded px-1 w-fit">
                     {cell.deadlineCount} DDL
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 animate-slideUp">
        <h3 className="text-lg font-bold text-white capitalize mb-1">{formattedSelectedDate}</h3>
        <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">
           {selectedTasks.length === 0 ? 'Aucune tâche prévue' : `${selectedTasks.length} tâche(s)`}
        </p>

        <div className="space-y-2">
           {selectedTasks.map(t => (
             <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onReschedule={onReschedule} isCompact />
           ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;