import React from 'react';
import FacultyDashboard from './FacultyDashboard';
import DashboardNav from '../../../../components/dashboard/DashboardNav';

// You can customize this dashboard for HOD role in the future
const HODDashboard = () => {
  return (
    <>
      <DashboardNav activeSection={"dashboard"} onNavClick={() => {}} dashboardType="hod" />
      <FacultyDashboard />
    </>
  );
};

export default HODDashboard;
