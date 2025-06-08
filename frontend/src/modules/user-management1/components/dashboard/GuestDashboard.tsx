import React from 'react';
import { Card, CardContent } from '@/common/components/ui/card';
import DashboardNav from '../../../../components/dashboard/DashboardNav';

const GuestDashboard = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <DashboardNav activeSection={"guest-access"} onNavClick={() => {}} dashboardType="guest" />
    <div className="p-6">
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

export default GuestDashboard;
