import React, { useState } from 'react';

// Types adaptés à ton projet
type TaskCategory = 'sale' | 'social' | 'admin' | 'prod' | 'biz';

interface Task {
  id: number;
  title: string;
  description?: string;
  date: string;
  cat: TaskCategory;
  xp: number;
  completed: boolean;
  value?: number;
  tags?: string[];
}

interface SheetImporterProps {
  onImport: (tasks: Task[]) => void;
}

export const SheetImporter: React.FC<SheetImporterProps> = ({ onImport }) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [category, setCategory] = useState<TaskCategory>('biz');
  const [isLoading, setIsLoading] = useState(false);

  // Catégories prédéfinies (tags courts correspondant à TaskCategory)
  const categories = [
    { value: 'biz' as TaskCategory, label: '💼 BIZ - Projets 3D / Freelance', color: 'blue' },
    { value: 'admin' as TaskCategory, label: '📚 AR - Révisions Arabe', color: 'green' },
    { value: 'prod' as TaskCategory, label: '☪️ SR - Sciences Religieuses', color: 'purple' },
    { value: 'social' as TaskCategory, label: '📱 SOCIAL - Social Media', color: 'pink' },
    { value: 'sale' as TaskCategory, label: '💰 SALE - Ventes / Prospection', color: 'yellow' }
  ];

  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const parseSheetData = (rows: string[][]): Task[] => {
    return rows
      .filter(row => row[0]) // Ignore les lignes vides
      .map((row, index) => {
        const [title, description, dateStr, priorityStr] = row;

        // Parse la date
        let dueDate: string = new Date().toISOString().split('T')[0];
        if (dateStr) {
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            dueDate = dateStr;
          } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('/');
            dueDate = `${year}-${month}-${day}`;
          }
        }

        // Parse la priorité pour calculer XP
        const priorityLower = (priorityStr || 'medium').toLowerCase();
        let xp = 30;
        let value = 50;
        if (priorityLower.includes('high') || priorityLower.includes('urgent')) {
          xp = 50;
          value = 100;
        } else if (priorityLower.includes('low') || priorityLower.includes('basse')) {
          xp = 15;
          value = 25;
        }

        return {
          id: Date.now() + index + Math.random(),
          title: title || 'Tâche sans titre',
          completed: false,
          cat: category, // Utilise directement la catégorie sélectionnée
          date: dueDate,
          xp,
          value
        };
      });
  };

  const handleImport = async () => {
    if (!sheetUrl.trim()) {
      alert('⚠️ Colle l\'URL de ton Google Sheet');
      return;
    }

    setIsLoading(true);

    try {
      const sheetId = extractSheetId(sheetUrl);
      if (!sheetId) {
        throw new Error('URL Google Sheets invalide');
      }

      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      
      console.log('📊 Récupération des données...');
      
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error('Impossible d\'accéder au Google Sheet. Assure-toi qu\'il est public (partagé en lecture).');
      }

      const csvText = await response.text();
      
      const rows = csvText
        .split('\n')
        .slice(1) // Ignore la première ligne (en-têtes)
        .map(line => {
          return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
        })
        .filter(row => row.length >= 2);

      if (rows.length === 0) {
        alert('⚠️ Aucune tâche trouvée dans le Google Sheet');
        return;
      }

      const tasks = parseSheetData(rows);
      onImport(tasks);

      alert(`✅ ${tasks.length} tâches importées avec le tag "${category.toUpperCase()}" !`);
      
      setSheetUrl('');

    } catch (error) {
      console.error('❌ Erreur import:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'import');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📊 Importer depuis Google Sheets
      </h3>

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4 text-sm text-blue-200">
        <p className="font-semibold mb-2">📝 Format attendu dans ton Google Sheet :</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li><strong>Colonne A :</strong> Titre de la tâche</li>
          <li><strong>Colonne B :</strong> Description</li>
          <li><strong>Colonne C :</strong> Date (2024-12-15 ou 15/12/2024)</li>
          <li><strong>Colonne D :</strong> Priorité (High, Medium, Low)</li>
        </ul>
        <p className="mt-2 text-yellow-300">
          ⚠️ Ton Google Sheet doit être <strong>public en lecture</strong>
        </p>
      </div>

      {/* Sélection de catégorie */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          🏷️ Catégorie / Tag
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                category === cat.value
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="text-left">
                <div className="text-sm font-medium text-white">{cat.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* URL du Sheet */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          🔗 Lien Google Sheets
        </label>
        <input
          type="text"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Bouton d'import */}
      <button
        onClick={handleImport}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isLoading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } text-white`}
      >
        {isLoading ? '⏳ Import en cours...' : '📥 Importer les tâches'}
      </button>

      {/* Aide rapide */}
      <div className="mt-4 text-xs text-gray-400">
        <p>💡 <strong>Comment rendre ton Sheet public :</strong></p>
        <ol className="ml-4 mt-1 space-y-1">
          <li>1. Ouvre ton Google Sheet</li>
          <li>2. Clique sur "Partager" (en haut à droite)</li>
          <li>3. Change en "Tous les utilisateurs disposant du lien peuvent consulter"</li>
          <li>4. Copie le lien et colle-le ci-dessus</li>
        </ol>
      </div>
    </div>
  );
};