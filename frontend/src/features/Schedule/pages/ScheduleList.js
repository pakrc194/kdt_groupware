import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
function ScheduleList(props) {

    // 현재 화면 날짜 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // 버튼 핸들러
    const goToday = () => {setCurrentDate(new Date()); props.sDate(new Date())};
    const goPrev = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
    };
    const goNext = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextMonth);
    };

    const date = currentDate;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const mm2 = String(date.getMonth() + 2).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const [sched, setSched] = useState([]);

    useEffect(() => {
        fetcher(`/gw/home/1/schedule`)
        .then(dd => setSched(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, [currentDate]);

    // 한 달 시작일과 마지막일
    const monthStart = new Date(yyyy, currentDate.getMonth(), 1);
    const monthEnd = new Date(yyyy, currentDate.getMonth() + 1, 0);

    // 한 달의 날짜 배열 생성
    const daysInMonth = [];
    for (let d = 1; d <= monthEnd.getDate(); d++) {
        const dayStr = `${yyyy}-${mm}-${String(d).padStart(2,'0')}`;
        daysInMonth.push(dayStr);
    }

    // 일정 있는 날짜만 필터링
    const scheduleDates = daysInMonth.filter(day => 
        sched.some(s => {
            const start = s.schedStartDate.split('T')[0];
            const end = s.schedEndDate.split('T')[0];
            return day >= start && day <= end;
        })
    );


    return (
        <>
        <div style={{ marginBottom: '10px' }}>
            <button onClick={goPrev}>이전달</button>
            <span>{currentDate.getFullYear()}년 {currentDate.getMonth()+1}월</span>
            <button onClick={goToday}>오늘</button>
            <button onClick={goNext}>다음달</button>
        </div>
        <div>
            <div>
                {scheduleDates.map((day, idx) => (
                    <div key={idx} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', marginLeft: "350px", width: "1000px" }}>
                        <h4><div onClick={() => props.sDate(new Date(day))}>{day}</div></h4>
                        
                        <table>
                            <tbody>
                            {sched
                                .filter(item => {
                                    const start = item.schedStartDate.split('T')[0];
                                    const end = item.schedEndDate.split('T')[0];
                                    return day >= start && day <= end; // 해당 날짜 일정만
                                })
                                .map((vv, kk) => (
                                    <React.Fragment key={kk}>
                                        <tr>
                                            <td>담당팀</td>
                                            <td>{vv.schedTeam}</td>
                                        </tr>
                                        <tr>
                                            <td>위치</td>
                                            <td>{vv.schedLoc}</td>
                                        </tr>
                                        <tr>
                                            <td>제목</td>
                                            <td>{vv.schedTitle}</td>
                                        </tr>
                                        <tr>    
                                            <td>구분</td>
                                            <td>{vv.schedType}</td>
                                        </tr>
                                        <tr>    
                                            <td>상세내용</td>
                                            <td>{vv.schedDetail}</td>
                                        </tr>
                                        <tr>    
                                            <td>시작일</td>
                                            <td>{vv.schedStartDate.split('T')[0]}</td>
                                        </tr>
                                        <tr>    
                                            <td>종료일</td>
                                            <td>{vv.schedEndDate.split('T')[0]}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            
            {/* {sched.filter(item => item.schedStartDate >= formattedStart && item.schedEndDate < formattedEnd).map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    <td>아이디</td>
                    <td>{vv.schedId}</td>
                </tr><tr>
                    <td>담당팀</td>
                    <td>{vv.schedTeam}</td>
                </tr><tr>
                    <td>위치</td>
                    <td>{vv.schedLoc}</td>
                </tr><tr>
                    <td>제목</td>
                    <td>{vv.schedTitle}</td>
                </tr><tr>    
                    <td>구분(회사, 팀, 개인, TODO)</td>
                    <td>{vv.schedType}</td>
                </tr><tr>    
                    <td>상세내용</td>
                    <td>{vv.schedDetail}</td>
                </tr><tr>    
                    <td>시작일</td>
                    <td>{vv.schedStartDate.split('T')[0]}</td>
                </tr><tr>    
                    <td>종료일</td>
                    <td>{vv.schedEndDate.split('T')[0]}</td>
                </tr>
                </tbody>
            ))} */}
        </div>
        </>
    );
}

export default ScheduleList;