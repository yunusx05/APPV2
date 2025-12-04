import { TaskCategory } from '../types';

export interface WorkflowTask {
  day: number;
  title: string;
  cat: TaskCategory;
  xp: number;
  value: number;
}

export type ProjectType = 'packaging' | 'identity' | 'motion' | 'logo';

// ⚠️ DEPRECATED : Ces workflows statiques sont désormais remplacés par la génération dynamique de l'IA (smartWorkflow).
// Ils sont conservés ici uniquement pour éviter les erreurs de typage ou comme fallback éventuel.
export const PROJECT_WORKFLOWS: Record<ProjectType, WorkflowTask[]> = {
  packaging: [
    { day: 0, title: "Research & Moodboard", cat: "biz", xp: 20, value: 50 },
    { day: 1, title: "Modeling 3D Produit", cat: "biz", xp: 50, value: 150 },
    { day: 2, title: "Materials & Texturing PBR", cat: "biz", xp: 50, value: 150 },
    { day: 3, title: "Lighting Studio + Caustiques", cat: "biz", xp: 50, value: 150 },
    { day: 4, title: "Rendu Final 4K", cat: "biz", xp: 50, value: 150 },
    { day: 5, title: "Campagne Social Media", cat: "social", xp: 30, value: 100 },
    { day: 6, title: "Présentation Client", cat: "sale", xp: 30, value: 100 }
  ],
  
  identity: [
    { day: 0, title: "Brief & Moodboard", cat: "biz", xp: 20, value: 50 },
    { day: 1, title: "Sketches & Concepts Logo", cat: "biz", xp: 40, value: 120 },
    { day: 2, title: "Vectorisation Finale", cat: "biz", xp: 40, value: 120 },
    { day: 3, title: "Déclinaisons Visuelles", cat: "biz", xp: 40, value: 120 },
    { day: 4, title: "Brand Guidelines PDF", cat: "biz", xp: 40, value: 120 },
    { day: 5, title: "Teaser Instagram", cat: "social", xp: 30, value: 100 },
    { day: 6, title: "Pitch & Delivery", cat: "sale", xp: 30, value: 100 }
  ],
  
  motion: [
    { day: 0, title: "Concept & Storyboard", cat: "biz", xp: 20, value: 50 },
    { day: 1, title: "Animatique Timeline", cat: "biz", xp: 50, value: 150 },
    { day: 2, title: "Animation 3D Principale", cat: "biz", xp: 60, value: 200 },
    { day: 3, title: "VFX & Compositing", cat: "biz", xp: 60, value: 200 },
    { day: 4, title: "Sound Design & Musique", cat: "biz", xp: 40, value: 120 },
    { day: 5, title: "Publication Reel", cat: "social", xp: 30, value: 100 },
    { day: 6, title: "Delivery Client HD", cat: "sale", xp: 30, value: 100 }
  ],

  logo: [
    { day: 0, title: "Research & Moodboard", cat: "biz", xp: 15, value: 40 },
    { day: 1, title: "Croquis & Concepts Logo", cat: "biz", xp: 35, value: 100 },
    { day: 2, title: "Vectorisation Propre", cat: "biz", xp: 35, value: 100 },
    { day: 3, title: "Variations Couleurs", cat: "biz", xp: 30, value: 80 },
    { day: 4, title: "Présentation Client", cat: "sale", xp: 25, value: 80 }
  ]
};