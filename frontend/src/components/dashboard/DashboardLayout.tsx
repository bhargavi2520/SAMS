import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/auth.types";
import {
  LogOut,
  User,
  Settings,
  Bell,
  Moon,
  Search,
  Menu,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenAiAssistant = () => {
    // Placeholder: Implement logic to open AI assistant modal or navigate to AI page
    console.log("AI Assistant clicked");
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      HOD: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      FACULTY: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      CLASS_TEACHER:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      STUDENT:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      GUEST: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[role] || colors.GUEST;
  };

  const getDisplayName = () => {
    if (!user?.profile) return user?.email.split("@")[0] || "User";

    const profile = user.profile as any;
    if (profile.firstName) {
      return `${profile.firstName} ${profile.lastName || ""}`.trim();
    }
    return user.email.split("@")[0];
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfilePictureUrl = () => {
    if (!user?.profile) return undefined;
    const profile = user.profile as any;
    return profile.profilePictureUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Menu button (mobile), Logo, Title, Search */}
            <div className="flex items-center">
              {/* Hamburger Menu for mobile */}
              <div className="md:hidden mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log("Mobile menu clicked")}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  SAMS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Student Academic Management System
                </p>
              </div>
              {/* Search Bar - Moved to the left */}
              <div className="relative hidden md:block ml-6">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search site"
                />
              </div>
            </div>

            {/* Right side - User info and actions */}
            <div className="flex items-center space-x-4">
              {/* Role Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role || "GUEST")}`}
              >
                {user?.role?.replace("_", " ")}
              </span>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {/* Mark as decorative if it's just a visual cue for unread notifications */}
                <span
                  className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                  aria-hidden="true"
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log("Toggle dark mode")}
                aria-label="Toggle dark mode"
              >
                {" "}
                {/* Add dark mode toggle logic here */}
                <Moon className="h-5 w-5" />
              </Button>
              {/* AI Assistant Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenAiAssistant}
                aria-label="Open AI Assistant"
              >
                <Sparkles className="h-5 w-5 text-purple-500" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getProfilePictureUrl()}
                        alt={getDisplayName()}
                      />

                      <AvatarFallback className="bg-blue-600 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
