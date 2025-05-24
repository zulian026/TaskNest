import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
  });
  const [errors, setErrors] = useState({});

  // Template kategori dalam bahasa Indonesia
  const categoryTemplates = [
    { name: 'Pekerjaan', color: '#3B82F6', icon: '💼' },
    { name: 'Pribadi', color: '#10B981', icon: '🏠' },
    { name: 'Keluarga', color: '#F59E0B', icon: '👨‍👩‍👧‍👦' },
    { name: 'Kesehatan', color: '#EF4444', icon: '❤️' },
    { name: 'Pendidikan', color: '#8B5CF6', icon: '📚' },
    { name: 'Keuangan', color: '#06B6D4', icon: '💰' },
    { name: 'Hobi', color: '#84CC16', icon: '🎨' },
    { name: 'Olahraga', color: '#F97316', icon: '⚽' },
    { name: 'Belanja', color: '#EC4899', icon: '🛍️' },
    { name: 'Perjalanan', color: '#14B8A6', icon: '✈️' },
    { name: 'Sosial', color: '#A855F7', icon: '👥' },
    { name: 'Rumah Tangga', color: '#F59E0B', icon: '🏡' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Gagal mengambil daftar kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await categoriesAPI.create(formData);
        toast.success('Kategori berhasil dibuat');
      }
      fetchCategories();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving category:', error);
      setErrors(error.response?.data?.errors || {});
      toast.error('Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Apakah Anda yakin? Ini akan menghapus kategori dari semua tugas.')) {
      try {
        await categoriesAPI.delete(categoryId);
        toast.success('Kategori berhasil dihapus');
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
        toast.error('Gagal menghapus kategori');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#3B82F6' });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      color: template.color
    }));
  };

  const colorPresets = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#14B8A6', '#A855F7', '#F472B6'
  ];

  // Statistics
  const stats = {
    total: categories.length,
    totalTasks: categories.reduce((sum, cat) => sum + (cat.tasks_count || 0), 0),
    mostUsed: categories.length > 0 ? categories.reduce((prev, current) => 
      (prev.tasks_count > current.tasks_count) ? prev : current
    ) : null
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 mb-8">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <span className="text-3xl">🏷️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Kelola Kategori
                </h1>
                <p className="text-white/80 text-lg">
                  Atur dan organisasi kategori tugas Anda
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="mr-2">➕</span>
              Tambah Kategori
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-white/80 text-sm">Total Kategori</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
              <div className="text-white/80 text-sm">Total Tugas</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {stats.mostUsed?.name || '-'}
              </div>
              <div className="text-white/80 text-sm">Kategori Terpopuler</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Categories Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
              </div>
              <p className="text-gray-500 mt-4 text-lg">Memuat kategori...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <span className="text-6xl">🏷️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum ada kategori
              </h3>
              <p className="text-gray-500 mb-6">
                Buat kategori pertama untuk mengorganisir tugas Anda!
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <span className="mr-2">➕</span>
                Buat Kategori Pertama
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📋</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Kategori ({categories.length})
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="group bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 p-6 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-5 h-5 rounded-full shadow-sm ring-2 ring-white"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="inline-flex items-center gap-1">
                              <span>📊</span>
                              {category.tasks_count || 0} tugas
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                          title="Edit kategori"
                        >
                          <span>✏️</span>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Hapus kategori"
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Category preview */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Warna: {category.color}</span>
                        <div 
                          className="px-2 py-1 rounded-full text-white text-xs font-medium"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title=""
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-2xl">{editingCategory ? '✏️' : '➕'}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {editingCategory ? 'Edit Kategori' : 'Buat Kategori Baru'}
                  </h2>
                  <p className="text-white/80">
                    {editingCategory ? 'Perbarui informasi kategori' : 'Tambahkan kategori untuk mengorganisir tugas'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCloseForm}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Template Selection - Only show when creating new category */}
            {!editingCategory && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>🎨</span> Pilih Template Kategori
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-4 border border-gray-100">
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {categoryTemplates.map((template, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleTemplateSelect(template)}
                        className="flex items-center space-x-3 p-3 text-left hover:bg-white rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200 hover:shadow-sm group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">
                          {template.icon}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                            style={{ backgroundColor: template.color }}
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                            {template.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-center border-t border-gray-200 pt-3">
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                      💡 atau buat kategori custom di bawah
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>📝</span> Nama Kategori <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama kategori..."
                required
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.name[0]}
                </p>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🎨</span> Warna Kategori
              </label>
              <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="h-12 w-20 border-2 border-gray-200 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Warna yang dipilih
                    </div>
                    <div 
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.name || 'Preview Kategori'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    🎯 Pilih dari preset warna:
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-110 hover:shadow-md ${
                          formData.color === color 
                            ? 'border-gray-400 ring-2 ring-purple-500/50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Pilih warna ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {errors.color && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.color[0]}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                onClick={handleCloseForm}
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
              >
                <span className="mr-2">❌</span>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {editingCategory ? 'Memperbarui...' : 'Membuat...'}
                  </>
                ) : (
                  <>
                    <span className="mr-2">{editingCategory ? '💾' : '✨'}</span>
                    {editingCategory ? 'Perbarui Kategori' : 'Buat Kategori'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CategoryManager;