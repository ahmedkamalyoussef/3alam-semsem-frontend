// src/components/Sidebar.jsx
import React from 'react';
import { 
  Home, 
  Package, 
  Filter, 
  ShoppingCart, 
  Wrench, 
  Receipt,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user } = useAuth();
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'categories', label: 'الفئات', icon: Filter },
    { id: 'sales', label: 'المبيعات', icon: ShoppingCart },
    { id: 'saleItems', label: 'أصناف المبيعات', icon: ShoppingBag },
    { id: 'repairs', label: 'الإصلاحات', icon: Wrench },
    { id: 'expenses', label: 'المصروفات', icon: Receipt },
  ];

  const handleMenuClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* خلفية للموبايل عند فتح القائمة */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* الـ Sidebar */}
      <div
        className={`w-64 bg-gray-900 text-white h-full flex flex-col lg:static lg:z-auto
        ${isMobileMenuOpen ? 'fixed right-0 top-0 z-50 translate-x-0' : 'fixed right-0 top-0 z-50 translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-center text-white">نظام إدارة المتجر</h1>
          <p className="text-sm text-gray-400 text-center mt-1">3alam Semsem</p>
        </div>

        <nav className="mt-8 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-right hover:bg-gray-800 transition-colors duration-200 ${
                  isActive ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'text-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 ml-auto ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user?.name?.charAt(0) || 'أ'}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'المدير'}</p>
              <p className="text-xs text-gray-400">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
