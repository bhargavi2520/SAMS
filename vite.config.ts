import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
// 👇 Add your repo name here
export default defineConfig({
  base: '/SAMS/', 
  plugins: [react()],
  build: {
    outDir: 'build',
  },
})
