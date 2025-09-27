
import React, { useEffect, useState } from 'react';
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
import { saleService } from '../services/saleService';
import { productService } from '../services/productService';
import { repairService } from '../services/repairService';
import { expenseService } from '../services/expenseService';


const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState([
    { label: 'إجمالي المبيعات اليوم', value: '...', icon: DollarSign, color: 'bg-green-500', change: '', changeType: 'positive' },
    { label: 'عدد المنتجات', value: '...', icon: Package, color: 'bg-blue-500', change: '', changeType: 'positive' },
    { label: 'الإصلاحات المعلقة', value: '...', icon: Wrench, color: 'bg-yellow-500', change: '', changeType: 'negative' },
    { label: 'المصروفات الشهرية', value: '...', icon: Receipt, color: 'bg-red-500', change: '', changeType: 'positive' }
  ]);
  const [recentSales, setRecentSales] = useState([]);
  const [pendingRepairs, setPendingRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        // إجمالي مبيعات الشهر الحالي
        const salesStats = await saleService.getMonthlyStats(month, year);
        // آخر عمليات البيع (أحدث 4)
        const allSales = Array.isArray(salesStats.sales) ? salesStats.sales : [];
        setRecentSales(allSales.slice(0, 4));

        // عدد المنتجات
        const products = await productService.getProducts();

        // الإصلاحات المعلقة (pending أو fixed ولم تُسلّم)
        const allRepairs = await repairService.getRepairs();
        const pending = allRepairs.filter(r => r.status === 'pending' || (r.status === 'fixed' && !r.isDelivered));
        setPendingRepairs(pending.slice(0, 4));

        // مصروفات الشهر الحالي
        const expenseStats = await expenseService.getMonthlyStats(month, year);

        setStats([
          {
            label: 'إجمالي مبيعات الشهر',
            value: salesStats.totalRevenue ? `${Number(salesStats.totalRevenue).toLocaleString()} جنيه` : '0 جنيه',
            icon: DollarSign,
            color: 'bg-green-500',
            change: '',
            changeType: 'positive'
          },
          {
            label: 'عدد المنتجات',
            value: products.length,
            icon: Package,
            color: 'bg-blue-500',
            change: '',
            changeType: 'positive'
          },
          {
            label: 'الإصلاحات المعلقة',
            value: pending.length,
            icon: Wrench,
            color: 'bg-yellow-500',
            change: '',
            changeType: 'negative'
          },
          {
            label: 'المصروفات الشهرية',
            value: expenseStats.totalAmount ? `${Number(expenseStats.totalAmount).toLocaleString()} جنيه` : '0 جنيه',
            icon: Receipt,
            color: 'bg-red-500',
            change: '',
            changeType: 'positive'
          }
        ]);
      } catch (err) {
        // fallback values
        setStats([
          { label: 'إجمالي المبيعات الشهر', value: '0 جنيه', icon: DollarSign, color: 'bg-green-500', change: '', changeType: 'positive' },
          { label: 'عدد المنتجات', value: '0', icon: Package, color: 'bg-blue-500', change: '', changeType: 'positive' },
          { label: 'الإصلاحات المعلقة', value: '0', icon: Wrench, color: 'bg-yellow-500', change: '', changeType: 'negative' },
          { label: 'المصروفات الشهرية', value: '0 جنيه', icon: Receipt, color: 'bg-red-500', change: '', changeType: 'positive' }
        ]);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

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
                  {stat.change && (
                    <div className={`flex items-center gap-1 text-xs ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <ChangeIcon className="w-3 h-3" />
                      <span>{stat.change}</span>
                      <span className="text-gray-500">من الشهر الماضي</span>
                    </div>
                  )}
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
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => onNavigate && onNavigate('sales')}>عرض الكل</button>
          </div>
          <div className="space-y-3">
            {recentSales.map((sale) => {
              // محاولة استخراج اسم العميل وعدد الأصناف والمبلغ والتاريخ من بيانات sale
              let customer = sale.customer || sale.customerName || (sale.SaleItems && sale.SaleItems[0]?.Product?.name) || '---';
              let itemsCount = sale.items || (sale.SaleItems ? sale.SaleItems.reduce((acc, item) => acc + (item.quantity || 0), 0) : 0);
              let amount = sale.amount || sale.totalPrice || sale.totalAmount || sale.total || 0;
              let date = sale.saleDate || sale.createdAt || sale.date || '';
              // لا تستخدم charAt إلا إذا كان customer موجود ونصي
              return (
                <div key={sale._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{typeof customer === 'string' && customer.length > 0 ? customer.charAt(0) : '-'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer}</p>
                      <p className="text-sm text-gray-600">{itemsCount} أصناف • {date ? (date.split('T')[0]) : ''}</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">{Number(amount).toLocaleString()} جنيه</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pending Repairs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">الإصلاحات المعلقة</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => onNavigate && onNavigate('repairs')}>عرض الكل</button>
          </div>
          <div className="space-y-3">
            {pendingRepairs.length === 0 ? (
              <div className="text-center text-gray-500 py-6">لا توجد إصلاحات معلقة</div>
            ) : pendingRepairs.map((repair, i) => {
              // استخراج الحقول بشكل مرن
              const device = repair.deviceName || repair.device || '---';
              const customer = repair.customerName || repair.customer || '---';
              // حساب عدد الأيام منذ الاستلام
              let days = 0;
              if (repair.receivedAt) {
                const received = new Date(repair.receivedAt);
                const now = new Date();
                days = Math.max(1, Math.ceil((now - received) / (1000 * 60 * 60 * 24)));
              } else if (repair.days) {
                days = repair.days;
              } else {
                days = 1;
              }
              // تحديد الحالة
              let statusLabel = 'قيد الانتظار';
              let statusColor = 'bg-yellow-100 text-yellow-800';
              if (repair.status === 'fixed' && !repair.isDelivered) {
                statusLabel = 'تم الإصلاح';
                statusColor = 'bg-blue-100 text-blue-800';
              } else if (repair.status === 'pending') {
                statusLabel = 'قيد الانتظار';
                statusColor = 'bg-yellow-100 text-yellow-800';
              } else if (repair.status === 'notFixed') {
                statusLabel = 'لم يتم الإصلاح';
                statusColor = 'bg-red-100 text-red-800';
              }
              return (
                <div key={repair._id || i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{device}</p>
                      <p className="text-sm text-gray-600">{customer} • {days} أيام</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>{statusLabel}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right" onClick={() => onNavigate && onNavigate('products')}>
            <Package className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">المنتجات</p>
            <p className="text-sm text-gray-600">إدارة المنتجات والمخزون</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right" onClick={() => onNavigate && onNavigate('categories')}>
            <Filter className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">الفئات</p>
            <p className="text-sm text-gray-600">إدارة فئات المنتجات</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right" onClick={() => onNavigate && onNavigate('sales')}>
            <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">المبيعات</p>
            <p className="text-sm text-gray-600">تسجيل ومتابعة عمليات البيع</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right" onClick={() => onNavigate && onNavigate('repairs')}>
            <Wrench className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="font-medium text-gray-900">الإصلاحات</p>
            <p className="text-sm text-gray-600">تسجيل ومتابعة طلبات الإصلاح</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-right" onClick={() => onNavigate && onNavigate('expenses')}>
            <Receipt className="w-6 h-6 text-red-600 mb-2" />
            <p className="font-medium text-gray-900">المصروفات</p>
            <p className="text-sm text-gray-600">تسجيل ومتابعة المصروفات</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
