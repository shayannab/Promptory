// src/components/ConfirmModal.jsx
function ConfirmModal({ show, onCancel, onConfirm, title = 'Are you sure?', message = 'Do you really want to delete this prompt? This action cannot be undone.', confirmText = 'Delete', cancelText = 'Cancel' }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded shadow-xl max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
