import React from "react";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="text-lg">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
          >
            Potvrdi
          </button>
          <button
            onClick={onCancel}
            className="mr-4 ml-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Otkaži
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;