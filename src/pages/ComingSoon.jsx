import React from 'react';
import { Clock } from 'lucide-react';
import Card from '../components/ui/Card';

const ComingSoon = ({ title }) => {
  return (
    <div className="flex items-center justify-center min-h-96 animate-fade-in">
      <Card className="text-center py-12 px-8 max-w-md">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">
          هذه الصفحة قيد التطوير وسيتم إطلاقها قريباً. شكراً لصبركم!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>الميزات القادمة:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 text-right">
            <li>• إدارة شاملة للفئات</li>
            <li>• نظام تتبع الإصلاحات</li>
            <li>• تسجيل المصروفات</li>
            <li>• تقارير مفصلة</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ComingSoon;
