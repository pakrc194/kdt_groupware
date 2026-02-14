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

    const [sched, setSched] = useState([]);

    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    // fetch로 보낼 데이터
    const dept_id = myInfo.deptId;
    const emp_id = myInfo.empId;

    
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


    

    

    // 한 달의 날짜 배열 생성
    let daysInMonth = [];
    for (let d = 1; d <= monthEnd.getDate(); d++) {
        const dayStr = `${yyyy}-${mm}-${String(d).padStart(2,'0')}`;
        daysInMonth.push(dayStr);
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
        <div style={styles.wrapper}>
        <div style={styles.header}>
            <button style={styles.navBtn} onClick={goPrev}>◀</button>
            <span style={styles.title}>{currentDate.getFullYear()}년 {currentDate.getMonth()+1}월</span>
            <button style={styles.navBtn} onClick={goToday}>오늘</button>
            <button style={styles.navBtn} onClick={goNext}>▶</button>
        </div>

        {/* 날짜별 일정 */}
            {scheduleDates.map((day, idx) => (
                <div key={idx} style={styles.dayCard}>
                    <h4
                        style={styles.dayTitle}
                        onClick={() => props.sDate(new Date(day))}
                    >
                        {day}
                    </h4>

                    {sched
                        .filter(item => {
                            const start = item.schedStartDate.split(' ')[0];
                            const end = item.schedEndDate.split(' ')[0];
                            return day >= start && day <= end;
                        })
                        .map((vv, kk) => (
                            <div key={kk} style={styles.itemBox}>
                                <div><b>제목</b> {vv.schedTitle}</div>
                                <div><b>구분</b> {vv.schedType}</div>
                                <div><b>위치</b> {vv.schedLoc || '-'}</div>
                                <div><b>상세</b> {vv.schedDetail || '-'}</div>
                                <div style={styles.dateRange}>
                                    {vv.schedStartDate?.split(' ')[0]} ~ {vv.schedEndDate?.split(' ')[0]}
                                </div>
                            </div>
                        ))}
                </div>
            ))}

        
        </div>
    );
}

const styles = {
    wrapper: {
        marginLeft: '350px',
        padding: '0 20px',
        // width: '800px',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px'
    },
    title: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    navBtn: {
        padding: '6px 10px',
        border: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    dayCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    dayTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        cursor: 'pointer'
    },
    itemBox: {
        padding: '10px',
        borderBottom: '1px solid #eee',
        fontSize: '14px'
    },
    dateRange: {
        marginTop: '4px',
        color: '#666',
        fontSize: '13px'
    }
};

export default ScheduleList;