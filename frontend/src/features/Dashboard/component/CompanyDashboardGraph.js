import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import React from 'react';

function CompanyDashboardGraph({ inOut, emp, approval }) {

    const active = inOut.filter((d) => d.empAcntStts != "RETIRED");
    const retired = inOut.filter((d) => d.empAcntStts == "RETIRED");

    const currentYear = new Date().getFullYear();
    const recentYears = Array.from({ length: 10 }, (_, i) => currentYear - 9 + i);

    const data = recentYears.map((year) => ({
        name: `${year}년`,
        "입사": active.filter(dd => new Date(dd.empJncmpYmd).getFullYear() == year).length,
        "퇴사": retired.filter(dd => new Date(dd.empRsgntnYmd).getFullYear() == year).length,
    }));

    const present = emp.filter((dd) => dd.atdcSttsCd === "PRESENT").length;
    const absent = emp.filter((dd) => dd.atdcSttsCd === "ABSENT").length;
    const businessTrip = emp.filter((dd) => dd.atdcSttsCd === "BUSINESS_TRIP").length;
    const off = emp.filter((dd) => dd.atdcSttsCd === "OFF").length;
    const leave = emp.filter((dd) => dd.atdcSttsCd === "LEAVE").length;

    const attendData = [{
        name: "오늘",
        "출근": present,
        "결근": absent,
        "출장": businessTrip,
        "휴무": off,
        "연차": leave,
    }];

    const deptOrder = ["지점장", "식품", "뷰티·패션", "여성패션", "남성패션", "인사관리", "시설자재", "안전관리"];
    const activeList = inOut.filter(data => data.empAcntStts === "ACTIVE");
    const newList = inOut.filter(data => data.empAcntStts === "초기");

    const orgData = deptOrder.map((data) => ({
        name: data,
        "재직": activeList.filter(dd => deptOrder[dd.deptId - 1] == data).length,
        "신규": newList.filter(dd => deptOrder[dd.deptId - 1] == data).length,
    }));

    const parseDateTime = (str) => {
        return new Date(
            str.substring(0, 4),
            str.substring(4, 6) - 1,
            str.substring(6, 8),
            str.substring(8, 10),
            str.substring(10, 12),
            str.substring(12, 14)
        );
    };

    const docPrcs = deptOrder.map((data) => ({
        name: data,
        "기안": approval.filter(dd =>
            deptOrder[dd.deptId - 1] == data &&
            parseDateTime(dd.aprvDocDrftDt).getFullYear() == currentYear
        ).length,
        "완료": approval.filter(dd =>
            deptOrder[dd.deptId - 1] == data &&
            parseDateTime(dd.aprvDocDrftDt).getFullYear() == currentYear &&
            dd.aprvDocStts !== "PENDING"
        ).length
    }));

    return (
        <div>
            <div style={styles.grid}>

                <div style={styles.card}>
                    <h3>인사변동 통계</h3>
                    <BarChart style={{ width: '90%', height: '70%', aspectRatio: 1.618 }} responsive data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="입사" fill="#82ca9d" />
                        <Bar dataKey="퇴사" fill="#ca8282" />
                    </BarChart>
                </div>

                <div style={styles.card}>
                    <h3>근태 통계</h3>
                    <BarChart style={{ width: '90%', height: '70%', aspectRatio: 1.618 }} responsive data={attendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="출근" fill="#82ca9d" />
                        <Bar dataKey="결근" fill="#ca8282" />
                        <Bar dataKey="출장" fill="#ca79c3" />
                        <Bar dataKey="휴무" fill="#595959" />
                        <Bar dataKey="연차" fill="#5a5de2" />
                    </BarChart>
                </div>

                <div style={styles.card}>
                    <h3>회사 조직 통계</h3>
                    <BarChart style={{ width: '90%', height: '70%', aspectRatio: 1.618 }} responsive data={orgData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="재직" fill="#82ca9d" />
                        <Bar dataKey="신규" fill="#5a5de2" />
                    </BarChart>
                </div>

                <div style={styles.card}>
                    <h3>{currentYear}년도 결재 현황</h3>
                    <BarChart style={{ width: '90%', height: '70%', aspectRatio: 1.618 }} responsive data={docPrcs}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="기안" fill="#82ca9d" />
                        <Bar dataKey="완료" fill="#5a5de2" />
                    </BarChart>
                </div>

            </div>
        </div>
    );
}

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr", // 2개씩 배치
        gap: 24,
    },
    card: {
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        width: '90%',
        height: '300px'
    }
};

export default CompanyDashboardGraph;
