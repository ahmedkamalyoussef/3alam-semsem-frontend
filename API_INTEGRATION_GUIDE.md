# دليل ربط الفرونت إند مع الـ API - API Integration Guide

## 🔗 **تم ربط الفرونت إند بنجاح مع الباك إند!**

### ✅ **ما تم إنجازه:**

#### 🛠️ **خدمات API:**
- **`src/services/api.js`** - الخدمة الرئيسية للـ API
- **`src/services/categoryService.js`** - خدمة إدارة الفئات
- **`src/services/productService.js`** - خدمة إدارة المنتجات
- **`src/services/saleService.js`** - خدمة إدارة المبيعات
- **`src/services/expenseService.js`** - خدمة إدارة المصروفات
- **`src/services/repairService.js`** - خدمة إدارة الإصلاحات

#### 🔐 **نظام المصادقة المحدث:**
- **AuthContext** يستخدم الآن API الحقيقي
- **تسجيل الدخول:** `POST /api/v1/admin/login`
- **التسجيل:** `POST /api/v1/admin/register`
- **Bearer Token** يتم حفظه وإرساله مع كل طلب

#### 📄 **الصفحات المحدثة:**
- **CategoriesManager** - متصل بـ API الفئات
- **ProductsManager** - متصل بـ API المنتجات
- **ExpensesManager** - متصل بـ API المصروفات
- **RepairsManager** - متصل بـ API الإصلاحات
- **SalesManager** - متصل بـ API المبيعات

### 🎯 **الـ API Endpoints المستخدمة:**

#### **Admin (المصادقة):**
```
POST /api/v1/admin/login
POST /api/v1/admin/register
```

#### **Categories (الفئات):**
```
GET    /api/v1/category
POST   /api/v1/category
PATCH  /api/v1/category/:id
DELETE /api/v1/category/:id
```

#### **Products (المنتجات):**
```
GET    /api/v1/product
GET    /api/v1/product/category/:categoryId
POST   /api/v1/product
PATCH  /api/v1/product/:id
DELETE /api/v1/product/:id
```

#### **Sales (المبيعات):**
```
GET    /api/v1/sale
GET    /api/v1/sale/:id
POST   /api/v1/sale
DELETE /api/v1/sale/:id
GET    /api/v1/sale/stats/monthly?month=:month&year=:year
```

#### **Expenses (المصروفات):**
```
GET    /api/v1/expense
GET    /api/v1/expense/:id
POST   /api/v1/expense
PATCH  /api/v1/expense/:id
DELETE /api/v1/expense/:id
GET    /api/v1/expense/stats/monthly?month=:month&year=:year
```

#### **Repairs (الإصلاحات):**
```
GET    /api/v1/repair
GET    /api/v1/repair?customer=:customer
GET    /api/v1/repair/:id
POST   /api/v1/repair
PATCH  /api/v1/repair/:id
PATCH  /api/v1/repair/:id/fixed
PATCH  /api/v1/repair/:id/not-fixed
PATCH  /api/v1/repair/:id/deliver
DELETE /api/v1/repair/:id
GET    /api/v1/repair/stats/monthly?month=:month&year=:year
```

### 🚀 **كيفية التشغيل:**

#### **1. تشغيل الباك إند:**
```bash
cd "3alam-semsem backend"
npm start
# الباك إند يعمل على http://localhost:5001
```

#### **2. تشغيل الفرونت إند:**
```bash
cd 3alam-semsem-frontend
npm run dev
# الفرونت إند يعمل على http://localhost:5173
```

### 🔧 **إعدادات API:**

#### **Base URL:**
```javascript
const API_BASE_URL = 'http://localhost:5001/api/v1';
```

#### **Authentication:**
```javascript
// Headers تلقائية
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'
}
```

### 📊 **هيكل البيانات:**

#### **Category (فئة):**
```javascript
{
  id: number,
  name: string,
  description?: string,
  createdAt: string
}
```

#### **Product (منتج):**
```javascript
{
  id: number,
  name: string,
  price: number,
  stock: number,
  categoryId: number
}
```

#### **Expense (مصروف):**
```javascript
{
  id: number,
  description: string,
  amount: number,
  expenseDate: string
}
```

#### **Repair (إصلاح):**
```javascript
{
  id: number,
  customerName: string,
  deviceName: string,
  problemDesc: string,
  cost: number,
  isFixed?: boolean,
  deliveredAt?: string
}
```

#### **Sale (مبيعة):**
```javascript
{
  id: number,
  items: [
    {
      productId: number,
      quantity: number
    }
  ],
  totalAmount: number,
  createdAt: string
}
```

### 🛡️ **معالجة الأخطاء:**

#### **Error Handling في كل خدمة:**
```javascript
try {
  const data = await apiService.getCategories();
  setCategories(data);
} catch (error) {
  setError('فشل في تحميل الفئات');
  console.error('Error loading categories:', error);
}
```

#### **Loading States:**
```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
```

### 🔄 **تحديث البيانات:**

#### **بعد كل عملية CRUD:**
```javascript
// إضافة
await categoryService.createCategory(name, description);
await loadCategories(); // إعادة تحميل البيانات

// تحديث
await categoryService.updateCategory(id, updates);
await loadCategories(); // إعادة تحميل البيانات

// حذف
await categoryService.deleteCategory(id);
await loadCategories(); // إعادة تحميل البيانات
```

### 🎨 **واجهة المستخدم:**

#### **حالات التحميل:**
- **Loading Spinner** أثناء تحميل البيانات
- **Error Messages** عند حدوث أخطاء
- **Empty States** عندما لا توجد بيانات
- **Success Feedback** عند نجاح العمليات

#### **Responsive Design:**
- **Desktop:** جداول كاملة مع جميع الأعمدة
- **Mobile:** بطاقات مدمجة مع المعلومات الأساسية
- **Tablet:** تخطيط مختلط حسب المساحة

### 🔍 **البحث والتصفية:**

#### **البحث النصي:**
```javascript
const filteredData = data.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

#### **تصفية حسب الفئة:**
```javascript
const filteredData = data.filter(item =>
  !selectedCategory || item.categoryId === parseInt(selectedCategory)
);
```

### 📱 **التوافق مع الأجهزة:**

#### **Desktop (1024px+):**
- جداول كاملة
- أزرار كبيرة
- مساحة واسعة

#### **Tablet (768px-1023px):**
- تخطيط مختلط
- أعمدة أقل في الجداول

#### **Mobile (<768px):**
- بطاقات بدلاً من الجداول
- قوائم منسدلة مبسطة
- أزرار مدمجة

### 🚨 **ملاحظات مهمة:**

1. **CORS:** تأكد من أن الباك إند يسمح بالطلبات من الفرونت إند
2. **Authentication:** Token يتم حفظه في localStorage
3. **Error Handling:** جميع الأخطاء يتم معالجتها وعرضها للمستخدم
4. **Loading States:** واجهة المستخدم تظهر حالة التحميل
5. **Data Validation:** التحقق من صحة البيانات قبل الإرسال

### 🎉 **النتيجة:**

**الفرونت إند الآن متصل بالكامل مع الباك إند!**

- ✅ **مصادقة كاملة** مع الـ API
- ✅ **CRUD عمليات** لجميع الوحدات
- ✅ **معالجة أخطاء** شاملة
- ✅ **واجهة مستخدم** متجاوبة
- ✅ **تجربة مستخدم** سلسة

**النظام جاهز للاستخدام!** 🚀
