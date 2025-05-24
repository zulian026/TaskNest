import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button'; // Asumsi Button mendukung className prop
import Input from '../ui/Input';   // Asumsi Input mendukung className prop
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
      
      // console.log('Requesting GitHub auth URL...');
      const response = await authAPI.getGitHubAuthUrl();
      // console.log('GitHub auth response:', response.data);
      
      if (response.data.success) {
        // console.log('Redirecting to:', response.data.url);
        window.location.href = response.data.url;
      } else {
        setErrors({ general: 'Gagal menghubungi GitHub. Coba lagi nanti.' });
      }
    } catch (error) {
      // console.error('GitHub login error:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Terjadi kesalahan saat login dengan GitHub.' 
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
    // Latar belakang gradien yang lebih menarik
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Kontainer form utama dengan shadow dan sudut tumpul */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          {/* Anda bisa menambahkan logo di sini jika ada */}
          {/* <img className="mx-auto h-12 w-auto" src="/path-to-your-logo.svg" alt="TaskNest Logo" /> */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Masuk ke TaskNest
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-medium">Oops! Terjadi kesalahan:</p>
              <p>{errors.general}</p>
            </div>
          )}

          {/* Tombol Login GitHub */}
          <div>
            <Button
              type="button"
              onClick={handleGitHubLogin}
              loading={githubLoading}
              // Styling tombol GitHub yang lebih modern
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50 space-x-2"
              disabled={loading || githubLoading}
            >
              <Github className="h-5 w-5" aria-hidden="true" />
              <span>Masuk dengan GitHub</span>
            </Button>
          </div>

          {/* Pembatas "Atau" yang lebih halus */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Atau lanjutkan dengan
              </span>
            </div>
          </div>

          {/* Form Email/Password */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5"> {/* Sedikit menambah spasi antar input */}
              <Input
                label="Alamat Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="anda@contoh.com"
                error={errors.email}
                disabled={githubLoading || loading}
                // Asumsi komponen Input Anda bisa menerima className untuk styling wrapper atau inputnya
                // Contoh: className="rounded-md"
              />
              
              <div className="relative">
                <Input
                  label="Kata Sandi"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  error={errors.password}
                  disabled={githubLoading || loading}
                  // Contoh: className="rounded-md"
                />
                <button
                  type="button"
                  // Penyesuaian posisi tombol mata agar lebih pas di dalam input (tergantung implementasi Input.jsx)
                  className="absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  disabled={githubLoading || loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Lupa kata sandi (opsional, bisa ditambahkan jika ada fiturnya) */}
            {/* <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Lupa kata sandi?
                </a>
              </div>
            </div> */}

            <div>
              <Button
                type="submit"
                loading={loading}
                // Tombol utama dengan warna primer
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={githubLoading || loading}
              >
                Masuk
              </Button>
            </div>
          </form>
          
          <div className="text-sm text-center">
            <span className="text-gray-600">Belum punya akun? </span>
            <Link 
              to="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;