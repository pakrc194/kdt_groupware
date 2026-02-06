import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
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
    

    const yyyy = defaultDate.getFullYear();

    // 한 달 시작일과 마지막일
    const monthStart = new Date(yyyy, defaultDate.getMonth(), 1);
    const monthEnd = new Date(yyyy, defaultDate.getMonth() + 1, 0);
    const formattedStart = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
    const formattedEnd = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;


    // fetch로 보낼 데이터
    const dept_id = localStorage.getItem("DEPT_ID")
    const emp_sn = localStorage.getItem("EMP_SN")
    const emp_id = localStorage.getItem("EMP_ID")
    useEffect(() => {
        fetcher(`/gw/schedule/view/${formattedStart}/${formattedEnd}/${dept_id}/${emp_id}`)
        .then(dd => setApiData(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, [date, props.todo[0]]);

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad'; // 기본

        switch (event.type) {
            case 'COMPANY':
            backgroundColor = '#e74c3c'; // 빨강
            break;
            case 'DEPT':
            backgroundColor = '#3498db'; // 파랑
            break;
            case 'PERSONAL':
            backgroundColor = '#2ecc71'; // 초록
            break;
            default:
            backgroundColor = '#95a5a6'; // 회색
        }

        return {
            style: {
            backgroundColor,
            borderRadius: '6px',
            color: 'white',
            border: 'none',
            padding: '2px 6px',
            },
        };
    };

    const locales = {
        ko: ko
    };
    const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

    const events = apiData.map(e => (
        {
        id : e.schedId,
        title: e.schedTitle,
        start: new Date(e.schedStartDate),
        end: new Date(e.schedEndDate),
        type: e.schedType
    }));

    const handleSelectEvent = (event) => {
        // event === 클릭한 일정 객체
        navigate(`/schedule/check/calendar/detail/${event.id}`);
    };

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

    return (
        <div>
        
        <div className='calendar' style={{ position: 'fixed', marginLeft: "350px" }}>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={goPrev}>이전달</button>
                <span>{currentDate.getFullYear()}년 {currentDate.getMonth()+1}월</span>
                <button onClick={goToday}>오늘</button>
                <button onClick={goNext}>다음달</button>
            </div>
            <div style={{ height: '85vh' }}>
            <Calendar
                defaultDate={defaultDate}
                localizer={localizer}
                events={events}
                startAccessor='start'
                endAccessor='end'
                step={15}
                style={{ height: '100%', width: '1000px' }}
                timeslots={4}
                views={'month'}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                date={currentDate}            // 👈 현재 화면 날짜 제어
                onNavigate={setCurrentDate}   // 👈 직접 이동 시 상태 업데이트
                toolbar={false}
                selectable               // 👈 꼭 필요
                onSelectSlot={(slotInfo) => {
                    console.log('선택한 날짜/시간 범위:', slotInfo.start);
                    props.sDate(slotInfo.start);
                    setDate(slotInfo.start);
                }}
            />
        </div>
        </div>
        </div>
    );
}
export default ScheduleCalendar;