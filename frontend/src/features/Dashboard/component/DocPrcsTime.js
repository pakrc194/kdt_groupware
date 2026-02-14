import React, { useState } from 'react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { TimeDiff } from './TimeDiff';

function DocPrcsTime({docPrc}) {
  const comp = docPrc.filter(dd => dd.aprvDocStts !== "PENDING" && dd.roleCd === "DRFT").length;
  const reje = docPrc.filter(dd => dd.aprvDocStts === "REJECTED" && dd.roleCd === "DRFT").length;

  const presentRate = comp === 0 ? 0 : ((reje / comp) * 100).toFixed(2);

  const parseDateTime = (str) => {
        const year = str.substring(0, 4);
        const month = str.substring(4, 6) - 1; // JS는 month가 0부터 시작
        const day = str.substring(6, 8);
        const hour = str.substring(8, 10);
        const minute = str.substring(10, 12);
        const second = str.substring(12, 14);

        return new Date(year, month, day, hour, minute, second);
    }

    const now = new Date();
    // 최근 12개월 배열 생성 (오늘 기준)
    const recentMonths = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 0~11 이라서 +1
      };
    });

    const data = recentMonths.map(({ year, month }) => ({
      name: `${year}.${String(month).padStart(2, "0")}`,
      "완료": docPrc.filter(dd => 
        dd.aprvDocStts === "COMPLETED" && dd.roleCd === "DRFT" 
        && parseDateTime(dd.aprvDocDrftDt).getMonth() + 1 == month
        && parseDateTime(dd.aprvDocDrftDt).getFullYear() == year).length,
      "대기": docPrc.filter(dd => 
        dd.aprvDocStts === "PENDING" && dd.roleCd === "DRFT" 
        && parseDateTime(dd.aprvDocDrftDt).getMonth() + 1 == month
        && parseDateTime(dd.aprvDocDrftDt).getFullYear() == year).length,
      "반려": docPrc.filter(dd => 
        dd.aprvDocStts === "REJECTED" && dd.roleCd === "DRFT" 
        && parseDateTime(dd.aprvDocDrftDt).getMonth() + 1 == month
        && parseDateTime(dd.aprvDocDrftDt).getFullYear() == year).length,
    }));

    

    return (
        <div>
            <h3>반려비율  {reje}/{comp} : {presentRate}%</h3>

            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="완료" fill="#82ca9d" isAnimationActive={true} />
                <Bar dataKey="대기" fill="#aaaaaa" isAnimationActive={true} />
                <Bar dataKey="반려" fill="#ca8282" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>

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
                        docPrc
                        .filter(dd => dd.aprvDocStts != "PENDING")
                        .filter(dd => dd.roleCd == "LAST_ATRZ")
                        .map((dd, index) => (
                            <tr key={index}>
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
                                <td style={styles.td}>{dd.docFormNm} {dd.docFormId}</td>
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