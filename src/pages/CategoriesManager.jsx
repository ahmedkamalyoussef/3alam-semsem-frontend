import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const CategoriesManager = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - في التطبيق الحقيقي ستأتي من API
  const [categories, setCategories] = useState([
    { id: 1, name: 'الهواتف', description: 'هواتف ذكية وجوالات', productCount: 15, createdAt: '2024-01-01' },
    { id: 2, name: 'أجهزة الكمبيوتر', description: 'لابتوبات وأجهزة كمبيوتر مكتبية', productCount: 8, createdAt: '2024-01-02' },
    { id: 3, name: 'الإكسسوارات', description: 'سماعات وشواحن وإكسسوارات أخرى', productCount: 25, createdAt: '2024-01-03' },
    { id: 4, name: 'الأجهزة المنزلية', description: 'أجهزة منزلية صغيرة', productCount: 12, createdAt: '2024-01-04' }
  ]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = (categoryData) => {
    const newCategory = {
      id: categories.length + 1,
      ...categoryData,
      productCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
  };

  const handleEditCategory = (categoryData) => {
    const updatedCategories = categories.map(c => 
      c.id === editingCategory.id 
        ? { ...c, ...categoryData }
        : c
    );
    setCategories(updatedCategories);
    setIsEditModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category.productCount > 0) {
      alert('لا يمكن حذف فئة تحتوي على منتجات. يرجى نقل المنتجات أولاً.');
      return;
    }
    
    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الفئات</h2>
          <p className="text-gray-600 mt-1">إدارة فئات المنتجات وتنظيمها</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          إضافة فئة جديدة
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="البحث عن فئة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.productCount} منتج</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => openEditModal(category)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={category.productCount > 0}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-4">{category.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>تاريخ الإنشاء: {category.createdAt}</span>
              <span className={`px-2 py-1 rounded-full ${
                category.productCount > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.productCount > 0 ? 'نشطة' : 'فارغة'}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فئات</h3>
          <p className="text-gray-500">ابدأ بإضافة فئة جديدة</p>
        </Card>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة فئة جديدة"
      >
        <CategoryForm onSubmit={handleAddCategory} />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        title="تعديل الفئة"
      >
        {editingCategory && (
          <CategoryForm 
            onSubmit={handleEditCategory} 
            initialData={editingCategory}
          />
        )}
      </Modal>
    </div>
  );
};

// Category Form Component
const CategoryForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || ''
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">اسم الفئة</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أدخل اسم الفئة"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أدخل وصف الفئة"
          rows="3"
          required
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary">إلغاء</Button>
        <Button type="submit" variant="success">حفظ الفئة</Button>
      </div>
    </form>
  );
};

export default CategoriesManager;
