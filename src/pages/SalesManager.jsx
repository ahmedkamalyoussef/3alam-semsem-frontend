import React, { useState } from 'react';
import { Plus, Search, Eye, Trash2, ShoppingCart, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const SalesManager = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saleItems, setSaleItems] = useState([]);

  // Mock data
  const [sales, setSales] = useState([
    { 
      id: 1, 
      date: '2024-01-15', 
      total: 45000, 
      items: 3, 
      customer: 'أحمد محمد',
      itemsList: [
        { product: 'iPhone 14 Pro', quantity: 1, price: 25000 },
        { product: 'AirPods Pro', quantity: 2, price: 8000 }
      ]
    },
    { 
      id: 2, 
      date: '2024-01-15', 
      total: 28000, 
      items: 2, 
      customer: 'فاطمة علي',
      itemsList: [
        { product: 'Samsung Galaxy S23', quantity: 1, price: 22000 },
        { product: 'Samsung Galaxy Watch', quantity: 1, price: 6000 }
      ]
    },
    { 
      id: 3, 
      date: '2024-01-14', 
      total: 15000, 
      items: 1, 
      customer: 'محمد حسن',
      itemsList: [
        { product: 'Laptop Dell XPS 13', quantity: 1, price: 15000 }
      ]
    }
  ]);

  const products = [
    { id: 1, name: 'iPhone 14 Pro', price: 25000, stock: 15 },
    { id: 2, name: 'Samsung Galaxy S23', price: 22000, stock: 8 },
    { id: 3, name: 'Laptop Dell XPS 13', price: 35000, stock: 5 },
    { id: 4, name: 'AirPods Pro', price: 8000, stock: 20 },
    { id: 5, name: 'MacBook Air M2', price: 45000, stock: 3 },
    { id: 6, name: 'Samsung Galaxy Watch', price: 12000, stock: 12 }
  ];

  const filteredSales = sales.filter(sale => 
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toString().includes(searchTerm)
  );

  const addSaleItem = () => {
    setSaleItems([...saleItems, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeSaleItem = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateSaleItem = (index, field, value) => {
    const updated = saleItems.map((item, i) => {
      if (i === index) {
        const newItem = { ...item, [field]: value };
        if (field === 'productId') {
          const product = products.find(p => p.id === parseInt(value));
          if (product) {
            newItem.price = product.price;
          }
        }
        return newItem;
      }
      return item;
    });
    setSaleItems(updated);
  };

  const getTotalPrice = () => {
    return saleItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleAddSale = (saleData) => {
    const newSale = {
      id: sales.length + 1,
      date: new Date().toISOString().split('T')[0],
      total: getTotalPrice(),
      items: saleItems.length,
      customer: saleData.customer,
      itemsList: saleItems.map(item => {
        const product = products.find(p => p.id === parseInt(item.productId));
        return {
          product: product?.name || 'منتج محذوف',
          quantity: item.quantity,
          price: item.price * item.quantity
        };
      })
    };
    setSales([newSale, ...sales]);
    setSaleItems([]);
    setIsAddModalOpen(false);
  };

  const handleDeleteSale = (saleId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
      setSales(sales.filter(s => s.id !== saleId));
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
                        <span className="text-blue-600 font-semibold text-xs">{sale.customer.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-900">{sale.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.items} صنف
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {sale.total.toLocaleString()} جنيه
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
        onClose={() => {
          setIsAddModalOpen(false);
          setSaleItems([]);
        }}
        title="عملية بيع جديدة"
        size="lg"
      >
        <SaleForm 
          onSubmit={handleAddSale}
          saleItems={saleItems}
          setSaleItems={setSaleItems}
          products={products}
          addSaleItem={addSaleItem}
          removeSaleItem={removeSaleItem}
          updateSaleItem={updateSaleItem}
          getTotalPrice={getTotalPrice}
        />
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

// Sale Form Component
const SaleForm = ({ 
  onSubmit, 
  saleItems, 
  setSaleItems, 
  products, 
  addSaleItem, 
  removeSaleItem, 
  updateSaleItem, 
  getTotalPrice 
}) => {
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ customer: customerName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل (اختياري)</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أدخل اسم العميل"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الأصناف</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {saleItems.map((item, index) => (
            <div key={index} className="flex gap-2 p-3 border border-gray-200 rounded-lg">
              <select 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={item.productId}
                onChange={(e) => updateSaleItem(index, 'productId', e.target.value)}
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
                onChange={(e) => updateSaleItem(index, 'quantity', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min="1"
                required
              />
              <div className="w-24 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center justify-center">
                {(item.price * item.quantity).toLocaleString()}
              </div>
              <Button size="sm" variant="danger" type="button" onClick={() => removeSaleItem(index)}>×</Button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" className="mt-2" onClick={addSaleItem} type="button">
          <Plus className="w-4 h-4" />
          إضافة صنف
        </Button>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>الإجمالي:</span>
          <span>{getTotalPrice().toLocaleString()} جنيه</span>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary">إلغاء</Button>
        <Button type="submit" variant="success" disabled={saleItems.length === 0}>
          تأكيد البيع
        </Button>
      </div>
    </form>
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
          {sale.itemsList.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.product}</p>
                <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
              </div>
              <p className="font-medium">{item.price.toLocaleString()} جنيه</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي:</span>
          <span>{sale.total.toLocaleString()} جنيه</span>
        </div>
      </div>
    </div>
  );
};

export default SalesManager;
