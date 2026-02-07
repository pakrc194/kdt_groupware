import React, { useState, useEffect } from "react";

function DutyGroupModal({ isOpen, onClose, initialEmployees, onApply }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempEmps, setTempEmps] = useState([]);

  // 모달이 열릴 때 부모의 데이터를 복사하여 독립적인 편집 상태 생성
  useEffect(() => {
    if (isOpen) {
      setTempEmps(JSON.parse(JSON.stringify(initialEmployees)));
      setSearchTerm("");
    }
  }, [isOpen, initialEmployees]);

  if (!isOpen) return null;

  // 조 변경 핸들러
  const handleMoveGroup = (id, newGroup) => {
    setTempEmps((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, group: newGroup } : emp)),
    );
  };

  return (
    <div className="modal-overlay">
      <div className="setup-modal">
        <div className="modal-header">
          <h2>조 편성 관리</h2>
          <button className="close-x" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-grid-content">
          {/* 왼쪽: 사원 풀 */}
          <div className="employee-pool">
            <input
              type="text"
              className="search-input"
              placeholder="사원 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pool-list">
              {tempEmps
                .filter(
                  (e) =>
                    e.name.includes(searchTerm) &&
                    (!e.group || e.group === "미배정" || e.group === ""),
                )
                .map((e) => (
                  <div key={e.id} className="pool-item">
                    <span>{e.name}</span>
                    <div className="add-buttons">
                      {["A", "B", "C", "D"].map((g) => (
                        <button
                          key={g}
                          onClick={() => handleMoveGroup(e.id, g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 오른쪽: 조별 배치 */}
          <div className="group-grid">
            {["A", "B", "C", "D"].map((gn) => (
              <div key={gn} className="group-box">
                <div className="group-box-header">{gn}조</div>
                <div className="group-box-body">
                  {tempEmps
                    .filter((e) => e.group === gn)
                    .map((e) => (
                      <div key={e.id} className="member-tag">
                        <span>{e.name}</span>
                        <button onClick={() => handleMoveGroup(e.id, "")}>
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer-btns">
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button className="btn-save" onClick={() => onApply(tempEmps)}>
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DutyGroupModal;
