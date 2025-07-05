import React from 'react';
import { Card, CardContent } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import DashboardNav from './DashboardNav';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const GuestDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardNav activeSection={"guest-access"} onNavClick={() => {}} dashboardType="guest" />
      <div className="p-6 space-y-6">
        {/* Guest Profile Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Guest User
                  </h2>
                </div>
                <p className="text-gray-600 mb-2 md:mb-4 text-sm md:text-base">
                  guest@college.edu
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Role:</span> Guest
                  </div>
                  <div>
                    <span className="font-medium">Access Level:</span> Limited
                  </div>
                </div>
                <div className="mt-4 md:mt-6">
                  <Button 
                    onClick={() => navigate('/profile')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Access Info */}
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Guest Access</h2>
            <p className="text-gray-600">
              You have limited access to the system. Please contact an administrator 
              to upgrade your account permissions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestDashboard;
