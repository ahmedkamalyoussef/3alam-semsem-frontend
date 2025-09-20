
import React, { useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ar from 'date-fns/locale/ar-EG';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ value, onChange, ...props }) => {
  // Register locale only once
  const registered = useRef(false);
  if (!registered.current) {
    try { registerLocale('ar', ar); } catch (e) {}
    registered.current = true;
  }
  return (
    <div dir="rtl">
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={date => onChange(date)}
        dateFormat="yyyy-MM-dd"
        locale="ar"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholderText="اختر التاريخ"
        calendarClassName="rtl-datepicker"
        {...props}
      />
    </div>
  );
};

export default DateInput;
