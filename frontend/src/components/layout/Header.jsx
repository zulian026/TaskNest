import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button"; // Asumsi Button mendukung className dan variant props
import ProfileEdit from "../profile/ProfileEdit";
import { User, Settings, LogOut, ChevronDown, Edit3 } from "lucide-react"; // Menambahkan ikon

const Header = () => {
  const { user, logout } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false); // Tutup dropdown setelah logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Menutup dropdown jika klik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40"> {/* Shadow lebih jelas, sticky header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Nama Aplikasi */}
            <div className="flex items-center">
              <a href="/dashboard" className="flex items-center space-x-2"> {/* Logo bisa diklik */}
                {/* Ganti dengan SVG logo jika ada */}
                {/* <img className="h-8 w-auto" src="/logo.svg" alt="TaskNest Logo" /> */}
                <span className="text-2xl font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"> {/* Warna brand */}
                  TaskNest
                </span>
              </a>
            </div>

            {/* Menu Pengguna di Kanan */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                {/* Tombol Pemicu Dropdown */}
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 hover:border-indigo-500 transition-colors">
                    {user.avatar ? (
                      <img
                        src={`/storage/${user.avatar}`} // Pastikan path ini benar
                        alt="Avatar Pengguna"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-gray-500" />
                    )}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Konten Dropdown */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileEdit(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      role="menuitem"
                    >
                      <Settings size={16} className="mr-3 text-gray-400" />
                      Edit Profil
                    </button>
                    {/* Tambahkan item menu lain di sini jika perlu */}
                    {/* <a
                      href="/pengaturan-akun"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      role="menuitem"
                    >
                      <Edit3 size={16} className="mr-3 text-gray-400" />
                      Pengaturan Akun
                    </a> */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-3" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Edit Profil */}
      {user && ( // Hanya render jika user ada, untuk menghindari error jika ProfileEdit butuh data user
        <ProfileEdit
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
          // userProfile={user} // Anda mungkin perlu passing data user ke ProfileEdit
        />
      )}
    </>
  );
};

export default Header;