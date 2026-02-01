import Button from "./Button";
import "./Modal.css";

/*
{isOpen && (
  <Modal title="삭제 확인" onClose={() => setIsOpen(false)}>
    정말 삭제하시겠습니까?
  </Modal>
)}
*/

export default function Modal({ title, message, onClose, onOk, okMsg }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">{message}</div>
        <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>취소</Button>
            <Button variant="primary" onClick={onOk}>{okMsg}</Button>
        </div>
      </div>
    </div>
  );
}
