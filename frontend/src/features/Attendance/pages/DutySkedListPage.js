import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import { useNavigate } from "react-router-dom";
import "../css/DutySkedListPage.css"; // 아래 CSS 코드 참고

function DutySkedListPage() {
  const [schedules, setSchedules] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // 체크박스 선택된 ID들
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const deptId = 8; // 안전관리팀 예시

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher(`/gw/duty/list?deptId=${deptId}`);
      setSchedules(data);
    } catch (error) {
      console.error("근무표 리스트 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  // 개별 체크박스 선택
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // 전체 선택 체크박스
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(schedules.map((item) => item.scheId));
    } else {
      setSelectedIds([]);
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
          body: { scheIds: selectedIds },
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
        <h1>팀 근무표 관리</h1>
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
                  checked={
                    selectedIds.length === schedules.length &&
                    schedules.length > 0
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
              schedules.map((item) => (
                <tr
                  key={item.scheId}
                  className={
                    selectedIds.includes(item.scheId) ? "selected-row" : ""
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.scheId)}
                      onChange={() => handleSelect(item.scheId)}
                    />
                  </td>
                  <td>{item.scheId}</td>
                  <td
                    className="title-link"
                    onClick={() =>
                      navigate(`/attendance/dtskdDet?scheId=${item.scheId}`)
                    }
                  >
                    {item.scheTtl}
                  </td>
                  <td>{item.trgtYmd?.substring(0, 6)}</td>
                  <td>{item.empNm}</td>
                  <td>{item.regDtm?.split("T")[0]}</td>
                  <td>
                    <span className={`badge-status ${item.prgrStts}`}>
                      {item.prgrStts}
                    </span>
                  </td>
                </tr>
              ))
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
