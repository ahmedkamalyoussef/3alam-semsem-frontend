import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSales } from '../hooks/useSales';
import { productService } from '../services/productService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { Plus, ShoppingCart, User, Search, Eye, Trash2 } from 'lucide-react';

function AddSaleForm({ onSubmit }) {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(''); // Only for local form validation

  useEffect(() => {
    productService.getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const handleChange = (idx, field, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const addItem = () => setItems(items => [...items, { productId: '', quantity: 1 }]);
  const removeItem = (idx) => setItems(items => items.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const validItems = items.filter(item => item.productId && item.quantity > 0);
      if (validItems.length === 0) {
        setError('يجب اختيار منتج واحد على الأقل وكمية صحيحة');
        setSubmitting(false);
        return;
      }
      await onSubmit(validItems);
    } catch (err) {
      toast.error('فشل في إضافة عملية البيع');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الأصناف</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 p-3 border border-gray-200 rounded-lg">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={item.productId}
                onChange={e => handleChange(idx, 'productId', e.target.value)}
                required
              >
                <option value="">اختر المنتج</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="الكمية"
                value={item.quantity}
                onChange={e => handleChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min="1"
                required
              />
              <Button size="sm" variant="danger" type="button" onClick={() => removeItem(idx)}>×</Button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" className="mt-2" onClick={addItem} type="button">
          <Plus className="w-4 h-4" />
          إضافة صنف
        </Button>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>إلغاء</Button>
        <Button type="submit" variant="success" disabled={submitting}>تأكيد البيع</Button>
      </div>
    </form>
  );
}

const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const SalesManager = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const {
    sales,
    monthlyStats,
    loading,
    loadingStats,
    error,
    loadSales,
    loadMonthlyStats,
    addSale,
    deleteSale,
    setError,
  } = useSales();

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  useEffect(() => {
    loadMonthlyStats(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, loadMonthlyStats]);

  const displayedSales = (monthlyStats && Array.isArray(monthlyStats.sales)) ? monthlyStats.sales : sales;
  const filteredSales = displayedSales.filter(sale => sale.id.toString().includes(searchTerm));

  const handleDeleteSale = async (saleId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
      try {
        await deleteSale(saleId, selectedMonth, selectedYear);
        toast.success('تم حذف عملية البيع بنجاح');
      } catch (err) {
        toast.error('فشل في حذف عملية البيع');
      }
    }
  };

  const openViewModal = async (sale) => {
    setViewLoading(true);
    setIsViewModalOpen(true);
    try {
      const saleData = await (await import('../services/saleService')).default.getSaleById(sale.id);
      setSelectedSale(saleData);
    } catch (err) {
      setSelectedSale({ ...sale, error: 'فشل في تحميل تفاصيل العملية' });
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة المبيعات</h2>
          <p className="text-gray-600 mt-1">تسجيل ومتابعة عمليات البيع</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          عملية بيع جديدة
        </Button>
      </div>

      {/* Sales Monthly Statistics */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <label className="text-sm">الشهر:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m, idx) => (
              <option key={idx + 1} value={idx + 1}>{m}</option>
            ))}
          </select>
          <label className="text-sm ml-2">السنة:</label>
          <input
            type="number"
            className="border rounded px-2 py-1 text-sm w-20"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            min="2000"
            max={today.getFullYear() + 1}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي مبيعات الشهر</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingStats ? '...' : (monthlyStats && typeof monthlyStats.totalRevenue !== 'undefined' ? Number(monthlyStats.totalRevenue).toLocaleString() : '0')} جنيه
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">عدد العمليات في الشهر</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingStats ? '...' : (monthlyStats && typeof monthlyStats.salesCount !== 'undefined' ? monthlyStats.salesCount : 0)}
                </p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="البحث عن عملية بيع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Sales Table */}
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المنتج</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الأصناف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجمالي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.SaleItems && sale.SaleItems.length > 0
                      ? (sale.SaleItems[0].Product?.name || sale.SaleItems[0].product || '---')
                      : '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(sale.saleDate || sale.date || '').split('T')[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(sale.SaleItems?.reduce((acc, item) => acc + (item.quantity || 0), 0)) || sale.items || 0} صنف
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {(sale.totalPrice ?? sale.total ?? 0).toLocaleString()} جنيه
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openViewModal(sale)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteSale(sale.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عمليات بيع</h3>
            <p className="text-gray-500">ابدأ بتسجيل عملية بيع جديدة</p>
          </div>
        )}
      </Card>

      {/* Add Sale Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="عملية بيع جديدة"
      >
        <AddSaleForm onSubmit={async (items) => {
          try {
            await addSale(
              items.map(i => ({ productId: parseInt(i.productId), quantity: i.quantity })),
              selectedMonth,
              selectedYear
            );
            setIsAddModalOpen(false);
            toast.success('تمت إضافة عملية البيع بنجاح');
          } catch (err) {
            toast.error('فشل في إضافة عملية البيع');
          }
        }} />
      </Modal>

      {/* View Sale Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSale(null);
        }}
        title={`تفاصيل العملية #${selectedSale?.id || ''}`}
      >
        {viewLoading ? (
          <div className="text-center py-8">جاري تحميل التفاصيل...</div>
        ) : selectedSale ? (
          <SaleDetails sale={selectedSale} />
        ) : null}
      </Modal>
    </div>
  );
};

const SaleDetails = ({ sale }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">رقم العملية</p>
          <p className="font-medium">#{sale.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">التاريخ</p>
          <p className="font-medium">{(sale.saleDate || sale.date || '').split('T')[0]}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">عدد الأصناف</p>
          <p className="font-medium">{(sale.SaleItems?.reduce((acc, item) => acc + (item.quantity || 0), 0)) || sale.items || 0}</p>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">تفاصيل الأصناف</h4>
        <div className="space-y-2">
          {(sale.itemsList || sale.SaleItems || []).map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.product ? item.product : (item.Product?.name || '---')}</p>
                <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
              </div>
              <p className="font-medium">{(item.price ?? item.subTotal ?? 0).toLocaleString()} جنيه</p>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي:</span>
          <span>{(sale.totalPrice ?? sale.total ?? 0).toLocaleString()} جنيه</span>
        </div>
      </div>
    </div>
  );
};

export default SalesManager;
