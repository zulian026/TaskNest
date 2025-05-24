import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button'; // Asumsi Button mendukung className prop
import Input from '../ui/Input';   // Asumsi Input mendukung className prop
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(formData);
    
    if (result.success) {
      // Mungkin arahkan ke halaman login untuk verifikasi email atau langsung ke dashboard
      navigate('/dashboard'); 
    } else {
      setErrors({ 
        general: result.message, // Pesan error umum
        ...result.errors  // Error spesifik per field (misal: { name: ['Nama wajib diisi'], email: ['Email tidak valid'] })
      });
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Hapus error untuk field yang sedang diubah
    if (errors[e.target.name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [e.target.name]: null
      }));
    }
    if (errors.general) {
        setErrors(prevErrors => ({
            ...prevErrors,
            general: null
        }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    // Latar belakang gradien yang sama dengan LoginForm
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Kontainer form utama dengan shadow dan sudut tumpul */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          {/* <img className="mx-auto h-12 w-auto" src="/path-to-your-logo.svg" alt="TaskNest Logo" /> */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Buat akun TaskNest Anda
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-medium">Oops! Terjadi kesalahan:</p>
              <p>{errors.general}</p>
            </div>
          )}
          
          <div className="space-y-5"> {/* Menambah spasi antar input */}
            <Input
              label="Nama Lengkap"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nama Anda"
              error={errors.name?.[0]} // Menampilkan error pertama untuk field 'name'
              disabled={loading}
            />
            
            <Input
              label="Alamat Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="anda@contoh.com"
              error={errors.email?.[0]} // Menampilkan error pertama untuk field 'email'
              disabled={loading}
            />
            
            <div className="relative">
              <Input
                label="Kata Sandi"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimal 8 karakter"
                error={errors.password?.[0]} // Menampilkan error pertama untuk field 'password'
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="relative">
              <Input
                label="Konfirmasi Kata Sandi"
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Ulangi kata sandi Anda"
                error={errors.password_confirmation?.[0]} // Menampilkan error untuk konfirmasi password
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Menambahkan syarat dan ketentuan jika perlu */}
          {/* <div className="text-xs text-gray-500">
            Dengan mendaftar, Anda menyetujui <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">Syarat Layanan</a> dan <a href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">Kebijakan Privasi</a> kami.
          </div> */}

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              Buat Akun
            </Button>
          </div>
          
          <div className="text-sm text-center">
            <span className="text-gray-600">Sudah punya akun? </span>
            <Link 
              to="/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Masuk sekarang
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;