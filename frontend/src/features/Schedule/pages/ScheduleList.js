import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
function ScheduleList(props) {

    // 현재 화면 날짜 상태
    const [currentDate, setCurrentDate] = useState(new Date());
     // 한 달 시작일과 마지막일
     const [date, setDate] = useState(currentDate);
    let yyyy = date.getFullYear();
    let mm = String(date.getMonth() + 1).padStart(2, '0');
    const monthStart = new Date(yyyy, currentDate.getMonth(), 1);
    const monthEnd = new Date(yyyy, currentDate.getMonth() + 1, 0);
    const formattedStart = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
    const formattedEnd = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;

    
    // 버튼 핸들러
    const goToday = () => {setCurrentDate(new Date()); props.sDate(new Date())};
    const goPrev = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
        console.log('이전달 '+currentDate)
    };
    const goNext = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextMonth);
        console.log('다음달 '+currentDate)
        
    };
    
    useEffect(() => {
        fetcher(`/gw/schedule/view/${formattedStart}/${formattedEnd}/${dept_id}/${emp_id}`)
        // fetcher(`/gw/schedule/view/${dept_id}/${emp_id}`)
        .then(dd => {setSched(Array.isArray(dd) ? dd : [dd])
        })
        .catch(e => console.log(e))

        setDate(currentDate)
    }, [date, currentDate, props.todo]);

    
    


    // 한 달 시작일과 마지막일
    // let monthEnd = new Date(yyyy, date.getMonth() + 1, 0);


    const [sched, setSched] = useState([]);

    // fetch로 보낼 데이터
    const dept_id = localStorage.getItem("DEPT_ID")
    const emp_id = localStorage.getItem("EMP_ID")

    

    // 한 달의 날짜 배열 생성
    let daysInMonth = [];
    for (let d = 1; d <= monthEnd.getDate(); d++) {
        const dayStr = `${yyyy}-${mm}-${String(d).padStart(2,'0')}`;
        daysInMonth.push(dayStr);
        console.log(mm)
    }

    // 일정 있는 날짜만 필터링
    const scheduleDates = daysInMonth
    .filter(day => 
        sched.some(s => {
            const start = s.schedStartDate.split(' ')[0];
            const end = s.schedEndDate.split(' ')[0];
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
                                    let start = item.schedStartDate.split(' ')[0];
                                    let end = item.schedEndDate.split(' ')[0];
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
                                        <hr/>
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