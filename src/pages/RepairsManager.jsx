import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Wrench, Clock, CheckCircle, XCircle, User, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const RepairsManager = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Mock data - في التطبيق الحقيقي ستأتي من API
  const [repairs, setRepairs] = useState([
    { 
      id: 1, 
      deviceType: 'iPhone 12', 
      problem: 'شاشة مكسورة', 
      customerName: 'أحمد محمد',
      customerPhone: '01234567890',
      status: 'pending',
      estimatedCost: 800,
      receivedDate: '2024-01-15',
      estimatedDelivery: '2024-01-20',
      notes: 'يحتاج استبدال الشاشة بالكامل',
      createdAt: '2024-01-15T10:30:00Z'
    },
    { 
      id: 2, 
      deviceType: 'Samsung Galaxy S23', 
      problem: 'مشكلة في البطارية', 
      customerName: 'فاطمة علي',
      customerPhone: '01234567891',
      status: 'in_progress',
      estimatedCost: 300,
      receivedDate: '2024-01-14',
      estimatedDelivery: '2024-01-18',
      notes: 'البطارية لا تعمل بشكل صحيح',
      createdAt: '2024-01-14T14:20:00Z'
    },
    { 
      id: 3, 
      deviceType: 'Laptop HP', 
      problem: 'مشكلة في الكيبورد', 
      customerName: 'محمد حسن',
      customerPhone: '01234567892',
      status: 'completed',
      estimatedCost: 200,
      receivedDate: '2024-01-10',
      estimatedDelivery: '2024-01-15',
      actualCost: 180,
      notes: 'تم إصلاح الكيبورد بنجاح',
      createdAt: '2024-01-10T09:15:00Z'
    },
    { 
      id: 4, 
      deviceType: 'iPad Pro', 
      problem: 'مشكلة في الشحن', 
      customerName: 'سارة أحمد',
      customerPhone: '01234567893',
      status: 'cancelled',
      estimatedCost: 400,
      receivedDate: '2024-01-12',
      estimatedDelivery: '2024-01-17',
      notes: 'العميل ألغى الإصلاح',
      createdAt: '2024-01-12T11:45:00Z'
    }
  ]);

  const statusOptions = [
    { value: 'pending', label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'قيد الإصلاح', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'مكتمل', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' }
  ];

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = 
      repair.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.problem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || repair.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingRepairs = repairs.filter(r => r.status === 'pending').length;
  const inProgressRepairs = repairs.filter(r => r.status === 'in_progress').length;
  const completedRepairs = repairs.filter(r => r.status === 'completed').length;
  const totalRevenue = repairs.filter(r => r.status === 'completed' && r.actualCost).reduce((sum, r) => sum + r.actualCost, 0);

  const handleAddRepair = (repairData) => {
    const newRepair = {
      id: repairs.length + 1,
      ...repairData,
      estimatedCost: parseInt(repairData.estimatedCost) || 0,
      actualCost: repairData.actualCost ? parseInt(repairData.actualCost) : null,
      createdAt: new Date().toISOString()
    };
    setRepairs([newRepair, ...repairs]);
    setIsAddModalOpen(false);
  };

  const handleEditRepair = (repairData) => {
    const updatedRepairs = repairs.map(r => 
      r.id === editingRepair.id 
        ? { 
            ...r, 
            ...repairData, 
            estimatedCost: parseInt(repairData.estimatedCost) || 0,
            actualCost: repairData.actualCost ? parseInt(repairData.actualCost) : null
          }
        : r
    );
    setRepairs(updatedRepairs);
    setIsEditModalOpen(false);
    setEditingRepair(null);
  };

  const handleDeleteRepair = (repairId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإصلاح؟')) {
      setRepairs(repairs.filter(r => r.id !== repairId));
    }
  };

  const openEditModal = (repair) => {
    setEditingRepair(repair);
    setIsEditModalOpen(true);
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الإصلاحات</h2>
          <p className="text-gray-600 mt-1">تسجيل ومتابعة طلبات الإصلاح</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          إضافة إصلاح جديد
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">في الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRepairs}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">قيد الإصلاح</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressRepairs}</p>
            </div>
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مكتمل</p>
              <p className="text-2xl font-bold text-gray-900">{completedRepairs}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} جنيه</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
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
                placeholder="البحث عن إصلاح..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع الحالات</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Repairs List */}
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهاز</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشكلة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التكلفة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepairs.map((repair) => {
                const statusInfo = getStatusInfo(repair.status);
                return (
                  <tr key={repair.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{repair.deviceType}</div>
                        <div className="text-sm text-gray-500">تم الاستلام: {repair.receivedDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{repair.customerName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {repair.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{repair.problem}</div>
                      {repair.notes && (
                        <div className="text-xs text-gray-500 mt-1">{repair.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {repair.actualCost ? 
                          `${repair.actualCost.toLocaleString()} جنيه` : 
                          `~${repair.estimatedCost.toLocaleString()} جنيه`
                        }
                      </div>
                      {repair.actualCost && repair.actualCost !== repair.estimatedCost && (
                        <div className="text-xs text-gray-500">
                          متوقع: {repair.estimatedCost.toLocaleString()} جنيه
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        متوقع التسليم: {repair.estimatedDelivery}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(repair)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteRepair(repair.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredRepairs.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إصلاحات</h3>
            <p className="text-gray-500">ابدأ بتسجيل إصلاح جديد</p>
          </div>
        )}
      </Card>

      {/* Add Repair Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة إصلاح جديد"
        size="lg"
      >
        <RepairForm onSubmit={handleAddRepair} statusOptions={statusOptions} />
      </Modal>

      {/* Edit Repair Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRepair(null);
        }}
        title="تعديل الإصلاح"
        size="lg"
      >
        {editingRepair && (
          <RepairForm 
            onSubmit={handleEditRepair} 
            statusOptions={statusOptions} 
            initialData={editingRepair}
          />
        )}
      </Modal>
    </div>
  );
};

// Repair Form Component
const RepairForm = ({ onSubmit, statusOptions, initialData = {} }) => {
  const [formData, setFormData] = useState({
    deviceType: initialData.deviceType || '',
    problem: initialData.problem || '',
    customerName: initialData.customerName || '',
    customerPhone: initialData.customerPhone || '',
    status: initialData.status || 'pending',
    estimatedCost: initialData.estimatedCost || '',
    actualCost: initialData.actualCost || '',
    receivedDate: initialData.receivedDate || new Date().toISOString().split('T')[0],
    estimatedDelivery: initialData.estimatedDelivery || '',
    notes: initialData.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع الجهاز</label>
          <input
            type="text"
            value={formData.deviceType}
            onChange={(e) => handleChange('deviceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: iPhone 12"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المشكلة</label>
          <input
            type="text"
            value={formData.problem}
            onChange={(e) => handleChange('problem', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: شاشة مكسورة"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="اسم العميل"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="01234567890"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الاستلام</label>
          <input
            type="date"
            value={formData.receivedDate}
            onChange={(e) => handleChange('receivedDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسليم المتوقع</label>
          <input
            type="date"
            value={formData.estimatedDelivery}
            onChange={(e) => handleChange('estimatedDelivery', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة المتوقعة (جنيه)</label>
          <input
            type="number"
            value={formData.estimatedCost}
            onChange={(e) => handleChange('estimatedCost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة الفعلية (جنيه)</label>
          <input
            type="number"
            value={formData.actualCost}
            onChange={(e) => handleChange('actualCost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
          <select 
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أي ملاحظات إضافية..."
          rows="3"
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary">إلغاء</Button>
        <Button type="submit" variant="success">حفظ الإصلاح</Button>
      </div>
    </form>
  );
};

export default RepairsManager;
