import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { API_URL } from '../config/api';
function AdminProtectedRoute() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/group-discussions/admin`, {
          credentials: 'include',
        });

        setIsAdmin(response.ok);
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
