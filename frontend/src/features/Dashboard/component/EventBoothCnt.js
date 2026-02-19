import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';


function EventBoothCnt({ docPrc, sched }) {
    const [days, setDays] = useState(0)
    const now = new Date();
    // sched = sched.map(sc => sc.schedState === 0)
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
                sc.schedState === 0 &&
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
                                sc.schedState === 0 &&
                                dd.aprvDocId === sc.schedDocId 
                                &&
                                new Date(sc.schedStartDate).getFullYear() === now.getFullYear()
                                // new Date(sc.schedStartDate).getMonth() + 1 === month
                            )
                            .map(sc => ((new Date(sc.schedEndDate) - new Date(sc.schedStartDate)) / (1000 * 60 * 60 * 24) + 1))
                        )

    const average =
    eventContract.length > 0
        ? (
            eventContract.reduce((sum, value) => sum + value, 0)
            / eventContract.length
          ).toFixed(2)
        : 0;


    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // const now = new Date();

    // 연도 목록 (schedStartDate 기준)
    const years = useMemo(() => {
        const yearSet = new Set(
            sched.map(sc => new Date(sc.schedStartDate).getFullYear())
        );
        return Array.from(yearSet).sort((a, b) => b - a);
    }, [sched]);

    // 월 목록 (선택된 연도 기준)
    const months = useMemo(() => {
        if (!selectedYear) return [];
        const monthSet = new Set(
            sched
                .filter(sc => new Date(sc.schedStartDate).getFullYear() === Number(selectedYear))
                .map(sc => new Date(sc.schedStartDate).getMonth() + 1)
        );
        return Array.from(monthSet).sort((a, b) => a - b);
    }, [sched, selectedYear]);

    const today = new Date();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0"); // 1~12


    // 연도 최초 선택
    useEffect(() => {
        if (years.length > 0 && !selectedYear) setSelectedYear(years[0]);
        if (selectedYear == today.getFullYear() && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || ""); // 선택 가능한 첫 달로
        }
    }, [years, selectedYear]);

    // 연도 변경 시 월 초기화
    useEffect(() => {
        if (selectedYear == today.getFullYear() && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || ""); // 선택 가능한 첫 달로
        }
    }, [selectedYear]);

    // 필터링된 이벤트
    const filteredEvents = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];

        return docPrc
            .filter(dd => dd.aprvDocStts === "COMPLETED" && dd.docFormId === 3 && dd.roleCd === "LAST_ATRZ")
            .flatMap(dd =>
                sched
                    .filter(sc =>
                        sc.schedState === 0 &&
                        dd.aprvDocId === sc.schedDocId &&
                        new Date(sc.schedStartDate).getFullYear() === Number(selectedYear) &&
                        new Date(sc.schedStartDate).getMonth() + 1 === Number(selectedMonth)
                    )
                    .sort((a, b) => new Date(b.schedStartDate) - new Date(a.schedStartDate))
            );
    }, [docPrc, sched, selectedYear, selectedMonth]);

    // 평균 계약기간 계산 (일 기준)
    const averageContractDays = useMemo(() => {
        if (filteredEvents.length === 0) return 0;
        const totalDays = filteredEvents.reduce((sum, sc) => {
            const start = new Date(sc.schedStartDate);
            const end = new Date(sc.schedEndDate);
            return sum + (end - start) / (1000 * 60 * 60 * 24) + 1;
        }, 0);
        return (totalDays / filteredEvents.length).toFixed(2);
    }, [filteredEvents]);


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
            </BarChart>
            <h1>계약 기간</h1>
            <h3>전체 평균 계약기간: {average} 일</h3>


<div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
            {/* 연도/월 선택 */}
            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    style={styles.select}
                >
                    <option value="">연도 선택</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}년</option>
                    ))}
                </select>

                <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    style={styles.select}
                    disabled={!selectedYear}
                >
                    <option value="">월 선택</option>
                    {months.map(month => (
                        <option key={month} value={month}>{month}월</option>
                    ))}
                </select>

                {/* 평균 계약기간 표시 */}
                <div style={{ marginLeft: "20px", fontWeight: "bold", alignSelf: "center" }}>
                    평균 계약기간: {averageContractDays} 일
                </div>
                </div>
                <span style={{ fontWeight: 'bold' }}>총 {filteredEvents.length}건</span>
            </div>

            {/* 테이블 */}
            <div
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px"
                }}
            >
                <table style={styles.table}>
                    <thead
                        style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#f1f3f5",
                            zIndex: 1
                        }}
                    >
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
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((sc, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{sc.schedTitle}</td>
                                    <td style={styles.td}>{sc.locNm}</td>
                                    <td style={styles.td}>{sc.empNm}</td>
                                    <td style={styles.td}>{sc.schedStartDate?.split(" ")[0]}</td>
                                    <td style={styles.td}>{sc.schedEndDate?.split(" ")[0]}</td>
                                    <td style={styles.td}>
                                        {(new Date(sc.schedEndDate) - new Date(sc.schedStartDate)) / (1000 * 60 * 60 * 24) + 1} 일
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={styles.noData}>
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>


{/* <table style={styles.table}>
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
            </table> */}


            
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
  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    cursor: "pointer"
}

};

export default EventBoothCnt;