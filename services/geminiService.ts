
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Task, Priority, ChatMessage, SocialGoal } from "../types";
import { ProjectType } from "../constants/workflows";

const apiKey = process.env.API_KEY;

// Fonction utilitaire pour initialiser le client si besoin ailleurs
const getClient = () => {
  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    console.error("ERREUR : Aucune clé API trouvée.");
    throw new Error("Clé API manquante");
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface WorkflowStep {
  day: number;
  title: string;
  category: 'biz' | 'prod' | 'sale' | 'social';
  xp: number;
  value: number; // Added value for money system
  description?: string;
}

export interface SmartWorkflow {
  estimatedDuration: number;
  rushDays: number[];
  rushReason: string;
  steps: WorkflowStep[];
  totalBounty: number; // Total estimated value
}

export interface AiBrief {
  brandName: string;
  productName: string;
  sector: string;
  artDirection: string;
  moodDescription: string;
  technicalChallenge: string;
  deliverables: string[];
  colorPalette: string[];
  projectType: ProjectType;
  smartWorkflow: SmartWorkflow;
}

export interface GrowthTacticResult {
    tasks: {
        title: string;
        cat: 'sale' | 'social';
        xp: number;
        value: number;
        description: string;
    }[];
    newGoal?: {
        target: number;
        platform: 'Instagram' | 'LinkedIn' | 'Behance';
        message: string;
    }
}

export interface BossBattleResult {
  title: string;
  description: string;
  tasks: {
    title: string;
    xp: number; // Should be high
    value: number;
  }[];
}

const callGemini = async (prompt: string): Promise<string | null> => {
  const modelsToTry = [
    'gemini-2.0-flash', 
    'gemini-1.5-flash'
  ];

  if (!apiKey || apiKey === "undefined") {
    console.error("Tentative d'appel API sans clé valide.");
    // Pas d'alerte ici, on laisse le composant UI gérer l'erreur en retournant null
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) continue;
      return text;

    } catch (error: any) {
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('400')) {
          console.error("❌ ERREUR API KEY : La clé fournie est invalide.");
          return null; // Stop trying other models if the key is wrong
      }
      console.log(`⚠️ Erreur avec ${modelName}, essai suivant...`, error.message || error);
    }
  }

  return null;
};

export const generateMissionBrief = async (
  sector: string,
  projectType: string,
  visualStyle: string
): Promise<AiBrief | null> => {
  const prompt = `Agis comme un Chef de Projet Senior en Agence Créative (spécialisé Fast Content / Réseaux Sociaux).
Génère un brief créatif complet ET un planning de production dynamique (Quête RPG) pour un Freelance 3D.

PARAMÈTRES :
- Secteur : ${sector === 'random' ? 'Au hasard (Mode, Boisson, Cosmétique, Tech, Food)' : sector}
- Type de Projet : ${projectType === 'random' ? 'Au hasard (Packaging, Logo, Identity, Motion 3D)' : projectType}
- Style Visuel : ${visualStyle === 'random' ? 'Au hasard (Minimal, Y2K, Acid, Luxury, etc)' : visualStyle}

MÉCANIQUE DE JEU (Gamification) :
- Assigne une "Prime" (Valeur en € fictif) à chaque étape.
- Le total de la mission doit faire environ 1500€ à 3000€.

CONTRAINTES DE TEMPS (RÉSEAUX SOCIAUX) :
- C'est du "Fast Content" : La durée totale doit être comprise entre 2 et 10 jours maximum.
- Tu dois identifier les jours de "Rush".

⛔ FILTRE ÉTHIQUE STRICT (HALAL/DEEN) :
- INTERDIT : Alcool, Jeux d'argent, Nudité, Porc, Signes religieux offensants.

Réponds UNIQUEMENT avec un objet JSON valide contenant cette structure exacte :
{
  "brandName": "Nom court et moderne",
  "productName": "Type de business précis",
  "sector": "Secteur exact",
  "artDirection": "3 mots-clés séparés par des virgules incluant le style visuel",
  "moodDescription": "Storytelling court (2 phrases max)",
  "technicalChallenge": "Un défi technique 3D (Ex: Liquide, Tissus, Verre)",
  "deliverables": ["Rendu 4K", "Animation Loop"],
  "colorPalette": ["#HEXCODE1", "#HEXCODE2"],
  "projectType": "${projectType === 'random' ? 'packaging' : projectType}",
  "smartWorkflow": {
      "estimatedDuration": 5,
      "totalBounty": 2500,
      "rushReason": "Ex: Le rendu de la simulation liquide va prendre toute la nuit du J3.",
      "rushDays": [3, 4],
      "steps": [
          { "day": 0, "title": "Recherche & Moodboard", "category": "biz", "xp": 20, "value": 200 },
          { "day": 1, "title": "Blocking & Modeling", "category": "biz", "xp": 50, "value": 500 },
          { "day": 2, "title": "Mise en place Textures", "category": "biz", "xp": 50, "value": 500 },
          { "day": 3, "title": "Rendu Final & Post-Prod", "category": "biz", "xp": 100, "value": 800 },
          { "day": 4, "title": "Publication Instagram", "category": "social", "xp": 30, "value": 0 }
      ]
  }
}`;

  const text = await callGemini(prompt);
  
  if (!text) {
    // Le composant UI affichera l'erreur
    return null;
  }

  try {
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const brief = JSON.parse(cleanedText) as AiBrief;
    return brief;
  } catch (error) {
    console.error("Erreur parsing brief:", error);
    return null;
  }
};

// --- NOUVEAU GÉNÉRATEUR TACTIQUE (NON CONVERSATIONNEL) ---

export const generateGrowthTactics = async (currentGoal: SocialGoal): Promise<GrowthTacticResult | null> => {
  const goalStatus = currentGoal.isAchieved ? "ATTEINT" : "EN COURS";
  
  const prompt = `
  Tu es un "Tactical Growth Engine" (IA non conversationnelle) pour un Freelance 3D High-End.
  
  CONTEXTE ACTUEL :
  - Objectif Social : ${currentGoal.current} / ${currentGoal.target} Abonnés sur ${currentGoal.platform}.
  - Statut : ${goalStatus}.
  
  TA MISSION :
  Génère un plan d'action immédiat pour aujourd'hui.
  
  SI L'OBJECTIF EST ATTEINT (${goalStatus} === ATTEINT) :
  - Propose un NOUVEL objectif plus ambitieux (Ex: Passer de 10 à 50 followers, ou changer de plateforme vers LinkedIn).
  - Génère 3 tâches pour célébrer ou lancer ce nouvel objectif.
  
  SI L'OBJECTIF EST EN COURS :
  - Génère 3 tâches concrètes (Mix Sales/Social) pour avancer vers l'objectif.
  - Ne propose PAS de nouvel objectif.
  
  FORMAT DE RÉPONSE ATTENDU (JSON STRICT UNIQUEMENT) :
  {
    "tasks": [
        { 
            "title": "Titre court actionnable", 
            "cat": "social" ou "sale", 
            "xp": 50, 
            "value": 0,
            "description": "Détail précis de quoi faire"
        }
    ],
    "newGoal": { // OPTIONNEL, SEULEMENT SI OBJECTIF ATTEINT
        "target": 50,
        "platform": "LinkedIn",
        "message": "Bravo ! Maintenant attaquons le marché pro."
    }
  }
  `;

  const text = await callGemini(prompt);
  if(!text) return null;

  try {
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanedText) as GrowthTacticResult;
    return result;
  } catch (error) {
    console.error("Erreur parsing tactics:", error);
    return null;
  }
};

// --- BOSS BATTLE ---

export const generateBossBattle = async (): Promise<BossBattleResult | null> => {
  const prompt = `
  URGENT : C'est la fin du mois. Génère une "BOSS BATTLE" pour un Freelance 3D.
  C'est un défi ultime pour passer un niveau de prestige.
  
  Le thème doit être épique (Ex: "Le Crash Serveur", "Le Client Fantôme", "La Deadline Impossible").
  
  Génère 3 Tâches TRES DIFFICILES mais réalisables en 24h.
  XP très élevé (200+). Valeur financière nulle (c'est pour la gloire/prestige).
  
  FORMAT JSON STRICT :
  {
    "title": "Nom du Boss",
    "description": "Description dramatique de la situation",
    "tasks": [
      { "title": "Tâche 1", "xp": 300, "value": 0 },
      { "title": "Tâche 2", "xp": 300, "value": 0 },
      { "title": "Tâche 3", "xp": 500, "value": 0 }
    ]
  }
  `;

  const text = await callGemini(prompt);
  if (!text) return null;

  try {
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText) as BossBattleResult;
  } catch (error) {
    console.error("Error parsing boss battle", error);
    return null;
  }
};

// Fonctions placeholder
export const generateSubtasks = async (taskDescription: string): Promise<string[]> => [];
export const analyzeTaskInput = async (input: string): Promise<{ priority: Priority; refinedDescription: string }> => ({ priority: "Medium", refinedDescription: input });
export const chatWithTasks = async (message: string, tasks: Task[]): Promise<string> => "Fonctionnalité en cours de développement.";
