import React, { useEffect, useState } from 'react';
import { Download, Save, Clock } from 'lucide-react';

export default function AutoBackup() {
  const [lastSave, setLastSave] = useState<Date>(new Date());
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Fonction pour télécharger la sauvegarde
  const downloadBackup = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Nom du fichier avec date et heure précise
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.getHours() + 'h' + date.getMinutes();
    
    link.href = url;
    link.download = `MANAGER-OS-AUTO-${dateStr}-${timeStr}.json`;
    link.click();
    setLastSave(new Date());
  };

  // Déclencheur automatique (Toutes les 30 minutes)
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      downloadBackup();
      console.log("Sauvegarde automatique effectuée !");
    }, 30 * 60 * 1000); // 30 minutes * 60 secondes * 1000 millisecondes

    return () => clearInterval(interval);
  }, [autoSaveEnabled]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 z-50">
      {/* Indicateur de dernière sauvegarde */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-700 text-xs text-slate-400 px-3 py-1 rounded-full flex items-center gap-2">
        <Clock size={12} />
        <span>Dernière copie : {lastSave.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>

      <div className="flex gap-2">
        {/* Bouton pour forcer la sauvegarde maintenant */}
        <button 
          onClick={downloadBackup}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg shadow-indigo-500/20 transition-all hover:scale-110"
          title="Forcer une sauvegarde sur le disque maintenant"
        >
          <Save size={20} />
        </button>
      </div>
    </div>
  );
}