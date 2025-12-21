import "./ConfirmModal.css";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3>{title || "Подтверждение"}</h3>
          <button className="confirm-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="confirm-modal-body">
          <p>{message || "Вы уверены?"}</p>
        </div>

        <div className="confirm-modal-footer">
          <button className="confirm-btn confirm-btn-cancel" onClick={onClose}>
            Отмена
          </button>
          <button
            className="confirm-btn confirm-btn-delete"
            onClick={handleConfirm}
          >
            Да
          </button>
        </div>
      </div>
    </div>
  );
};
