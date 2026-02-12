import React from 'react';

function Attendance({emp}) {
    console.log(emp)
    const statusList = [
            { code: "PRESENT", label: "출근" },
            { code: "ABSENT", label: "결근" },
            { code: "BUSINESS_TRIP", label: "출장" },
            { code: "OFF", label: "휴무" },
            { code: "LEAVE", label: "연차" },
        ];
    
        const total = emp.length;
        const present = emp.filter((dd) => dd.atdcSttsCd === "PRESENT").length;
        const absent = emp.filter((dd) => dd.atdcSttsCd === "ABSENT").length;
        const businessTrip = emp.filter((dd) => dd.atdcSttsCd === "BUSINESS_TRIP").length;
        const off = emp.filter((dd) => dd.atdcSttsCd === "OFF").length;
        const leave = emp.filter((dd) => dd.atdcSttsCd === "LEAVE").length;
    
        const presentRate = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    return (
        <div>
            <h1>근태현황</h1>
            {/* ================= 통계 카드 ================= */}
            <div style={styles.statsWrap}>
                <div style={styles.statCard}>
                    <div style={styles.statTitle}>전체 인원</div>
                    <div style={styles.statValue}>{total}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statTitle}>출근</div>
                    <div style={styles.statValue}>{present}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statTitle}>출근율</div>
                    <div style={styles.statValue}>{presentRate}%</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statTitle}>결근</div>
                    <div style={styles.statValue}>{absent}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statTitle}>출장</div>
                    <div style={styles.statValue}>{businessTrip}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statTitle}>휴무</div>
                    <div style={styles.statValue}>{off}</div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statTitle}>연차</div>
                    <div style={styles.statValue}>{leave}</div>
                </div>
            </div>

            {/* ================= 상태별 테이블 ================= */}
            {statusList.map((status) => {
                const list = emp.filter((dd) => dd.atdcSttsCd === status.code);

                return (
                    <div key={status.code} style={styles.section}>
                        <h3 style={styles.subTitle}>{status.label} ({list.length})</h3>

                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {/* <th style={styles.th}>사원ID</th> */}
                                    <th style={styles.th}>사원번호</th>
                                    <th style={styles.th}>이름</th>
                                    <th style={styles.th}>직책</th>
                                    {/* <th style={styles.th}>근태현황</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {list.length > 0 ? (
                                    list.map((dd) => (
                                        <tr key={dd.empId}>
                                            {/* <td style={styles.td}>{dd.empId}</td> */}
                                            <td style={styles.td}>{dd.empSn}</td>
                                            <td style={styles.td}>{dd.empNm}</td>
                                            <td style={styles.td}>{dd.jbttlNm}</td>
                                            {/* <td style={styles.td}>{dd.atdcSttsCd}</td> */}
                                        </tr>
                                    ))
                                ) : (
                                  <tr>
                                    <td colSpan="5" style={styles.noData}>
                                      데이터가 없습니다.
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}

const styles = {
  statsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    minWidth: 140,
    flex: "1 1 140px",
  },
  statTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },

  section: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: 30,
  },
  subTitle: {
    marginBottom: 16,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#fafafa",
    padding: 10,
    borderBottom: "2px solid #f0f0f0",
    textAlign: "left",
    width: "100px"
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #f0f0f0",
  },
  noData: {
    textAlign: "center",
    padding: 16,
    color: "#bfbfbf",
  },
};

export default Attendance;