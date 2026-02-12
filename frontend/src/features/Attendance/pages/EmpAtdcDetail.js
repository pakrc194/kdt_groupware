import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/EmpAttendanceList.css";
import { getStatusLabel } from "../../../shared/func/formatStatus";

function EmpAtdcDetail() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const [searchParams] = useSearchParams();

  // URL 쿼리 스트링에서 데이터 추출 (?empId=...&startDate=...)
  const empIdFromUrl = searchParams.get("empId");
  const startDateFromUrl = searchParams.get("startDate") || "2026-01-01";
  const endDateFromUrl = searchParams.get("endDate") || "2026-12-31";

  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 필터 상태 관리
  const [filter, setFilter] = useState({
    startDate: startDateFromUrl,
    endDate: endDateFromUrl,
    empId: empIdFromUrl,
  });

  const loadDetail = async () => {
    if (!filter.empId) return;

    setLoading(true);
    try {
      const queryString = `empId=${filter.empId}&startDate=${filter.startDate}&endDate=${filter.endDate}`;
      const data = await fetcher(`/gw/atdc/empAtdcList/detail?${queryString}`);
      setDetailList(data);
    } catch (error) {
      console.error("상세 내역 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 로드 시 및 URL 파라미터 변경 시 실행
  useEffect(() => {
    loadDetail();
  }, [empIdFromUrl]);

  // 시간 포맷팅 함수 (HH:mm)
  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="stats-container">
      <header className="stats-header">
        <h1>
          {detailList.length > 0
            ? `${detailList[0].empNm} (${detailList[0].empSn})`
            : "사원"}{" "}
          근태 상세 내역
        </h1>
        <button
          className="search-btn"
          onClick={() => window.history.back()}
          style={{ backgroundColor: "#8c8c8c" }}
        >
          뒤로가기
        </button>
      </header>

      {/* 필터 섹션 */}
      <div className="filter-section">
        <div className="filter-group">
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
          />
          <span>~</span>
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          />
          <button className="search-btn" onClick={loadDetail}>
            조회
          </button>
        </div>
      </div>

      <div className="section history-section">
        {loading ? (
          <div className="loading">데이터를 불러오는 중입니다...</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>근무일</th>
                <th>근무유형</th>
                <th>출근시간</th>
                <th>퇴근시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {detailList.length > 0 ? (
                detailList.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.wrkYmd}</td>
                    <td>{item.wrkNm}</td>
                    <td>{formatTime(item.clkInDtm)}</td>
                    <td>{formatTime(item.clkOutDtm)}</td>
                    <td>
                      <span className={`rate-badge ${item.atdcSttsCd}`}>
                        {getStatusLabel(item.atdcSttsCd)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    해당 기간의 근태 기록이 없습니다.
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

export default EmpAtdcDetail;
