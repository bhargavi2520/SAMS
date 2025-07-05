import React from "react";
import { Button } from "@/common/components/ui/button";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <Button 
        onClick={() => navigate('/dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium mb-4"
      >
        ← Back to Dashboard
      </Button>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-gray-600">System settings coming soon...</p>
    </div>
  );
};

export default SettingsPage; 