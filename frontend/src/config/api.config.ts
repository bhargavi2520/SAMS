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
    return import.meta.env.VITE_API_URL || 'https://sams-5crs.onrender.com/'; // Fallback for safety
};

export const apiConfig = {
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json'
    }
};