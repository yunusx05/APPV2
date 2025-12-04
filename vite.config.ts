import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Charge toutes les variables d'environnement depuis .env
    const env = loadEnv(mode, path.resolve('.'), '');

    // Cherche la clé API dans plusieurs variantes possibles pour éviter les erreurs
    const apiKey = env.API_KEY || env.GEMINI_API_KEY || env.VITE_API_KEY || env.REACT_APP_API_KEY;

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Injecte la clé trouvée dans process.env.API_KEY pour le code client
        'process.env.API_KEY': JSON.stringify(apiKey),
      },
      resolve: {
        alias: {
          '@': path.resolve('.'),
        }
      }
    };
});