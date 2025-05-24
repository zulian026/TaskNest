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
    { value: 'low', label: '🟢 Rendah' },
    { value: 'medium', label: '🟡 Sedang' },
    { value: 'high', label: '🔴 Tinggi' },
  ];

  const statusOptions = [
    { value: 'pending', label: '⏳ Tertunda' },
    { value: 'in_progress', label: '🔄 Sedang Dikerjakan' },
    { value: 'completed', label: '✅ Selesai' },
  ];

  const categoryOptions = [
    { value: '', label: '🏷️ Pilih Kategori' },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
        {/* Header - matching TaskList gradient style */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <span className="text-2xl">{task ? '✏️' : '➕'}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {task ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                </h2>
                <p className="text-white/80">
                  {task ? 'Perbarui informasi tugas Anda' : 'Buat tugas baru untuk meningkatkan produktivitas'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>📝</span> Judul Tugas <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Masukkan judul tugas yang menarik..."
              className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.title[0]}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>📄</span> Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 resize-none"
              placeholder="Jelaskan detail tugas Anda..."
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.description[0]}
              </p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🎯</span> Prioritas
              </label>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={priorityOptions}
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.priority && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.priority[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>📊</span> Status
              </label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.status && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.status[0]}
                </p>
              )}
            </div>
          </div>

          {/* Category and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🏷️</span> Kategori
              </label>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                options={categoryOptions}
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.category_id && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.category_id[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>📅</span> Tanggal Jatuh Tempo
              </label>
              <Input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.due_date && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.due_date[0]}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
            >
              <span className="mr-2">❌</span>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {task ? 'Memperbarui...' : 'Membuat...'}
                </>
              ) : (
                <>
                  <span className="mr-2">{task ? '💾' : '✨'}</span>
                  {task ? 'Perbarui Tugas' : 'Buat Tugas'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskForm;