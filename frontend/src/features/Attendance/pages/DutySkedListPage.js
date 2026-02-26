import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import { useNavigate } from "react-router-dom";
import "../css/DutySkedListPage.css"; // 아래 CSS 코드 참고
import { getStatusLabel } from "../../../shared/func/formatLabel";

function DutySkedListPage() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const [schedules, setSchedules] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // 체크박스 선택된 ID들
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // 기본값 올해
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const deptId = myInfo.deptId; // 안전관리팀 예시

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher(`/gw/duty/list?deptId=${deptId}&year=${selectedYear}`);
      setSchedules(data);
    } catch (error) {
      console.error("근무표 리스트 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [selectedYear]);

  // 개별 체크박스 선택
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // 전체 선택/해제 토글
  const handleSelectAll = (e) => {
    const deletableIds = schedules
      .filter((item) => item.prgrStts === "DRAFT")
      .map((item) => item.dutyId);

    if (deletableIds.length === 0) return; // 선택 가능한 게 없으면 무시

    const isAllSelected = deletableIds.every(id => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !deletableIds.includes(id)));
    } else {
      setSelectedIds(prev => {
        const newSet = new Set([...prev, ...deletableIds]);
        return Array.from(newSet);
      });
    }
  };

  // 삭제 버튼 로직
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 근무표를 선택해주세요.");
      return;
    }

    if (
      window.confirm(
        `선택한 ${selectedIds.length}개의 근무표를 삭제하시겠습니까?`,
      )
    ) {
      try {
        // 백엔드에 삭제 요청 (Delete API는 구현되어 있다고 가정)
        await fetcher(`/gw/duty/delete`, {
          method: "DELETE",
          body: { dutyIds: selectedIds },
        });
        alert("삭제되었습니다.");
        setSelectedIds([]);
        loadSchedules(); // 리스트 갱신
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (isLoading)
    return <div className="loading">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="stats-container">
      {" "}
      {/* 기존 페이지와 동일한 컨테이너 클래스 */}
      <header className="stats-header">
        {/* 왼쪽 그룹: 제목 + 필터 */}
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1>팀 근무표 관리</h1>
          <select 
            className="mod-select" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ width: '130px', padding: '8px', marginBottom: '0' }} // 헤더 높이에 맞게 조정
          >
            <option value="">전체 연도</option>
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
            <option value="2024">2024년</option>
            <option value="2023">2023년</option>
            <option value="2022">2022년</option>
            <option value="2021">2021년</option>
            <option value="2020">2020년</option>
            <option value="2019">2019년</option>
            <option value="2018">2018년</option>
          </select>
        </div>

        {/* 오른쪽 그룹: 버튼들 */}
        <div className="header-buttons">
          <button className="btn-delete" onClick={handleDelete}>
            삭제
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/attendance/dtSkdIst")}
          >
            근무표 작성
          </button>
        </div>
      </header>
      <div className="section history-section">
        <table className="history-table">
          {/* 기존과 동일한 테이블 클래스 */}
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  // 삭제 가능한(DRAFT) 모든 항목이 현재 선택된 상태인지 확인하여 체크 표시 유지
                  checked={
                    schedules.filter(s => s.prgrStts === "DRAFT").length > 0 &&
                    schedules.filter(s => s.prgrStts === "DRAFT").every(s => selectedIds.includes(s.dutyId))
                  }
                />
              </th>
              <th>번호</th>
              <th>근무표 제목</th>
              <th>대상 월</th>
              <th>작성자</th>
              <th>등록일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map((item) => {
                // 1. 삭제 불가 조건 정의 (PENDING 또는 CONFIRMED)
                const isDisableDelete =
                  item.prgrStts === "PENDING" || item.prgrStts === "CONFIRMED";

                return (
                  <tr
                    key={item.dutyId}
                    className={`${selectedIds.includes(item.dutyId) ? "selected-row" : ""} ${isDisableDelete ? "disabled-row" : ""}`}
                  >
                    <td
                      title={
                        isDisableDelete
                          ? "결재 중이거나 완료된 근무표는 삭제할 수 없습니다."
                          : ""
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.dutyId)}
                        onChange={() => handleSelect(item.dutyId)}
                        // 3. 비활성화 속성 적용
                        disabled={isDisableDelete}
                        style={{
                          cursor: isDisableDelete ? "not-allowed" : "pointer",
                          opacity: isDisableDelete ? 0.5 : 1,
                        }}
                      />
                    </td>
                    <td>{item.dutyId}</td>
                    <td
                      className="title-link"
                      onClick={() =>
                        navigate(`/attendance/dtskdDet?dutyId=${item.dutyId}`)
                      }
                    >
                      {item.scheTtl}
                    </td>
                    <td>{item.trgtYmd?.substring(0, 6)}</td>
                    <td>{item.empNm}</td>
                    <td>{item.regDtm?.split("T")[0]}</td>
                    <td>
                      <span className={`badge-status ${item.prgrStts}`}>
                        {getStatusLabel(item.prgrStts)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DutySkedListPage;
