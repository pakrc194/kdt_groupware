import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { format, getDay, parse, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetcher } from '../../../shared/api/fetcher';

function ScheduleCalendar(props) {
    const [apiData, setApiData] = useState([]);
    const [date, setDate] = useState();
    // const [year, setYear] = useState();
    // const [month, setMonth] = useState();
    // const [day, setDay] = useState();
    const navigate = useNavigate();
    const defaultDate = new Date();

    // 현재 화면 날짜 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    

    const yyyy = currentDate.getFullYear();

    // 한 달 시작일과 마지막일
    const monthStart = new Date(yyyy, currentDate.getMonth(), 1);
    const monthEnd = new Date(yyyy, currentDate.getMonth() + 1, 0);
    const formattedStart = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
    const formattedEnd = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;


    // fetch로 보낼 데이터
    const dept_id = localStorage.getItem("DEPT_ID")
    const emp_id = localStorage.getItem("EMP_ID")

    

    // 버튼 핸들러
    const goToday = () => {setCurrentDate(new Date()); props.sDate(new Date());};
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
        .then(dd => setApiData(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, [date, props.todo[0], currentDate]);

    // const eventStyleGetter = (event) => {
    //     let backgroundColor = '#3174ad'; // 기본

    //     switch (event.type) {
    //         case 'COMPANY':
    //         backgroundColor = '#e74c3c'; // 빨강
    //         break;
    //         case 'DEPT':
    //         backgroundColor = '#3498db'; // 파랑
    //         break;
    //         case 'PERSONAL':
    //         backgroundColor = '#2ecc71'; // 초록
    //         break;
    //         default:
    //         backgroundColor = '#95a5a6'; // 회색
    //     }

    //     return {
    //         style: {
    //         backgroundColor,
    //         borderRadius: '6px',
    //         color: 'white',
    //         border: 'none',
    //         padding: '2px 6px',
    //         },
    //     };
    // };

    const locales = {
        ko: ko
    };
    const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

    const events = apiData.map(e => (
        {
        id : e.schedId,
        title: e.schedTitle,
        start: new Date(e.schedStartDate),
        end: addDays(new Date(e.schedEndDate), 1),
        type: e.schedType
    }));

    const handleSelectEvent = (event) => {
        navigate(`/schedule/check/calendar/detail/${event.id}`);
    };

    const eventStyleGetter = (event) => {
        const colors = {
            COMPANY: '#e74c3c',
            DEPT: '#3498db',
            PERSONAL: '#2ecc71'
        };

        return {
            style: {
                backgroundColor: colors[event.type] || '#95a5a6',
                borderRadius: '6px',
                color: '#fff',
                border: 'none',
                padding: '2px 6px',
                fontSize: '12px'
            }
        };
    };
    

    return (
        <div style={styles.wrapper}>
        
        <div className='calendar' style={{ position: 'fixed', marginLeft: "350px" }}>
            <div  style={styles.header}>
                <button style={styles.navBtn} onClick={goPrev}>◀</button>
                <span style={styles.title}>{currentDate.getFullYear()}년 {currentDate.getMonth()+1}월</span>
                <button style={styles.navBtn} onClick={goToday}>오늘</button>
                <button style={styles.navBtn} onClick={goNext}>▶</button>
            </div>
            <div style={styles.calendarCard}>
                <Calendar
                    defaultDate={defaultDate}
                    localizer={localizer}
                    events={events}
                    startAccessor='start'
                    endAccessor='end'
                    step={15}
                    style={{ height: '80vh', width: '60vw' }}
                    timeslots={4}
                    views={'month'}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleSelectEvent}
                    date={currentDate}            // 👈 현재 화면 날짜 제어
                    onNavigate={setCurrentDate}   // 👈 직접 이동 시 상태 업데이트
                    toolbar={false}
                    selectable               // 👈 꼭 필요
                    onSelectSlot={(slotInfo) => {
                        props.sDate(slotInfo.start);
                        setDate(slotInfo.start);
                    }}
                />
            </div>
        </div>
        </div>
    );
}

const styles = {
    wrapper: {
        padding: '0 20px',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
    },
    title: {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '0 8px'
    },
    navBtn: {
        padding: '6px 10px',
        border: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    calendarCard: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }
};

export default ScheduleCalendar;