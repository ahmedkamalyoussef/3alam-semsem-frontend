import React from 'react';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ setIsMobileMenuOpen, activeTab }) => {
  const { user, logout } = useAuth();
  const getPageTitle = (tab) => {
    const titles = {
      dashboard: 'لوحة التحكم',
      products: 'إدارة المنتجات',
      categories: 'إدارة الفئات',
      sales: 'إدارة المبيعات',
      saleItems: 'أصناف المبيعات',
      repairs: 'إدارة الإصلاحات',
      expenses: 'إدارة المصروفات'
    };
    return titles[tab] || 'لوحة التحكم';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{getPageTitle(activeTab)}</h2>
            <p className="text-sm text-gray-500">مرحباً بك في نظام الإدارة</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user?.name?.charAt(0) || 'أ'}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'المدير'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'مدير النظام'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
