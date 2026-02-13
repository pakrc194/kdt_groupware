import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

import React from 'react';

function CompanyDashboardGraph({inOut, emp}) {
    const active = inOut.filter((d) => d.empAcntStts != "RETIRED");
    const retired = inOut.filter((d) => d.empAcntStts == "RETIRED");

    const currentYear = new Date().getFullYear();
    console.log(active.filter(dd => new Date(dd.empJncmpYmd).getFullYear() == currentYear).length)
        
    // 최근 5년 배열 생성
    const recentYears = Array.from({ length: 10 }, (_, i) => currentYear - 9 + i);
    
    const data = recentYears.map((year) => ({
        name: `${year}년`,
        // "입사": Math.floor(Math.random() * 5000),
        "입사": active.filter(dd => new Date(dd.empJncmpYmd).getFullYear() == year).length,
        "퇴사": retired.filter(dd => new Date(dd.empRsgntnYmd).getFullYear() == year).length,
        amt: Math.floor(Math.random() * 5000),
    }));

    const present = emp.filter((dd) => dd.atdcSttsCd === "PRESENT").length;
    const absent = emp.filter((dd) => dd.atdcSttsCd === "ABSENT").length;
    const businessTrip = emp.filter((dd) => dd.atdcSttsCd === "BUSINESS_TRIP").length;
    const off = emp.filter((dd) => dd.atdcSttsCd === "OFF").length;
    const leave = emp.filter((dd) => dd.atdcSttsCd === "LEAVE").length;
    
    const now = new Date();

    // 최근 7일 배열 생성 (오늘 포함)
    const recentDays = Array.from({ length: 1 }, (_, i) => {
        const date = new Date();
        // date.setDate(now.getDate() - 6 + i); // 6일 전부터 오늘까지
        return new Date(date);
    }); 


    const attendData = recentDays.map((date) => ({
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        "출근": present,
        "결근": absent,
        "출장": businessTrip,
        "휴무": off,
        "연차": leave,
    }));

    const deptOrder = ["지점장", "식품", "뷰티·패션잡화", "여성패션", "남성패션", "인사관리", "시설자재", "안전관리"];
    const activeList = inOut.filter( data => data.empAcntStts === "ACTIVE" );
    const newList = inOut.filter( data => data.empAcntStts === "초기" );
    
    const orgData = deptOrder.map((data) => ({
        name: data,
        "재직": activeList.filter(dd => deptOrder[dd.deptId - 1] == data).length,
        "신규": newList.filter(dd => deptOrder[dd.deptId - 1] == data).length,
    }));


    return (
        <div>
            <h1>인사변동 통계</h1>
             <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="입사" fill="#82ca9d" isAnimationActive={true} />
                <Bar dataKey="퇴사" fill="#ca8282" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>
            <h1>근태 통계</h1>
            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={attendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="출근" fill="#82ca9d" isAnimationActive={true} />
                <Bar dataKey="결근" fill="#ca8282" isAnimationActive={true} />
                <Bar dataKey="출장" fill="#ca79c3" isAnimationActive={true} />
                <Bar dataKey="휴무" fill="#595959" isAnimationActive={true} />
                <Bar dataKey="연차" fill="#5a5de2" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>
            <h1>회사 조직 통계</h1>
            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={orgData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="재직" fill="#82ca9d" isAnimationActive={true} />
                <Bar dataKey="신규" fill="#5a5de2" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>
        </div>
    );
}

export default CompanyDashboardGraph;