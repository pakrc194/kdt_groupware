import React from "react";

function PersonnelChangeStats({ inOut, changeEmpData }) {
  console.log(changeEmpData)
    const active = inOut.filter((d) => d.empAcntStts != "RETIRED");
    const retired = inOut.filter((d) => d.empAcntStts == "RETIRED")
  return (
    <div>
      <h2 style={styles.title}>인사 변동 통계</h2>

      {/* ================= 입사 ================= */}
      <div style={styles.section}>
        <h3 style={styles.subTitle}>입사 및 입사 예정일 ({active.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>팀</th>
              <th style={styles.th}>직책</th>
              <th style={styles.th}>입사날짜</th>
            </tr>
          </thead>
          <tbody>
            {active.length > 0 ? (
              active
                .sort(
                  (a, b) =>
                    new Date(a.empJncmpYmd) - new Date(b.empJncmpYmd)
                )
                .map((data) => (
                  <tr key={data.empId}>
                    <td style={styles.td}>{data.empNm}</td>
                    <td style={styles.td}>{data.deptName}</td>
                    <td style={styles.td}>{data.jbttlNm}</td>
                    <td style={styles.td}>
                      {data.empJncmpYmd.split(" ")[0]}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= 퇴사 ================= */}
      <div style={styles.section}>
        <h3 style={styles.subTitle}>퇴사 ({retired.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>팀</th>
              <th style={styles.th}>직책</th>
              <th style={styles.th}>퇴사날짜</th>
            </tr>
          </thead>
          <tbody>
            {retired.length > 0 ? (
              retired
                .sort(
                  (a, b) =>
                    new Date(a.empRsgntnYmd) -
                    new Date(b.empRsgntnYmd)
                )
                .map((data) => (
                  <tr key={data.empId}>
                    <td style={styles.td}>{data.empNm}</td>
                    <td style={styles.td}>{data.deptName}</td>
                    <td style={styles.td}>{data.jbttlNm}</td>
                    <td style={styles.td}>{data.empRsgntnYmd.split(" ")[0]}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= 직책 변경 ================= */}
      <div style={styles.section}>
        <h3 style={styles.subTitle}>직책 변경 ({changeEmpData.filter((d) => d.beforeJbttlId !== d.afterJbttlId).length})</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>팀</th>
              <th style={styles.th}>변경 전 직책</th>
              <th style={styles.th}>변경 후 직책</th>
              <th style={styles.th}>변경날짜</th>
            </tr>
          </thead>
          <tbody>
            {changeEmpData.filter((d) => d.beforeJbttlId !== d.afterJbttlId).length > 0 ? (
              changeEmpData
                .filter((d) => d.beforeJbttlId !== d.afterJbttlId)
                .sort(
                  (a, b) =>
                    new Date(a.changeDate) -
                    new Date(b.changeDate)
                )
                .map((data) => (
                  <tr key={data.historyId}>
                    <td style={styles.td}>{data.histEmpNm}</td>
                    <td style={styles.td}>{data.bDeptName}</td>
                    <td style={styles.td}>{data.bJbttlNm}</td>
                    <td style={styles.td}>{data.aJbttlNm}</td>
                    <td style={styles.td}>
                      {data.changeDate.split(" ")[0]}
                    </td>
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

      {/* ================= 팀 이동 ================= */}
      <div style={styles.section}>
        <h3 style={styles.subTitle}>팀 이동 ({changeEmpData.filter((d) => d.beforeDeptId !== d.afterDeptId).length})</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>변경 전 팀</th>
              <th style={styles.th}>변경 후 팀</th>
              <th style={styles.th}>직책</th>
              <th style={styles.th}>변경날짜</th>
            </tr>
          </thead>
          <tbody>
            {changeEmpData.filter((d) => d.beforeDeptId !== d.afterDeptId).length > 0 ? (
              changeEmpData
                .filter(
                  (d) => d.beforeDeptId !== d.afterDeptId
                )
                .sort(
                  (a, b) =>
                    new Date(a.changeDate) -
                    new Date(b.changeDate)
                )
                .map((data) => (
                  <tr key={data.historyId}>
                    <td style={styles.td}>{data.histEmpNm}</td>
                    <td style={styles.td}>{data.bDeptName}</td>
                    <td style={styles.td}>{data.aDeptName}</td>
                    <td style={styles.td}>{data.aJbttlNm}</td>
                    <td style={styles.td}>
                      {data.changeDate.split(" ")[0]}
                    </td>
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
      {/* ================= 이름 변경 ================= */}
        <div style={styles.section}>
        <h3 style={styles.subTitle}>이름 변경({changeEmpData.filter(d => d.beforeNm !== d.afterNm).length})</h3>
        <table style={styles.table}>
            <thead>
            <tr>
                <th style={styles.th}>기존 이름</th>
                <th style={styles.th}>변경 후 이름</th>
                <th style={styles.th}>팀</th>
                <th style={styles.th}>직책</th>
                <th style={styles.th}>변경날짜</th>
            </tr>
            </thead>
            <tbody>
            {changeEmpData.filter(d => d.beforeNm !== d.afterNm).length > 0 ? (
                changeEmpData
                .filter(d => d.beforeNm !== d.afterNm)
                .sort(
                    (a, b) =>
                    new Date(a.changeDate) -
                    new Date(b.changeDate)
                )
                .map(data => (
                    <tr key={data.historyId}>
                    <td style={styles.td}>{data.beforeNm}</td>
                    <td style={styles.td}>{data.afterNm}</td>
                    <td style={styles.td}>{data.bDeptName}</td>
                    <td style={styles.td}>{data.aJbttlNm}</td>
                    <td style={styles.td}>
                        {data.changeDate.split(" ")[0]}
                    </td>
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
    </div>
    
  );
}

const styles = {
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  subTitle: {
    marginBottom: 16,
  },
  section: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: 30,
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
    padding: 40,
    color: "#bfbfbf",
  },
};

export default PersonnelChangeStats;
