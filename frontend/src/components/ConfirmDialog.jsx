import Modal from './Modal';

const ConfirmDialog = ({ open, title, message, onCancel, onConfirm, loading }) => (
  <Modal open={open} title={title} onClose={onCancel}>
    <p className="text-sm text-slate-600">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      <button className="btn-primary bg-rose-600 hover:bg-rose-700" onClick={onConfirm} disabled={loading}>
        Delete
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
