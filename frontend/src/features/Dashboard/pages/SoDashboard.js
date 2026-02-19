import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AttendanceRate from '../component/AttendanceRate';
import TeamSchdule from '../component/TeamSchdule';
import DocPrcsTime from '../component/DocPrcsTime';
import { TimeDiff } from '../component/TimeDiff';
import { getStatusLabel } from '../../../shared/func/formatLabel';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { formatToYYMMDD } from '../../../shared/func/formatToDate';

function SoDashboard(props) {
    const [emp, setEmp] = useState([]);
    const [sched, setSched] = useState([]);
    const [docPrc, setDocPrc] = useState([]);

    const date = new Date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    
    const formatted = `${yyyy}-${mm}-${dd}`;

    useEffect(() => {
        // 팀 근태
        fetcher(`/gw/dashboard/dashTeamEmpList?dept=8&date=${formatted}`)
        .then(dd => { setEmp(Array.isArray(dd) ? dd : [dd]) })

        // 팀 일정
        fetcher(`/gw/dashboard/dashTeamSchedList?dept=8`)
        .then(dd => { setSched(Array.isArray(dd) ? dd : [dd])
         })

        // 결재 속도
        fetcher('/gw/dashboard/docPrcsTime?dept=8')
        .then(dd => {setDocPrc(Array.isArray(dd) ? dd : [dd])
        })
    }, [])

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
      "순찰": docPrc
        .filter(dd =>
            dd.aprvDocStts === "COMPLETED" &&
            dd.docFormId === 10 &&
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
    
    return (
        <div>
           <h1>안전관리</h1>
           <AttendanceRate emp={emp} />
            <TeamSchdule sched={sched}/>
            <DocPrcsTime docPrc={docPrc}/>

            <h2>순찰</h2>

            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="순찰" fill="#82ca9d" isAnimationActive={true} />
                {/* <Bar dataKey="대기" fill="#ca8282" isAnimationActive={true} /> */}
                {/* <Bar dataKey="반려" fill="#595959" isAnimationActive={true} /> */}
                {/* <RechartsDevtools /> */}
            </BarChart>

            <table style={styles.table}>
                <thead>
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
                    {docPrc.length > 0 ? (
                        docPrc
                        .filter(dd => dd.aprvDocStts != "PENDING" && dd.docFormId == 10)
                        .filter(dd => dd.roleCd == "LAST_ATRZ")
                        .map((dd, index) => (
                            <tr key={index}>
                                <td style={styles.td}>{dd.aprvDocTtl}</td>
                                <td style={styles.td}>{getStatusLabel(dd.aprvDocStts)}</td>
                                <td style={styles.td}>{dd.drftEmpNm}</td>
                                <td style={styles.td}>
                                    {dd.aprvDocDrftDt ? formatToYYMMDD(dd.aprvDocDrftDt) : '미정'}
                                </td>
                                <td style={styles.td}>{dd.aprvPrcsEmpNm}</td>
                                <td style={styles.td}>
                                    {dd.aprvPrcsDt ? formatToYYMMDD(dd.aprvPrcsDt) : '미승인'}
                                </td>
                                <td style={styles.td}>{dd.docFormNm}</td>
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

export default SoDashboard;