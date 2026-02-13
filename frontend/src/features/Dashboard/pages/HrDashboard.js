import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AttendanceRate from '../component/AttendanceRate';
import TeamSchdule from '../component/TeamSchdule';
import DocPrcsTime from '../component/DocPrcsTime';
import { TimeDiff } from '../component/TimeDiff';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

function HrDashboard(props) {
    const [emp, setEmp] = useState([]);
    const [sched, setSched] = useState([]);
    const [docPrc, setDocPrc] = useState([]);

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
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 0~11 이라서 +1
      };
    });

    const data = recentMonths.map(({ year, month }) => ({
        
      name: `${year}.${String(month).padStart(2, "0")}`,
      "완료": docPrc
        .filter(dd =>
            dd.aprvDocStts !== "PENDING" &&
            dd.docFormId === 7 &&
            dd.roleCd === "LAST_ATRZ"
        )
        .flatMap(dd => 
            sched
            .filter(sc => 
                dd.aprvDocTtl === sc.schedTitle &&
                parseDateTime(sc.schedStartDate).getFullYear() === year &&
                parseDateTime(sc.schedStartDate).getMonth() + 1 === month
            )
            // .map(sc => sc.schedStartDate) // 여기서 날짜만 뽑음
        ).length,
    }));


    console.log(data)


    // 예: 원하는 연도/월
const year = 2026;
const month = 1; // 2월

// sched를 월/연도/타이틀 기준으로 그룹핑
const schedMap = {};
sched.forEach(sc => {
  const d = parseDateTime(sc.schedStartDate);
  console.log(sc.schedStartDate)
  if (!d) return;
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${sc.schedTitle}`;
  if (!schedMap[key]) schedMap[key] = [];
  schedMap[key].push(sc);
});

// docPrc 필터링 + schedMap 기준 개수 세기
const count = docPrc.filter(dd => 
  dd.aprvDocStts !== "PENDING" &&
  dd.docFormId === 7 &&
  dd.roleCd === "LAST_ATRZ" &&
  schedMap[`${year}-${month}-${dd.aprvDocTtl}`] // schedMap에 존재하면 true
).length;

console.log(schedMap);


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
    
    return (
        <div>
            <h1>인사관리</h1>
            <AttendanceRate emp={emp} />
            <TeamSchdule sched={sched}/>
            <DocPrcsTime docPrc={docPrc}/>
            <h2>교육 통계</h2>

            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="완료" fill="#82ca9d" isAnimationActive={true} />
                <Bar dataKey="대기" fill="#ca8282" isAnimationActive={true} />
                <Bar dataKey="반려" fill="#595959" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>

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
                        .filter(dd => dd.aprvDocStts != "PENDING" && dd.docFormId == 7)
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

export default HrDashboard;