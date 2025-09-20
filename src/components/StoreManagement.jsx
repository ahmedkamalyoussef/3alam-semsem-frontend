import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import Dashboard from '../pages/Dashboard';
import ProductsManager from '../pages/ProductsManager';
import SalesManager from '../pages/SalesManager';
import CategoriesManager from '../pages/CategoriesManager';
import ExpensesManager from '../pages/ExpensesManager';
import RepairsManager from '../pages/RepairsManager';
import SaleItemsManager from '../pages/SaleItemsManager';

const StoreManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
  return <Dashboard onNavigate={setActiveTab} />;
      case 'products':
        return <ProductsManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'sales':
        return <SalesManager />;
      case 'saleItems':
        return <SaleItemsManager />;
      case 'repairs':
        return <RepairsManager />;
      case 'expenses':
        return <ExpensesManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:h-screen">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            activeTab={activeTab}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <Header 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab={activeTab}
        />
        
        <main className="p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StoreManagement;
