import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Eye, EyeOff, Github } from 'lucide-react';
import { authAPI } from '../../services/api';

const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check for error in URL params
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setErrors({ general: decodeURIComponent(error) });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.message });
    }
    
    setLoading(false);
  };

  const handleGitHubLogin = async () => {
    try {
      setGithubLoading(true);
      setErrors({});
      
      console.log('Requesting GitHub auth URL...');
      const response = await authAPI.getGitHubAuthUrl();
      
      console.log('GitHub auth response:', response.data);
      
      if (response.data.success) {
        console.log('Redirecting to:', response.data.url);
        // Redirect ke GitHub
        window.location.href = response.data.url;
      } else {
        setErrors({ general: 'Gagal menghubungi GitHub' });
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Terjadi kesalahan saat login dengan GitHub' 
      });
    } finally {
      setGithubLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke TaskNest
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* GitHub Login Button */}
          <div>
            <Button
              type="button"
              onClick={handleGitHubLogin}
              loading={githubLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <Github className="h-5 w-5" />
              <span>Masuk dengan GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Atau</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Alamat Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
                disabled={githubLoading}
              />
              
              <div className="relative">
                <Input
                  label="Kata Sandi"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={errors.password}
                  disabled={githubLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  disabled={githubLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                disabled={githubLoading}
              >
                Masuk
              </Button>
            </div>
          </form>
          
          <div className="text-center">
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-500"
            >
              Belum punya akun? Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;