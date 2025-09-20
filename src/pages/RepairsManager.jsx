  // تحديث كل البيانات بعد أي أكشن
  const refreshAll = async () => {
    await loadRepairs();
    if (!showAll) {
      await loadMonthlyStats(selectedMonth, selectedYear);
    }
  };
// ...existing code...
import React, { useState, useEffect } from 'react';
import repairService from '../services/repairService';
import { Plus, Search, Edit, Trash2, Wrench, Clock, CheckCircle, XCircle, User, Phone, Check, X, Truck } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
const RepairsManager = () => {
  const [expandedRepairId, setExpandedRepairId] = useState(null);
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


  // Monthly stats
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState({ totalCount: 0, totalCost: 0, repairs: [] });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!showAll) {
      loadMonthlyStats(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, showAll]);

  const loadMonthlyStats = async (month, year) => {
    try {
      const stats = await repairService.getMonthlyStats(month, year);
      setMonthlyStats({
        totalCount: stats.totalCount ?? 0,
        totalCost: stats.totalCost ?? 0,
        repairs: stats.repairs || []
      });
      
    } catch {
      setMonthlyStats({ totalCount: 0, totalCost: 0, repairs: [] });
    }
  };

  const handleAddRepair = async (repairData) => {
    try {
      await repairService.createRepair(
        repairData.customerName,
        repairData.deviceName,
        repairData.problemDesc,
        parseFloat(repairData.cost)
      );
      await refreshAll();
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
      await refreshAll();
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
        await refreshAll();
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


  // Actions for repair status
  const handleMarkFixed = async (repairId) => {
    try {
      await repairService.markFixed(repairId);
      await refreshAll();
    } catch (error) {
      setError('فشل في وضع علامة تم الإصلاح');
    }
  };

  const handleMarkNotFixed = async (repairId) => {
    try {
      await repairService.markNotFixed(repairId);
      await refreshAll();
    } catch (error) {
      setError('فشل في وضع علامة لم يتم الإصلاح');
    }
  };

  const handleDeliver = async (repairId) => {
    try {
      await repairService.deliver(repairId, new Date());
      await refreshAll();
    } catch (error) {
      setError('فشل في تسليم الإصلاح');
    }
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

      {/* Monthly Statistics */}
      <div className="mb-4 flex gap-2 items-center">
        <label>الشهر:</label>
        <select value={selectedMonth} onChange={e => { setSelectedMonth(Number(e.target.value)); setShowAll(false); }}>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
        <label>السنة:</label>
        <select value={selectedYear} onChange={e => { setSelectedYear(Number(e.target.value)); setShowAll(false); }}>
          {[...Array(5)].map((_, i) => {
            const year = new Date().getFullYear() - 2 + i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
        <Button size="sm" variant={showAll ? "success" : "outline"} onClick={() => setShowAll(v => !v)}>
          الكل
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد الإصلاحات (الشهر)</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalCount}</p>
            </div>
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الإيرادات (الشهر)</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalCost.toLocaleString()} جنيه</p>
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

      {/* قائمة الإصلاحات */}
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاستلام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهاز</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشكلة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التكلفة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(showAll ? repairs : (monthlyStats.repairs || [])).length > 0 ? (showAll ? repairs : monthlyStats.repairs).map((repair) => {
                let statusLabel = 'قيد الانتظار';
                let statusColor = 'bg-gray-200 text-gray-800';
                if (repair.status === 'fixed' && !repair.isDelivered) {
                  statusLabel = 'تم الإصلاح';
                  statusColor = 'bg-blue-200 text-blue-800';
                } else if (repair.status === 'fixed' && repair.isDelivered) {
                  statusLabel = 'تم التسليم';
                  statusColor = 'bg-green-200 text-green-800';
                } else if (repair.status === 'notFixed' && repair.isDelivered) {
                  statusLabel = 'سلم بدون إصلاح';
                  statusColor = 'bg-red-400 text-green-800';
                } else if (repair.status === 'notFixed' && !repair.isDelivered) {
                  statusLabel = 'لم يتم الإصلاح';
                  statusColor = 'bg-red-200 text-green-800';
                }
                return (
                  <React.Fragment key={repair.id}>
                    <tr
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedRepairId === repair.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setExpandedRepairId(expandedRepairId === repair.id ? null : repair.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {repair.receivedAt ? new Date(repair.receivedAt).toLocaleDateString('en-CA') : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{repair.deviceName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{repair.customerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {repair.problemDesc && repair.problemDesc.length > 30
                            ? repair.problemDesc.slice(0, 30) + '...'
                            : repair.problemDesc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{repair.cost?.toLocaleString()} جنيه</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>{statusLabel}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); openEditModal(repair); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="danger" onClick={e => { e.stopPropagation(); handleDeleteRepair(repair.id); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="success" title="تم الإصلاح" onClick={e => { e.stopPropagation(); handleMarkFixed(repair.id); }}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" title="لم يتم الإصلاح" onClick={e => { e.stopPropagation(); handleMarkNotFixed(repair.id); }}>
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="تسليم" onClick={e => { e.stopPropagation(); handleDeliver(repair.id); }}>
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedRepairId === repair.id && (
                      <tr>
                        <td colSpan={7} className="bg-blue-50 px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <strong>الجهاز:</strong> {repair.deviceName}<br />
                            <strong>العميل:</strong> {repair.customerName}<br />
                            <strong>تاريخ الاستلام:</strong> {repair.receivedAt ? new Date(repair.receivedAt).toLocaleDateString('en-CA') : '-'}<br />
                            <strong>الوصف الكامل:</strong> {repair.problemDesc}<br />
                            <strong>التكلفة:</strong> {repair.cost?.toLocaleString()} جنيه<br />
                            <strong>الحالة:</strong> {statusLabel}<br />
                            {/* يمكنك إضافة المزيد من التفاصيل هنا */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">لا توجد إصلاحات{showAll ? '' : ' لهذا الشهر'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
