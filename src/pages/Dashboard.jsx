import React from 'react';
import {
  DollarSign,
  Package,
  Wrench,
  Receipt,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Filter
} from 'lucide-react';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const stats = [
    { 
      label: 'إجمالي المبيعات اليوم', 
      value: '15,750 جنيه', 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+12%',
      changeType: 'positive'
    },
    { 
      label: 'عدد المنتجات', 
      value: '245', 
      icon: Package, 
      color: 'bg-blue-500',
      change: '+5%',
      changeType: 'positive'
    },
    { 
      label: 'الإصلاحات المعلقة', 
      value: '12', 
      icon: Wrench, 
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'negative'
    },
    { 
      label: 'المصروفات الشهرية', 
      value: '8,500 جنيه', 
      icon: Receipt, 
      color: 'bg-red-500',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  const recentSales = [
    { id: 1, customer: 'أحمد محمد', amount: 450, time: 'منذ ساعتين', items: 3 },
    { id: 2, customer: 'فاطمة علي', amount: 280, time: 'منذ 4 ساعات', items: 2 },
    { id: 3, customer: 'محمد حسن', amount: 150, time: 'منذ 6 ساعات', items: 1 },
    { id: 4, customer: 'سارة أحمد', amount: 320, time: 'منذ 8 ساعات', items: 2 }
  ];

  const pendingRepairs = [
    { device: 'iPhone 12', customer: 'أحمد محمد', days: 2, status: 'في الانتظار' },
    { device: 'Samsung Galaxy S23', customer: 'فاطمة علي', days: 1, status: 'قيد الإصلاح' },
    { device: 'Laptop HP', customer: 'محمد حسن', days: 3, status: 'في الانتظار' },
    { device: 'iPad Pro', customer: 'سارة أحمد', days: 1, status: 'قيد الإصلاح' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">لوحة التحكم</h2>
        <div className="text-sm text-gray-500">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.changeType === 'positive' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-xs ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ChangeIcon className="w-3 h-3" />
                    <span>{stat.change}</span>
                    <span className="text-gray-500">من الشهر الماضي</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">المبيعات الأخيرة</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{sale.customer.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{sale.customer}</p>
                    <p className="text-sm text-gray-600">{sale.items} أصناف • {sale.time}</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">{sale.amount.toLocaleString()} جنيه</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Repairs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">الإصلاحات المعلقة</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {pendingRepairs.map((repair, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{repair.device}</p>
                    <p className="text-sm text-gray-600">{repair.customer} • {repair.days} أيام</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  repair.status === 'في الانتظار' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {repair.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right">
            <Package className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">إضافة منتج</p>
            <p className="text-sm text-gray-600">إضافة منتج جديد للمخزن</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right">
            <Filter className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">إضافة فئة</p>
            <p className="text-sm text-gray-600">إنشاء فئة منتجات جديدة</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right">
            <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">عملية بيع</p>
            <p className="text-sm text-gray-600">تسجيل عملية بيع جديدة</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right">
            <Wrench className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="font-medium text-gray-900">إصلاح جديد</p>
            <p className="text-sm text-gray-600">تسجيل طلب إصلاح</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right">
            <Receipt className="w-6 h-6 text-red-600 mb-2" />
            <p className="font-medium text-gray-900">مصروف جديد</p>
            <p className="text-sm text-gray-600">تسجيل مصروف جديد</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
