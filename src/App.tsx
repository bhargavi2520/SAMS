
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";
import React, { useEffect } from 'react'; // Added React and useEffect

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const appBasePath = '/SAMS'; // Your GitHub Pages base path

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      delete sessionStorage.redirect; // Clear it so it doesn't run on every navigation

      const targetUrl = new URL(redirect);

      // Extract the path relative to your app's base
      // e.g., if redirect is https://user.github.io/SAMS/login?param=1
      // and appBasePath is /SAMS
      // then intendedPath will be /login
      let intendedPath = targetUrl.pathname;
      if (intendedPath.startsWith(appBasePath)) {
        intendedPath = intendedPath.substring(appBasePath.length);
      }

      // Ensure it starts with a slash if it's not empty, or default to root for the router
      if (!intendedPath) {
        intendedPath = '/';
      } else if (!intendedPath.startsWith('/')) {
        intendedPath = '/' + intendedPath;
      }
      
      const fullIntendedPath = intendedPath + targetUrl.search + targetUrl.hash;

      // Only navigate if the intended path is different from the current app path
      // location.pathname from useLocation is already relative to the BrowserRouter's basename.
      const currentAppRelativePath = location.pathname + location.search + location.hash;

      if (fullIntendedPath !== currentAppRelativePath) {
        navigate(fullIntendedPath, { replace: true });
      }
    }
  }, [navigate, location, appBasePath]); // Add dependencies

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* BrowserRouter is now in main.tsx with basename="/SAMS" */}
        <Routes>
          {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AuthPage />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AuthPage />
                )
              } 
            />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route 
                path="admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Admin Panel</h1>
                      <p className="text-gray-600">Advanced administration features coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Profile Management</h1>
                    <p className="text-gray-600">Profile editing features coming soon...</p>
                  </div>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-600">System settings coming soon...</p>
                  </div>
                } 
              />
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
