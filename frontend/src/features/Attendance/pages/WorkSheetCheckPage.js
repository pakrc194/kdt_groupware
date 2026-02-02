import React, { useState} from 'react';
import '../css/WorkSheetCheckPage.css';

function WorkSheetCheckPage(props) {
// 1. 상태 관리
  const [title, setTitle] = useState("2026년 1월 근무표");
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [workType, setWorkType] = useState("4조3교대");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 초기 사원 데이터 (조 편성 전후를 위해 직위(position) 추가)
  const [employees, setEmployees] = useState([
    { id: 1, name: '김철수', position: '과장', group: 'A', duties: {} },
    { id: 2, name: '이영희', position: '대리', group: 'B', duties: {} },
    { id: 3, name: '박지민', position: '사원', group: 'A', duties: {} },
    { id: 4, name: '최동욱', position: '사원', group: 'B', duties: {} },
    { id: 5, name: '정수호', position: '사원', group: 'A', duties: {} },
    { id: 6, name: '강민지', position: '사원', group: 'B', duties: {} },
    { id: 7, name: '홍길동', position: '신입', group: '', duties: {} },
    { id: 8, name: '차은우', position: '사원', group: 'D', duties: {} },
  ]);

  // 팝업 내 임시 편집을 위한 상태
  const [tempEmps, setTempEmps] = useState([]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const dutyOptions = {
    "사무": ["WD", "DO", "O"],
    "4조2교대": ["D", "E", "O"],
    "4조3교대": ["D", "E", "N", "O"]
  };

  const dutyStyles = {
    D: { color: '#e3f2fd', textColor: '#1976d2' },
    E: { color: '#f3e5f5', textColor: '#7b1fa2' },
    N: { color: '#fff3e0', textColor: '#ef6c00' },
    O: { color: '#eeeeee', textColor: '#9e9e9e' },
    WD: { color: '#e8f5e9', textColor: '#2e7d32' },
    DO: { color: '#fce4ec', textColor: '#c2185b' },
  };

  // --- 조 편성 팝업 로직 ---
  const openModal = () => {
    setTempEmps(JSON.parse(JSON.stringify(employees))); // 깊은 복사
    setIsModalOpen(true);
  };

  const moveToGroup = (id, targetGroup) => {
    setTempEmps(prev => prev.map(emp => emp.id === id ? { ...emp, group: targetGroup } : emp));
  };

  const removeFromGroup = (id) => {
    setTempEmps(prev => prev.map(emp => emp.id === id ? { ...emp, group: '' } : emp));
  };

  const saveAndApply = () => {
    const sorted = [...tempEmps].sort((a, b) => {
      if (!a.group) return 1;
      if (!b.group) return -1;
      return a.group.localeCompare(b.group);
    });
    setEmployees(sorted);
    setIsModalOpen(false);
  };

  // --- 근무표 작성 로직 ---
  const handleBulkGenerate = () => {
    if (!window.confirm(`${workType} 기준으로 근무를 일괄 작성하시겠습니까?`)) return;
    
    const patterns = {
      "4조3교대": { 
        A: ['D','D','E','E','N','N','O','O'], 
        B: ['E','E','N','N','O','O','D','D'],
        C: ['N','N','O','O','D','D','E','E'],
        D: ['O','O','D','D','E','E','N','N'] 
      },
      "4조2교대": { A: ['D','D','O','O'], B: ['E','E','O','O'], C: ['D','D','O','O'], D: ['E','E','O','O'] },
      "사무": { A: ['WD','WD','WD','WD','WD','O','O'], B: ['WD','WD','WD','WD','WD','O','O'] }
    };

    setEmployees(prev => prev.map(emp => {
      if (!emp.group) return emp;
      const newDuties = {};
      const pattern = patterns[workType]?.[emp.group] || dutyOptions[workType];
      days.forEach((day, index) => {
        newDuties[day] = pattern[index % pattern.length];
      });
      return { ...emp, duties: newDuties };
    }));
  };

  const handleDutyChange = (empId, day, newType) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === empId ? { ...emp, duties: { ...emp.duties, [day]: newType } } : emp
    ));
  };

  return (
    <div className="timeline-container">
      <div className="timeline-top-bar">
        <input className="title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="timeline-controls">
        <div className="controls-left">
          <input type="month" className="control-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          <div className="work-type-group">
            <span className="label-text">근무 체계:</span>
            <select className="control-select highlight" value={workType} onChange={(e) => setWorkType(e.target.value)}>
              <option value="사무">사무</option>
              <option value="4조2교대">4조 2교대</option>
              <option value="4조3교대">4조 3교대</option>
            </select>
          </div>
        </div>
        <div className="controls-right">
          <button className="btn-setup" onClick={openModal}>조 편성 관리</button>
          <button className="btn-bulk" onClick={handleBulkGenerate}>일괄 작성</button>
          <button className="btn-reset" onClick={() => setEmployees(prev => prev.map(e => ({...e, duties: {}})))}>초기화</button>
        </div>
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-header">
          <div className="employee-info-cell">사원명 (조)</div>
          {days.map(day => <div key={day} className="day-cell">{day}</div>)}
        </div>
        {employees.map(emp => (
          <div key={emp.id} className="employee-row">
            <div className="employee-info-cell">
              <span className="emp-name">{emp.name}</span>
              <span className={`emp-group-tag ${emp.group}`}>{emp.group ? `${emp.group}조` : '미배정'}</span>
            </div>
            {days.map(day => {
              const type = emp.duties[day] || 'O';
              const style = dutyStyles[type] || dutyStyles['O'];
              return (
                <div key={day} className="duty-cell">
                  <select 
                    className="duty-select"
                    style={{ backgroundColor: style.color, color: style.textColor }}
                    value={type}
                    onChange={(e) => handleDutyChange(emp.id, day, e.target.value)}
                  >
                    {dutyOptions[workType].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    <option value="O">O</option>
                  </select>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 조 편성 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="setup-modal">
            <div className="modal-header">
              <h3>조 편성 관리 (부서명: 영업 1팀)</h3>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-grid-content">
              <div className="employee-pool">
                <input 
                  type="text" className="search-input" placeholder="이름 검색..." 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pool-list">
                  <div className="pool-title">미배정 사원</div>
                  {tempEmps.filter(e => !e.group && e.name.includes(searchTerm)).map(emp => (
                    <div key={emp.id} className="pool-item">
                      <span>{emp.name} ({emp.position})</span>
                      <div className="add-buttons">
                        {['A', 'B', 'C', 'D'].map(g => (
                          <button key={g} onClick={() => moveToGroup(emp.id, g)}>{g}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="group-grid">
                {['A', 'B', 'C', 'D'].map(g => (
                  <div key={g} className="group-box">
                    <div className="group-box-header">[{g} 조] ({tempEmps.filter(e => e.group === g).length}명)</div>
                    <div className="group-box-body">
                      {tempEmps.filter(e => e.group === g).map(emp => (
                        <div key={emp.id} className="member-tag">
                          {emp.name} ({emp.position})
                          <button className="remove-btn" onClick={() => removeFromGroup(emp.id)}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer-btns">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>취소</button>
              <button className="btn-save" onClick={saveAndApply}>설정 저장 및 적용</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default WorkSheetCheckPage;