import React, { useState, useEffect } from "react";
import { tasksAPI } from "../../services/api";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import toast from "react-hot-toast";

const TaskList = ({ filter }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  useEffect(() => {
    fetchTasks();
  }, [filters, filter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let response;

      if (filter) {
        response = await tasksAPI.filter(filter);
      } else {
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== "")
        );
        
        const requestParams = Object.keys(activeFilters).length === 0 ? 
          { sort_by: filters.sort_by, sort_order: filters.sort_order } : 
          { ...activeFilters, sort_by: filters.sort_by, sort_order: filters.sort_order };
        
        response = await tasksAPI.getAll(requestParams);
      }

      setTasks(response.data.data.data || response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil daftar tugas:", error);
      toast.error("Gagal mengambil daftar tugas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      try {
        await tasksAPI.delete(taskId);
        toast.success("Tugas berhasil dihapus");
        fetchTasks();
      } catch (error) {
        console.error("Gagal menghapus tugas:", error);
        toast.error("Gagal menghapus tugas");
      }
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await tasksAPI.updateStatus(task.id, newStatus);
      const statusText = newStatus === "completed" ? "selesai" : "tertunda";
      toast.success(`Tugas berhasil ditandai sebagai ${statusText}`);
      fetchTasks();
    } catch (error) {
      console.error("Gagal memperbarui status tugas:", error);
      toast.error("Gagal memperbarui status tugas");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTaskSuccess = () => {
    toast.success(
      editingTask ? "Tugas berhasil diperbarui" : "Tugas berhasil dibuat"
    );
    fetchTasks();
  };

  const statusOptions = [
    { value: "", label: "🔍 Semua Status" },
    { value: "pending", label: "⏳ Tertunda" },
    { value: "in_progress", label: "🔄 Sedang Dikerjakan" },
    { value: "completed", label: "✅ Selesai" },
  ];

  const priorityOptions = [
    { value: "", label: "🎯 Semua Prioritas" },
    { value: "low", label: "🟢 Rendah" },
    { value: "medium", label: "🟡 Sedang" },
    { value: "high", label: "🔴 Tinggi" },
  ];

  const sortOptions = [
    { value: "created_at", label: "📅 Tanggal Dibuat" },
    { value: "due_date", label: "⏰ Tanggal Jatuh Tempo" },
    { value: "priority", label: "⭐ Prioritas" },
    { value: "title", label: "🔤 Nama Tugas" },
  ];

  const getPageConfig = () => {
    const configs = {
      pending: {
        title: "Tugas Tertunda",
        icon: "⏳",
        gradient: "from-amber-500 to-orange-500",
        bgGradient: "from-amber-50 to-orange-50",
        description: "Tugas yang menunggu untuk dikerjakan"
      },
      overdue: {
        title: "Tugas Terlambat", 
        icon: "🚨",
        gradient: "from-red-500 to-rose-500",
        bgGradient: "from-red-50 to-rose-50",
        description: "Tugas yang sudah melewati batas waktu"
      },
      today: {
        title: "Jatuh Tempo Hari Ini",
        icon: "📅", 
        gradient: "from-blue-500 to-indigo-500",
        bgGradient: "from-blue-50 to-indigo-50",
        description: "Tugas yang harus diselesaikan hari ini"
      },
      this_week: {
        title: "Jatuh Tempo Minggu Ini",
        icon: "📊",
        gradient: "from-purple-500 to-violet-500", 
        bgGradient: "from-purple-50 to-violet-50",
        description: "Tugas untuk minggu ini"
      },
      high_priority: {
        title: "Tugas Prioritas Tinggi",
        icon: "🔥",
        gradient: "from-red-500 to-pink-500",
        bgGradient: "from-red-50 to-pink-50", 
        description: "Tugas dengan prioritas tinggi"
      },
      completed: {
        title: "Tugas Yang Selesai",
        icon: "✅",
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-50 to-emerald-50",
        description: "Tugas yang telah diselesaikan"
      }
    };
    
    return filter ? configs[filter] : {
      title: "Semua Tugas",
      icon: "📋", 
      gradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
      bgGradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
      description: "Kelola semua tugas Anda"
    };
  };

  const pageConfig = getPageConfig();
  const hasActiveFilters = Object.values(filters).some(value => value !== "" && value !== "created_at" && value !== "desc");

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    overdue: tasks.filter(task => task.is_overdue && task.status !== 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Header */}
      <div className={`bg-gradient-to-r ${pageConfig.gradient} mb-8`}>
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <span className="text-3xl">{pageConfig.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {pageConfig.title}
                </h1>
                <p className="text-white/80 text-lg">
                  {pageConfig.description}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="mr-2">➕</span>
              Tambah Tugas Baru
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-white/80 text-sm">Total Tugas</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-white/80 text-sm">Tertunda</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-white/80 text-sm">Selesai</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.overdue}</div>
              <div className="text-white/80 text-sm">Terlambat</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {/* Advanced Filters */}
        {!filter && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔍</span>
                  <h3 className="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => setFilters({
                      search: "",
                      status: "",
                      priority: "",
                      sort_by: "created_at",
                      sort_order: "desc",
                    })}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    🔄 Reset Filter
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>🔍</span> Cari Tugas
                  </label>
                  <Input
                    placeholder="Ketik nama tugas..."
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>📊</span> Status
                  </label>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    options={statusOptions}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>🎯</span> Prioritas
                  </label>
                  <Select
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    options={priorityOptions}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>🔄</span> Urutkan
                  </label>
                  <Select
                    name="sort_by"
                    value={filters.sort_by}
                    onChange={handleFilterChange}
                    options={sortOptions}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task List Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
              </div>
              <p className="text-gray-500 mt-4 text-lg">Memuat tugas...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <span className="text-6xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {hasActiveFilters ? "Tidak ada tugas yang cocok" : "Belum ada tugas"}
              </h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters 
                  ? "Coba ubah filter pencarian Anda"
                  : "Buat tugas pertama Anda untuk memulai!"
                }
              </p>
              {!hasActiveFilters && (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <span className="mr-2">➕</span>
                  Buat Tugas Pertama
                </Button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📋</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Tugas ({tasks.length})
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    name="sort_order"
                    value={filters.sort_order}
                    onChange={handleFilterChange}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-gray-50"
                  >
                    <option value="desc">🔽 Terbaru</option>
                    <option value="asc">🔼 Terlama</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleStatus={handleToggleStatus}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSuccess={handleTaskSuccess}
      />

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

export default TaskList;