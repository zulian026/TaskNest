import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        // Redirect ke login dengan error message
        navigate('/login?error=' + encodeURIComponent(error));
        return;
      }

      if (token && userParam) {
        try {
          // Decode user data
          const userData = JSON.parse(atob(userParam));
          
          // Set token dan user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          setToken(token);
          setUser(userData);
          
          // Redirect ke dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Error processing callback:', error);
          navigate('/login?error=' + encodeURIComponent('Login gagal, silakan coba lagi'));
        }
      } else {
        navigate('/login?error=' + encodeURIComponent('Data login tidak lengkap'));
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Sedang memproses login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;