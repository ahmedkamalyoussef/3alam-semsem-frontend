import React, { useState, useEffect } from 'react';
import repairService from '../services/repairService';
import { Plus, Search, Edit, Trash2, Wrench, Clock, CheckCircle, XCircle, User, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const RepairsManager = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // لا يوجد حالات في الـ API

  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await repairService.getRepairs();
      setRepairs(data);
    } catch (error) {
      setError('فشل في تحميل الإصلاحات');
      console.error('Error loading repairs:', error);
    } finally {
      setLoading(false);
    }
  };

  // لا يوجد حالات في الـ API

  const filteredRepairs = repairs.filter(repair => {
    return (
      (repair.deviceName && repair.deviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (repair.customerName && repair.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (repair.problemDesc && repair.problemDesc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // إحصائيات بسيطة فقط
  const totalRepairs = repairs.length;
  const totalRevenue = repairs.reduce((sum, r) => sum + (r.cost || 0), 0);

  const handleAddRepair = async (repairData) => {
    try {
      await repairService.createRepair(
        repairData.customerName,
        repairData.deviceName,
        repairData.problemDesc,
        parseFloat(repairData.cost)
      );
      await loadRepairs();
      setIsAddModalOpen(false);
    } catch (error) {
      setError('فشل في إضافة الإصلاح');
      console.error('Error adding repair:', error);
    }
  };

  const handleEditRepair = async (repairData) => {
    try {
      await repairService.updateRepair(editingRepair.id, {
        customerName: repairData.customerName,
        deviceName: repairData.deviceName,
        problemDesc: repairData.problemDesc,
        cost: parseFloat(repairData.cost)
      });
      await loadRepairs();
      setIsEditModalOpen(false);
      setEditingRepair(null);
    } catch (error) {
      setError('فشل في تحديث الإصلاح');
      console.error('Error updating repair:', error);
    }
  };

  const handleDeleteRepair = async (repairId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإصلاح؟')) {
      try {
        await repairService.deleteRepair(repairId);
        await loadRepairs();
      } catch (error) {
        setError('فشل في حذف الإصلاح');
        console.error('Error deleting repair:', error);
      }
    }
  };

  const openEditModal = (repair) => {
    setEditingRepair(repair);
    setIsEditModalOpen(true);
  };

  // لا يوجد حالات

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد الإصلاحات</p>
              <p className="text-2xl font-bold text-gray-900">{totalRepairs}</p>
            </div>
            <Wrench className="w-8 h-8 text-blue-600" />
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

      {/* Search */}
      <Card>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepairs.map((repair) => (
                <tr key={repair.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{repair.deviceName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{repair.customerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{repair.problemDesc}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{repair.cost?.toLocaleString()} جنيه</div>
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
              ))}
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
  <RepairForm onSubmit={handleAddRepair} />
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
            initialData={editingRepair}
          />
        )}
      </Modal>
    </div>
  );
};

// Repair Form Component
const RepairForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    customerName: initialData.customerName || '',
    deviceName: initialData.deviceName || '',
    problemDesc: initialData.problemDesc || '',
    cost: initialData.cost || '',
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
          <label className="block text-sm font-medium text-gray-700 mb-1">الجهاز</label>
          <input
            type="text"
            value={formData.deviceName}
            onChange={(e) => handleChange('deviceName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="نوع الجهاز"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">المشكلة</label>
        <input
          type="text"
          value={formData.problemDesc}
          onChange={(e) => handleChange('problemDesc', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="وصف المشكلة"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة (جنيه)</label>
        <input
          type="number"
          value={formData.cost}
          onChange={(e) => handleChange('cost', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
          min="0"
          required
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
