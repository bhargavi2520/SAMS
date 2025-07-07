// frontend/src/config/api.config.ts

/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
// Remove custom ImportMeta and ImportMetaEnv interfaces to avoid conflicts with Vite's types

// Helper function to get the API base URL
const getApiBaseUrl = () => {
        return 'https://sams-5crs.onrender.com/';
};

export const apiConfig = {
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json'
    }
};