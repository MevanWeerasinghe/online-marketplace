export default function CustomPopup({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showInput = false,
  inputLabel = "",
  inputValue = "",
  onInputChange = () => {},
  inputType = "number",
  inputMin = 1,
  inputMax = 100,
  hideButtons = false, // ✅ NEW PROP
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 backdrop-blur-sm bg-transparent pointer-events-none" />
      <div className="relative z-10 bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-purple-300 pointer-events-auto">
        <h2 className="text-xl font-bold text-purple-700 mb-4">{title}</h2>

        <div className="mb-6">
          {children}
          {showInput && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputLabel}
              </label>
              <input
                type={inputType}
                value={inputValue}
                onChange={onInputChange}
                min={inputMin}
                max={inputMax}
                className="w-full border-2 border-purple-300 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
        </div>

        {!hideButtons && (
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
