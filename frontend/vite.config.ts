import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from 'path'

// https://vitejs.dev/config/
// 👇 Add your repo name here
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    base: '/SAMS/', // make sure this is your repo name
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'build',
    },
    // 🔧 ADDED: Define API URL for production builds
    define: {
      __API_URL__: JSON.stringify(
        isProduction 
          ? 'https://sams-5crs.onrender.com/' 
          : 'http://localhost:5000/'
      ),
    },
  }
})
