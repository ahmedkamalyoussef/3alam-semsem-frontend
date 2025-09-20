// Modal.jsx
export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* الخلفية */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* المحتوى */}
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-10">
        {/* زرار إغلاق */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
