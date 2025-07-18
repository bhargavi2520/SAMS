
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/user-management1/store/authStore';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default Index;
