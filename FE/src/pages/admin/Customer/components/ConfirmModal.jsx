import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open flex items-center justify-center">
            <div className="modal-box max-w-sm p-4">
                <h3 className="font-bold text-lg text-center">Xác nhận</h3>
                <p className="py-3 text-center">{message}</p>
                <div className="modal-action flex justify-center gap-3">
                    <button className="btn btn-primary px-4" onClick={onConfirm}>
                        Xác nhận
                    </button>
                    <button className="btn px-4" onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
