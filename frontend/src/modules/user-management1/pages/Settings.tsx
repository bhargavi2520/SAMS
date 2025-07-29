import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/common/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/common/components/ui/avatar";
import { toast } from "sonner";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateProfilePhoto, deleteProfilePhoto } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePictureUrl || ""
  );
  useEffect(() => {
    setProfilePicture(user?.profilePictureUrl || "");
  }, [user?.profilePictureUrl]);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile photo is too large , Max size in 5MB");
      return;
    }
    try {
      await updateProfilePhoto(file);
      toast.success("Profile photo updated successfully");
    } catch (error) {
      toast.error("Failed to update profile photo");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`p-6 max-w-3xl mx-auto rounded shadow ${
        darkMode ? "bg-gray-900 text-white" : "bg-white"
      }`}
    >
      <Button
        onClick={() => navigate("/dashboard")}
        className={`border-blue-600 border-2 px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium mb-4 hover:bg-blue-600 hover:text-white hover:rounded-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-600"
        }`}
      >
        Back to Dashboard
      </Button>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile Photo</h2>
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              {profilePicture && profilePicture.trim() !== "" ? (
                <AvatarImage
                  src={`data:image/jpeg;base64,${user?.profilePictureUrl}`}
                  alt={user?.firstName}
                />
              ) : (
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <Button
                onClick={triggerFileInput}
                variant="outline"
                className="w-full"
              >
                Change Photo
              </Button>
              {user?.profilePictureUrl && (
                <Button
                  variant="outline"
                  className="w-full text-red-500 hover:text-red-600"
                  onClick={async () => {
                    try {
                      await deleteProfilePhoto();
                      toast.success("Profile photo removed successfully");
                    } catch (error) {
                      toast.error("Failed to remove profile photo");
                    }
                  }}
                >
                  Remove Photo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Dark Mode Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Appearance</h2>
          <div className="flex items-center">
            <span className="mr-3 font-medium">Dark Mode</span>
            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 focus:outline-none ${
                darkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-300 ${
                  darkMode
                    ? "translate-x-6 bg-yellow-400"
                    : "translate-x-0 bg-white"
                }`}
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.24 4.24l-.71-.71M6.34 19.66l-.71-.71"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                    />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
