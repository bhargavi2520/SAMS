import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from 'path'

// https://vitejs.dev/config/
// 👇 Add your repo name here
export default defineConfig({
  base: '/SAMS/', // make sure this is your repo name
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
