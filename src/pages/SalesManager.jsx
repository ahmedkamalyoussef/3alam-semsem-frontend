import React, { useState, useEffect } from 'react';
// نموذج إضافة بيع بسيط (بدون أصناف)
import { useEffect as useEffectAddSale, useState as useStateAddSale } from 'react';
import { productService } from '../services/productService';
function AddSaleForm({ onSubmit }) {
  const [products, setProducts] = useStateAddSale([]);
  const [items, setItems] = useStateAddSale([{ productId: '', quantity: 1 }]);
  const [submitting, setSubmitting] = useStateAddSale(false);
  const [error, setError] = useStateAddSale('');

  useEffectAddSale(() => {
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
      setError('فشل في إضافة عملية البيع');
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
import { Plus, Search, Eye, Trash2, ShoppingCart, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { saleService } from '../services/saleService';

const SalesManager = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await saleService.getSales();
      setSales(data);
    } catch (err) {
      setError('فشل في تحميل بيانات المبيعات');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => {
    const customer = sale.customerName || '';
    return customer.toLowerCase().includes(searchTerm.toLowerCase()) || sale.id.toString().includes(searchTerm);
  });

  const handleDeleteSale = async (saleId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
      try {
        await saleService.deleteSale(saleId);
        await loadSales();
      } catch (err) {
        setError('فشل في حذف عملية البيع');
      }
    }
  };

  const openViewModal = (sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
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

      {/* Sales Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المبيعات اليوم</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.filter(s => s.date === new Date().toISOString().split('T')[0])
                  .reduce((sum, s) => sum + s.total, 0).toLocaleString()} جنيه
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد العمليات اليوم</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.filter(s => s.date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط قيمة العملية</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.length > 0 ? Math.round(sales.reduce((sum, s) => sum + s.total, 0) / sales.length).toLocaleString() : 0} جنيه
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم البيع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الأصناف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجمالي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs">{(sale.customer || sale.customerName || '').charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-900">{sale.customer || sale.customerName || '---'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.items} صنف
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {(sale.total ?? sale.totalPrice ?? 0).toLocaleString()} جنيه
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
            await saleService.createSale(items.map(i => ({ productId: parseInt(i.productId), quantity: i.quantity })));
            setIsAddModalOpen(false);
            await loadSales();
          } catch (err) {
            setError('فشل في إضافة عملية البيع');
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
        title={`تفاصيل العملية #${selectedSale?.id}`}
      >
        {selectedSale && <SaleDetails sale={selectedSale} />}
      </Modal>
    </div>
  );
};



// Sale Details Component
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
          <p className="font-medium">{sale.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">العميل</p>
          <p className="font-medium">{sale.customer}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">عدد الأصناف</p>
          <p className="font-medium">{sale.items}</p>
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
          <span>{(sale.total ?? sale.totalPrice ?? 0).toLocaleString()} جنيه</span>
        </div>
      </div>
    </div>
  );
};

export default SalesManager;
