import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';

interface AddTaskProps {
  onAdd: (task: Task) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<TaskCategory>('sale');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
      if (!title) return;
      onAdd({
          id: Date.now(),
          title,
          date,
          cat,
          completed: false,
          xp: 20,
          value: cat === 'sale' ? 50 : 0
      });
      setTitle('');
  };

  return (
    <div className="card">
        <h3 className="section-title" style={{marginTop: 0}}>Ajout manuel</h3>
        <input 
            type="text" 
            placeholder="Titre de la tâche" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
        />
        <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
        />
        <select value={cat} onChange={e => setCat(e.target.value as TaskCategory)}>
            <option value="sale">💰 Vente</option>
            <option value="social">📱 Social</option>
            <option value="admin">🧠 Admin</option>
            <option value="prod">🛠️ Prod Perso</option>
        </select>
        <button className="btn-main" onClick={handleSubmit}>Valider</button>
    </div>
  );
};

export default AddTask;