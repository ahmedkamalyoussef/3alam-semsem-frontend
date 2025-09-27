import React, { useState } from 'react';
import { Search, Eye, ShoppingBag, Package, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const SaleItemsManager = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSaleItem, setSelectedSaleItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Mock data - في التطبيق الحقيقي ستأتي من API
  const [saleItems, setSaleItems] = useState([
    {
      _id: 1,
      saleId: 1,
      productId: 1,
      productName: 'iPhone 14 Pro',
      quantity: 1,
      unitPrice: 25000,
      totalPrice: 25000,
      saleDate: '2024-01-15',
      customerName: 'أحمد محمد'
    },
    {
      _id: 2,
      saleId: 1,
      productId: 4,
      productName: 'AirPods Pro',
      quantity: 2,
      unitPrice: 8000,
      totalPrice: 16000,
      saleDate: '2024-01-15',
      customerName: 'أحمد محمد'
    },
    {
      _id: 3,
      saleId: 2,
      productId: 2,
      productName: 'Samsung Galaxy S23',
      quantity: 1,
      unitPrice: 22000,
      totalPrice: 22000,
      saleDate: '2024-01-15',
      customerName: 'فاطمة علي'
    },
    {
      _id: 4,
      saleId: 2,
      productId: 6,
      productName: 'Samsung Galaxy Watch',
      quantity: 1,
      unitPrice: 12000,
      totalPrice: 12000,
      saleDate: '2024-01-15',
      customerName: 'فاطمة علي'
    },
    {
      _id: 5,
      saleId: 3,
      productId: 3,
      productName: 'Laptop Dell XPS 13',
      quantity: 1,
      unitPrice: 35000,
      totalPrice: 35000,
      saleDate: '2024-01-14',
      customerName: 'محمد حسن'
    },
    {
      _id: 6,
      saleId: 4,
      productId: 5,
      productName: 'MacBook Air M2',
      quantity: 1,
      unitPrice: 45000,
      totalPrice: 45000,
      saleDate: '2024-01-14',
      customerName: 'سارة أحمد'
    }
  ]);

  const products = [
    { _id: 1, name: 'iPhone 14 Pro' },
    { _id: 2, name: 'Samsung Galaxy S23' },
    { _id: 3, name: 'Laptop Dell XPS 13' },
    { _id: 4, name: 'AirPods Pro' },
    { _id: 5, name: 'MacBook Air M2' },
    { _id: 6, name: 'Samsung Galaxy Watch' }
  ];

  const filteredSaleItems = saleItems.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.saleId.toString().includes(searchTerm);
    const matchesProduct = !selectedProduct || item.productId === parseInt(selectedProduct);
    return matchesSearch && matchesProduct;
  });

  const totalRevenue = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = saleItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueProducts = new Set(saleItems.map(item => item.productId)).size;
  const uniqueCustomers = new Set(saleItems.map(item => item.customerName)).size;

  const openViewModal = (saleItem) => {
    setSelectedSaleItem(saleItem);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">أصناف المبيعات</h2>
          <p className="text-gray-600 mt-1">تفاصيل أصناف المبيعات والأداء</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} جنيه</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الأصناف المباعة</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد المنتجات المباعة</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueProducts}</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueCustomers}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث عن صنف مبيع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع المنتجات</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>{product.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Sale Items Table */}
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم البيع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الوحدة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجمالي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSaleItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{item.saleId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500">ID: {item.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.unitPrice.toLocaleString()} جنيه
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {item.totalPrice.toLocaleString()} جنيه
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-xs">{item.customerName.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-900">{item.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.saleDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button size="sm" variant="outline" onClick={() => openViewModal(item)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSaleItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أصناف مبيعات</h3>
            <p className="text-gray-500">ابدأ بتسجيل عملية بيع جديدة</p>
          </div>
        )}
      </Card>

      {/* View Sale Item Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSaleItem(null);
        }}
        title={`تفاصيل الصنف #${selectedSaleItem?._id}`}
      >
        {selectedSaleItem && <SaleItemDetails item={selectedSaleItem} />}
      </Modal>
    </div>
  );
};

// Sale Item Details Component
const SaleItemDetails = ({ item }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">رقم البيع</p>
          <p className="font-medium">#{item.saleId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">معرف الصنف</p>
          <p className="font-medium">#{item._id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">المنتج</p>
          <p className="font-medium">{item.productName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">معرف المنتج</p>
          <p className="font-medium">#{item.productId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">الكمية</p>
          <p className="font-medium">{item.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">سعر الوحدة</p>
          <p className="font-medium">{item.unitPrice.toLocaleString()} جنيه</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">العميل</p>
          <p className="font-medium">{item.customerName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">التاريخ</p>
          <p className="font-medium">{item.saleDate}</p>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي:</span>
          <span className="text-green-600">{item.totalPrice.toLocaleString()} جنيه</span>
        </div>
      </div>
    </div>
  );
};

export default SaleItemsManager;
