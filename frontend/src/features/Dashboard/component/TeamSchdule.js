import React from 'react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

function TeamSchdule({sched}) {
    const cnt = sched.length;

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

        "일정":sched.filter(dd => new Date(dd.schedStartDate).getFullYear() == year && new Date(dd.schedStartDate).getMonth() + 1 == month).length,
    }));

    return (
        <div>
            <h3>팀 일정 {cnt}개</h3>
            <BarChart style={{ width: '100%', maxWidth: '1000px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="일정" fill="#82ca9d" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>
            <table>
                <tbody>
                    <tr>
                        <td>제목</td>
                        <td>시작날짜</td>
                        <td>종료날짜</td>
                        <td>상세</td>
                        <td>위치</td>
                    </tr>
                    {sched.sort((a, b) =>
                    new Date(b.schedStartDate) - new Date(a.schedStartDate))
                    .map(dd => (
                        <tr>
                            <td>{dd.schedTitle}</td>
                            <td>{dd.schedStartDate.split(" ")[0]}</td>
                            <td>{dd.schedEndDate.split(" ")[0]}</td>
                            <td>{dd.schedDetail}</td>
                            <td>{dd.locNm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeamSchdule;