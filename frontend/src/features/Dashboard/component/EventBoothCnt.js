import React, { useState } from 'react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';


function EventBoothCnt({ docPrc, sched }) {
    const [days, setDays] = useState(0)
    const now = new Date();
    // 최근 12개월 배열 생성 (오늘 기준)
    const recentMonths = Array.from({ length: 15 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 0~11 이라서 +1
      };
    });

    const data = recentMonths.map(({ year, month }) => ({
        
      name: `${year}.${String(month).padStart(2, "0")}`,
      "계약": docPrc
        .filter(dd =>
            dd.aprvDocStts === "COMPLETED" &&
            dd.docFormId === 3 &&
            dd.roleCd === "LAST_ATRZ"
        )
        .flatMap(dd => 
            sched
            .filter(sc => 
                dd.aprvDocId === sc.schedDocId &&
                new Date(sc.schedStartDate).getFullYear() === year &&
                new Date(sc.schedStartDate).getMonth() + 1 === month
            )
            // .map(sc => sc.schedStartDate) // 여기서 날짜만 뽑음
        ).length,
    }));

    const eventContract = docPrc
                        .filter(dd =>
                            dd.aprvDocStts === "COMPLETED" &&
                            dd.docFormId === 3 &&
                            dd.roleCd === "LAST_ATRZ"
                        )
                        .flatMap(dd => sched
                            .filter(sc => 
                                dd.aprvDocId === sc.schedDocId 
                                &&
                                new Date(sc.schedStartDate).getFullYear() === now.getFullYear()
                                // new Date(sc.schedStartDate).getMonth() + 1 === month
                            )
                            .map(sc => ((new Date(sc.schedEndDate) - new Date(sc.schedStartDate)) / (1000 * 60 * 60 * 24) + 1))
                        )
    console.log(eventContract)

    const average =
    eventContract.length > 0
        ? (
            eventContract.reduce((sum, value) => sum + value, 0)
            / eventContract.length
          ).toFixed(2)
        : 0;

        console.log(average)


    return (
        <div>
            <h1>이벤트 부스 계약 통계</h1>
            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="계약" fill="#82ca9d" isAnimationActive={true} />
                {/* <Bar dataKey="대기" fill="#ca8282" isAnimationActive={true} /> */}
                {/* <Bar dataKey="반려" fill="#595959" isAnimationActive={true} /> */}
                {/* <RechartsDevtools /> */}
            </BarChart>
            <h1>계약 기간</h1>
            <h3>평균 {average} 일</h3>



<table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>행사 이름</th>
                        <th style={styles.th}>위치</th>
                        <th style={styles.th}>담당자</th>
                        <th style={styles.th}>시작일</th>
                        <th style={styles.th}>종료일</th>
                        <th style={styles.th}>기간</th>
                    </tr>
                </thead>
                <tbody>
                    {eventContract.length > 0 ? (
                    docPrc
                        .filter(dd =>
                            dd.aprvDocStts === "COMPLETED" &&
                            dd.docFormId === 3 &&
                            dd.roleCd === "LAST_ATRZ"
                        )
                        .flatMap(dd => sched
                            .filter(sc => 
                                dd.aprvDocId === sc.schedDocId 
                                &&
                                new Date(sc.schedStartDate).getFullYear() === now.getFullYear()
                                // new Date(sc.schedStartDate).getMonth() + 1 === month
                            )
                            .sort((a, b) => new Date(b.schedStartDate) - new Date(a.schedStartDate))
                            .map((sc, index) => {
                                return (
                                <tr key={index}>
                                    <td style={styles.td}>{sc.schedTitle}</td>
                                    <td style={styles.td}>{sc.locNm}</td>
                                    <td style={styles.td}>{sc.empNm}</td>
                                    <td style={styles.td}>{sc.schedStartDate?.split(" ")[0]}</td>
                                    <td style={styles.td}>{sc.schedEndDate?.split(" ")[0]}</td>
                                    <td style={styles.td}>{(new Date(sc.schedEndDate) - new Date(sc.schedStartDate)) / (1000 * 60 * 60 * 24) + 1} 일</td>
                                </tr>
                                )
                            }
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

export default EventBoothCnt;