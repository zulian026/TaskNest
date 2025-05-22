import React, { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

const TaskForm = ({ isOpen, onClose, task, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          category_id: task.category?.id || '',
          priority: task.priority || 'medium',
          status: task.status || 'pending',
          due_date: task.due_date || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category_id: '',
          priority: 'medium',
          status: 'pending',
          due_date: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, task]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Gagal mengambil data kategori');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (task) {
        await tasksAPI.update(task.id, formData);
        toast.success('Tugas berhasil diperbarui');
      } else {
        await tasksAPI.create(formData);
        toast.success('Tugas berhasil dibuat');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('Gagal menyimpan tugas');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Rendah', color: 'text-green-600' },
    { value: 'medium', label: 'Sedang', color: 'text-yellow-600' },
    { value: 'high', label: 'Tinggi', color: 'text-red-600' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Tertunda', color: 'text-gray-600' },
    { value: 'in_progress', label: 'Sedang Dikerjakan', color: 'text-blue-600' },
    { value: 'completed', label: 'Selesai', color: 'text-green-600' },
  ];

  const categoryOptions = [
    { value: '', label: 'Pilih Kategori' },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  ];

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'in_progress': return '🚀';
      case 'completed': return '✅';
      default: return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              {task ? '✏️ Edit Tugas' : '➕ Tambah Tugas Baru'}
            </h2>
            <p className="text-blue-100 text-sm">
              {task ? 'Perbarui informasi tugas Anda' : 'Buat tugas baru untuk meningkatkan produktivitas'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-transparent">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              📝 Judul Tugas <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400"
                placeholder="Masukkan judul tugas yang menarik..."
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                ⚠️ {errors.title[0]}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              📄 Deskripsi
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Jelaskan detail tugas Anda..."
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                ⚠️ {errors.description[0]}
              </p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                🎯 Prioritas
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {getPriorityIcon(option.value)} {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  ⚠️ {errors.priority[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                📊 Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {getStatusIcon(option.value)} {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  ⚠️ {errors.status[0]}
                </p>
              )}
            </div>
          </div>

          {/* Category and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                🏷️ Kategori
              </label>
              <div className="relative">
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  ⚠️ {errors.category_id[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                📅 Tanggal Jatuh Tempo
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
              </div>
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  ⚠️ {errors.due_date[0]}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white/50 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl hover:bg-gray-50/70 hover:border-gray-300/60 focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              ❌ Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {task ? 'Memperbarui...' : 'Membuat...'}
                </>
              ) : (
                <>
                  {task ? '💾 Perbarui Tugas' : '✨ Buat Tugas'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskForm;