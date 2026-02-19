import React, { useEffect, useMemo, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AttendanceRate from '../component/AttendanceRate';
import TeamSchdule from '../component/TeamSchdule';
import DocPrcsTime from '../component/DocPrcsTime';
import { TimeDiff } from '../component/TimeDiff';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { getStatusLabel } from '../../../shared/func/formatLabel';
import formatToYYMMDD from '../../../shared/func/formatToYYMMDD';

function HrDashboard(props) {
    const [emp, setEmp] = useState([]);
    const [sched, setSched] = useState([]);
    const [docPrc, setDocPrc] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // 📌 YYYYMMDDHHmmss 문자열 파싱
    const getYear = (dateStr) => dateStr?.substring(0, 4);
    const getMonth = (dateStr) => dateStr?.substring(4, 6);

    const date = new Date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    
    const formatted = `${yyyy}-${mm}-${dd}`;

    const parseDateTime = (str) => {
        const year = str.substring(0, 4);
        const month = str.substring(4, 6) - 1; // JS는 month가 0부터 시작
        const day = str.substring(6, 8);
        const hour = str.substring(8, 10);
        const minute = str.substring(10, 12);
        const second = str.substring(12, 14);

        // return new Date(year, month, day, hour, minute, second);
        return new Date(str)
    }

    const now = new Date();
    // 최근 12개월 배열 생성 (오늘 기준)
    const recentMonths = Array.from({ length: 15 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 13 + i, 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 0~11 이라서 +1
      };
    });

    const data = recentMonths.map(({ year, month }) => ({
        
      name: `${year}.${String(month).padStart(2, "0")}`,
      "교육": docPrc
        .filter(dd =>
            dd.aprvDocStts === "COMPLETED" &&
            dd.docFormId === 7 &&
            dd.roleCd === "LAST_ATRZ"
        )
        .flatMap(dd => 
            sched
            .filter(sc => 
                dd.aprvDocId === sc.schedDocId &&
                parseDateTime(sc.schedStartDate).getFullYear() === year &&
                parseDateTime(sc.schedStartDate).getMonth() + 1 === month
            )
            // .map(sc => sc.schedStartDate) // 여기서 날짜만 뽑음
        ).length,
    }));

// sched를 월/연도/타이틀 기준으로 그룹핑
const schedMap = {};
sched.forEach(sc => {
  const d = parseDateTime(sc.schedStartDate);
  if (!d) return;
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${sc.schedTitle}`;
  if (!schedMap[key]) schedMap[key] = [];
  schedMap[key].push(sc);
});


    useEffect(() => {
        // 팀 근태
        fetcher(`/gw/dashboard/dashTeamEmpList?dept=6&date=${formatted}`)
        .then(dd => { setEmp(Array.isArray(dd) ? dd : [dd]) })

        // 팀 일정
        fetcher(`/gw/dashboard/dashTeamSchedList?dept=6`)
        .then(dd => { setSched(Array.isArray(dd) ? dd : [dd])
         })

         // 결재 속도
        fetcher('/gw/dashboard/docPrcsTime?dept=6')
        .then(dd => {setDocPrc(Array.isArray(dd) ? dd : [dd])
        })
    }, [])


    // ✅ 연도 목록
    const years = useMemo(() => {
        const yearSet = new Set(
            docPrc
                .filter(dd => dd.aprvDocDrftDt)
                .map(dd => getYear(dd.aprvDocDrftDt))
        );
        return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    }, [docPrc]);

    // ✅ 월 목록 (선택된 연도 기준)
    const months = useMemo(() => {
        if (!selectedYear) return [];

        const monthSet = new Set(
            docPrc
                .filter(
                    dd =>
                        dd.aprvDocDrftDt &&
                        getYear(dd.aprvDocDrftDt) === selectedYear
                )
                .map(dd => getMonth(dd.aprvDocDrftDt))
        );

        return Array.from(monthSet).sort();
    }, [docPrc, selectedYear]);
    
    const today = new Date();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0"); // 1~12
    
    // ✅ 최초 연도 자동 선택
    useEffect(() => {
        if (years.length > 0 && !selectedYear) {
            setSelectedYear(years[0]);
            if (selectedYear == today.getFullYear() && months.includes(currentMonth)) {
                setSelectedMonth(currentMonth);
            } else {
                setSelectedMonth(months[0] || ""); // 선택 가능한 첫 달로
            }
        }
    }, [years, selectedYear]);

    // ✅ 연도 변경 시 월 초기화
    useEffect(() => {
        if (selectedYear == today.getFullYear() && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || ""); // 선택 가능한 첫 달로
        }
    }, [selectedYear]);

    // ✅ 필터링 (기존 조건 포함)
    const filteredDocs = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];

        return docPrc
            .filter(dd =>
                dd.aprvDocStts !== "PENDING" &&
                dd.docFormId == 7 &&
                dd.roleCd === "LAST_ATRZ"
            )
            .filter(dd =>
                dd.aprvDocDrftDt &&
                getYear(dd.aprvDocDrftDt) === selectedYear &&
                getMonth(dd.aprvDocDrftDt) === selectedMonth
            );
    }, [docPrc, selectedYear, selectedMonth]);
    
    return (
        <div>
            <h1>인사관리</h1>
            <AttendanceRate emp={emp} />
            <TeamSchdule sched={sched}/>
            <DocPrcsTime docPrc={docPrc}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>교육 통계</h2>
              <span style={{ fontWeight: 'bold' }}>총 {docPrc
            .filter(dd =>
                dd.aprvDocStts !== "PENDING" &&
                dd.docFormId == 7 &&
                dd.roleCd === "LAST_ATRZ"
            ).length}건</span>
            </div>

            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="교육" fill="#82ca9d" isAnimationActive={true} />
            </BarChart>


<div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* ✅ 연도 / 월 드롭다운 */}
            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={styles.select}
                >
                    <option value="">연도 선택</option>
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}년
                        </option>
                    ))}
                </select>

                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={styles.select}
                    disabled={!selectedYear}
                >
                    <option value="">월 선택</option>
                    {months.map(month => (
                        <option key={month} value={month}>
                            {Number(month)}월
                        </option>
                    ))}
                </select>
            </div>
            <span style={{ fontWeight: 'bold' }}>총 {filteredDocs.length}건</span>
            </div>

            {/* ✅ 스크롤 영역 */}
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
                            <th style={styles.th}>문서 제목</th>
                            <th style={styles.th}>문서 상태</th>
                            <th style={styles.th}>기안자</th>
                            <th style={styles.th}>기안일</th>
                            <th style={styles.th}>최종결재자</th>
                            <th style={styles.th}>결재 날짜</th>
                            <th style={styles.th}>문서 유형</th>
                            <th style={styles.th}>결재시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map((dd, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{dd.aprvDocTtl}</td>
                                    <td style={styles.td}>
                                        {getStatusLabel(dd.aprvDocStts)}
                                    </td>
                                    <td style={styles.td}>{dd.drftEmpNm}</td>
                                    <td style={styles.td}>
                                        {dd.aprvDocDrftDt
                                            ? formatToYYMMDD(dd.aprvDocDrftDt)
                                            : "미정"}
                                    </td>
                                    <td style={styles.td}>{dd.aprvPrcsEmpNm}</td>
                                    <td style={styles.td}>
                                        {dd.aprvPrcsDt
                                            ? formatToYYMMDD(dd.aprvPrcsDt)
                                            : "미승인"}
                                    </td>
                                    <td style={styles.td}>
                                        {dd.docFormNm}
                                    </td>
                                    <td style={styles.td}>
                                        {dd.aprvPrcsDt
                                            ? TimeDiff(dd.aprvDocDrftDt, dd.aprvPrcsDt)
                                            : "결재 전"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={styles.noData}>
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
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
  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    cursor: "pointer"
}

};

export default HrDashboard;