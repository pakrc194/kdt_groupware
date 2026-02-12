import React, { useState } from 'react';
import { TimeDiff } from './TimeDiff';

function DocPrcsTime({docPrc}) {
  const [aprvTime, setAprvTime] = useState('');
  const comp = docPrc.filter(dd => dd.aprvDocStts !== "PENDING" && dd.roleCd === "DRFT").length;
  const reje = docPrc.filter(dd => dd.aprvDocStts === "REJECTED" && dd.roleCd === "DRFT").length;
  console.log("결재속도"+comp)

  const presentRate = comp === 0 ? 0 : ((reje / comp) * 100).toFixed(2);

    return (
        <div>
            <h3>반려비율  {reje}/{comp} : {presentRate}%</h3>
            <h3>결재 속도</h3>
            <div style={styles.container}>
            <h2>문서 정보</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>문서 제목</th>
                        <th style={styles.th}>문서 상태</th>
                        <th style={styles.th}>작성자</th>
                        <th style={styles.th}>작성일</th>
                        <th style={styles.th}>승인자</th>
                        <th style={styles.th}>승인 날짜</th>
                        <th style={styles.th}>문서 유형</th>
                        <th style={styles.th}>역할</th>
                        <th style={styles.th}>결재시간</th>
                    </tr>
                </thead>
                <tbody>
                    {docPrc.length > 0 ? (
                        docPrc.map((dd, index) => (
                            <tr key={index}>
                              {/* {setAprvTime(dd.roleCd == 'DRFT' ? dd.aprvDocDrftDt : dd.aprvPrcsDt)} */}
                                <td style={styles.td}>{dd.aprvDocTtl}</td>
                                <td style={styles.td}>{dd.aprvDocStts}</td>
                                <td style={styles.td}>{dd.drftEmpNm}</td>
                                <td style={styles.td}>
                                    {dd.aprvDocDrftDt ? dd.aprvDocDrftDt : '미정'}
                                </td>
                                <td style={styles.td}>{dd.aprvPrcsEmpNm}</td>
                                <td style={styles.td}>
                                    {dd.aprvPrcsDt ? dd.aprvPrcsDt : '미승인'}
                                </td>
                                <td style={styles.td}>{dd.docFormNm}</td>
                                <td style={styles.td}>{dd.roleCd}</td>
                                <td style={styles.td}>{dd.aprvPrcsDt ? TimeDiff(dd.aprvDocDrftDt, dd.aprvPrcsDt) : '결재 전'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" style={styles.noData}>
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

export default DocPrcsTime;