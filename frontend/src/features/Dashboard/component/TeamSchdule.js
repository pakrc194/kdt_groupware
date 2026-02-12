import React from 'react';

function TeamSchdule({sched}) {
    const cnt = sched.length;

    return (
        <div>
            <h3>팀 일정 {cnt}개</h3>
            <table>
                <tbody>
                    <tr>
                        <td>제목</td>
                        <td>시작날짜</td>
                        <td>종료날짜</td>
                        <td>상세</td>
                        <td>위치</td>
                    </tr>
                    {sched.map(dd => (
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