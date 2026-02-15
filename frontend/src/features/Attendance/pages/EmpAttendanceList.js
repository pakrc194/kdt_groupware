import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/EmpAttendanceList.css"; // CSS 파일은 별도로 생성 필요
import { Link } from "react-router-dom";
import { getDeptLabel } from "../../../shared/func/formatLabel";

function EmpAttendanceList() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const [filter, setFilter] = useState({
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`,
    deptId: myInfo.deptId === 1 ? 0 : myInfo.deptId,
    empNm: "",
  });

  // 2. 데이터 로드 함수
  const loadAtdcList = async () => {
    setLoading(true);
    try {
      // DTO 구조에 맞춰 쿼리 스트링 생성
      const queryString = `startDate=${filter.startDate}&endDate=${filter.endDate}&deptId=${filter.deptId}&empNm=${filter.empNm}`;
      const data = await fetcher(`/gw/atdc/empAtdcList?${queryString}`);
      setList(data);
    } catch (error) {
      console.error("사원 리스트 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 필터 변경 시 호출 (단, 버튼 클릭 시 조회를 원하면 호출부 조정 가능)
  useEffect(() => {
    loadAtdcList();
  }, []);

  // 필터 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="stats-container">
      <header className="stats-header">
        <h1>사원별 근태 리스트</h1>
      </header>

      {/* 필터 섹션 */}
      <div className="filter-section">
        <div className="filter-group">
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
          />
          <span>~</span>
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
          />

          <select
            name="deptId"
            value={filter.deptId}
            onChange={handleFilterChange}
            disabled={myInfo.deptId !== 0}
          >
            <option value="0">전체 부서</option>
            <option value="2">식품</option>
            <option value="3">뷰티·패션잡화</option>
            <option value="4">여성패션</option>
            <option value="5">남성패션</option>
            <option value="6">인사관리</option>
            <option value="7">시설자재</option>
            <option value="8">안전관리</option>
          </select>

          <input
            type="text"
            name="empNm"
            placeholder="사원명 검색"
            value={filter.empNm}
            onChange={handleFilterChange}
          />

          <button className="search-btn" onClick={loadAtdcList}>
            조회
          </button>
        </div>
      </div>

      {/* 사원 리스트 테이블 */}
      <div className="section history-section">
        {loading ? (
          <div className="loading">데이터를 불러오는 중입니다...</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>사번</th>
                <th>이름</th>
                <th>부서</th>
                <th>총 근무일</th>
                <th>정상근무율</th>
                <th>결근 횟수</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? (
                list.map((emp) => (
                  <tr key={emp.empId}>
                    <td>{emp.empSn}</td>
                    <td className="emp-name">
                      <Link
                        to={`/attendance/empDetail?empId=${emp.empId}&startDate=${filter.startDate}&endDate=${filter.endDate}`}
                        style={{
                          textDecoration: "none",
                          color: "#1890ff",
                          fontWeight: "bold",
                        }}
                      >
                        {emp.empNm}
                      </Link>
                    </td>
                    <td>{getDeptLabel(emp.deptId)}</td>
                    <td>{emp.totWrkDays}일</td>
                    <td>
                      <div
                        className="rate-badge"
                        style={{
                          backgroundColor:
                            emp.atdcRate >= 90 ? "#e6f7ff" : "#fff1f0",
                          color: emp.atdcRate >= 90 ? "#1890ff" : "#ff4d4f",
                          border: `1px solid ${emp.atdcRate >= 90 ? "#91d5ff" : "#ffa39e"}`,
                        }}
                      >
                        {emp.atdcRate}%
                      </div>
                    </td>
                    <td>
                      <span className={emp.absCnt > 0 ? "text-danger" : ""}>
                        {emp.absCnt}회
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    조회된 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmpAttendanceList;
