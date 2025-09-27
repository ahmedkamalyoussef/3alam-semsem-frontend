// ...existing code...
import React, { useState, useEffect } from 'react';
import { useRepairs } from '../hooks/useRepairs';
import { Plus, Search, Edit, Trash2, Wrench, Clock, CheckCircle, XCircle, User, Phone, Check, X, Truck } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
const RepairsManager = () => {
  // Monthly stats and filters must be declared first
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAll, setShowAll] = useState(false);

  // UI state
  const [expandedRepairId, setExpandedRepairId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    repairs,
    monthlyStats,
    loading,
    loadingStats,
    error,
    loadRepairs,
    loadMonthlyStats,
    addRepair,
    editRepair,
    deleteRepair,
    markFixed,
    markNotFixed,
    deliver,
    setError,
  } = useRepairs();


  React.useEffect(() => {
    loadRepairs();
  }, [loadRepairs]);


  React.useEffect(() => {
    if (!showAll) {
      loadMonthlyStats(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, showAll, loadMonthlyStats]);

  // لا يوجد حالات في الـ API

  const filteredRepairs = repairs.filter(repair => {
    return (
      (repair.deviceName && repair.deviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (repair.customerName && repair.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (repair.problemDesc && repair.problemDesc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });


  // Removed duplicate selectedMonth, selectedYear, showAll


  // Removed duplicate loadMonthlyStats function

  const handleAddRepair = async (repairData) => {
    try {
      await addRepair(repairData, selectedMonth, selectedYear);
      setIsAddModalOpen(false);
    } catch (error) {
      setError('فشل في إضافة الإصلاح');
    }
  };

  const handleEditRepair = async (repairData) => {
    try {
      await editRepair(editingRepair._id, repairData, selectedMonth, selectedYear);
      setIsEditModalOpen(false);
      setEditingRepair(null);
    } catch (error) {
      setError('فشل في تحديث الإصلاح');
    }
  };

  const handleDeleteRepair = async (repairId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإصلاح؟')) {
      try {
        await deleteRepair(repairId, selectedMonth, selectedYear);
      } catch (error) {
        setError('فشل في حذف الإصلاح');
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
      await markFixed(repairId, selectedMonth, selectedYear);
    } catch (error) {
      setError('فشل في وضع علامة تم الإصلاح');
    }
  };

  const handleMarkNotFixed = async (repairId) => {
    try {
      await markNotFixed(repairId, selectedMonth, selectedYear);
    } catch (error) {
      setError('فشل في وضع علامة لم يتم الإصلاح');
    }
  };

  const handleDeliver = async (repairId) => {
    try {
      await deliver(repairId, new Date(), selectedMonth, selectedYear);
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
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedMonth}
          onChange={e => { setSelectedMonth(Number(e.target.value)); setShowAll(false); }}
        >
          {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((m, i) => (
            <option key={i+1} value={i+1}>{m}</option>
          ))}
        </select>
        <label>السنة:</label>
        <input
          type="number"
          className="border rounded px-2 py-1 focus:ring focus:ring-blue-400 w-24"
          value={selectedYear}
          onChange={e => { setSelectedYear(Number(e.target.value)); setShowAll(false); }}
          min="2000"
          max={new Date().getFullYear() + 1}
        />
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
              {(showAll ? repairs : (monthlyStats.repairs || [])).filter(repair => {
                return (
                  (repair.deviceName && repair.deviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (repair.customerName && repair.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (repair.problemDesc && repair.problemDesc.toLowerCase().includes(searchTerm.toLowerCase()))
                );
              }).length > 0 ? (showAll ? repairs : monthlyStats.repairs).filter(repair => {
                return (
                  (repair.deviceName && repair.deviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (repair.customerName && repair.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (repair.problemDesc && repair.problemDesc.toLowerCase().includes(searchTerm.toLowerCase()))
                );
              }).map((repair) => {
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
                  <React.Fragment key={repair._id}> 
                    <tr
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedRepairId === repair._id ? 'bg-blue-50' : ''}`}
                      onClick={() => setExpandedRepairId(expandedRepairId === repair._id ? null : repair._id)}
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
                          <Button size="sm" variant="danger" onClick={e => { e.stopPropagation(); handleDeleteRepair(repair._id); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="success" title="تم الإصلاح" onClick={e => { e.stopPropagation(); handleMarkFixed(repair._id); }}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" title="لم يتم الإصلاح" onClick={e => { e.stopPropagation(); handleMarkNotFixed(repair._id); }}>
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="تسليم" onClick={e => { e.stopPropagation(); handleDeliver(repair._id); }}>
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedRepairId === repair._id && (
                      <tr>
                        <td colSpan={7} className="bg-blue-50 px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <strong>الجهاز:</strong> {repair.deviceName}<br />
                            <strong>العميل:</strong> {repair.customerName}<br />
                            <strong>تاريخ الاستلام:</strong> {repair.receivedAt ? new Date(repair.receivedAt).toLocaleDateString('en-CA') : '-'}<br />
                            <strong>الوصف الكامل:</strong> {repair.problemDesc}<br />
                            <strong>التكلفة:</strong> {repair.cost?.toLocaleString()} جنيه<br />
                            <strong>الحالة:</strong> {statusLabel}<br />
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
