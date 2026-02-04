import React, { useEffect, useState } from 'react';

import { Link, Outlet, useParams, Navigate } from 'react-router-dom';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleList from './ScheduleList';
import { fetcher } from '../../../shared/api/fetcher';

function ScheduleView(props) {

    const { view } = useParams();
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [sched, setSched] = useState([]);

    const setDate = (date) => {
        // console.log('날짜 선택됨'+date)
        setDefaultDate(date);
    }
    const date = defaultDate;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;

    const renderContent = () => {
        if (!view) {
            return <Navigate to="/schedule/check/calendar" replace />;
        }
        switch(view) {
            case 'calendar':
                return <ScheduleCalendar sDate={setDate} />
            case 'list':
                return <ScheduleList sDate={setDate}/>
        }
    }

    // 특정 날짜로 일정 받아와서 화면에 뿌리기
    useEffect(() => {
        fetcher(`/gw/home/1/sched_search/${formatted}`)
        .then(dd => setSched(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, [defaultDate]);


    return (
        <div>
        <div className='dailyboard-box' style={style.dailyboardBox}>
            <div align="center" className='dailyboard-date'>
                <h1>{defaultDate.getMonth()+1}월 {defaultDate.getDate()}일</h1>
            </div>
            <div className='button-box'>
                <Link to={`/schedule/check/calendar`}>캘린더</Link>
                <Link to={`/schedule/check/list`}>리스트</Link>
            </div>
            <div className='dailyboard-schedulelist'>
                {sched.map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    {/* <td>아이디</td>
                    <td>{vv.schedId}</td> */}
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
            ))}
                <div className='sche-comp'>
                    <h2>회사</h2>
                </div>
                <div className='sche-team'>
                    <h2>팀</h2>
                </div>
                <div className='sche-indiv'>
                    <h2>개인</h2>
                </div>
                <div className='sche-todo'>
                    <h2>TODO</h2>
                    <button>추가</button>
                </div>
            </div>
        </div>
        <Outlet />
            {renderContent()}
        </div>
    );
}

const style = {
    dailyboardBox: {border: "solid 1px #000", width: "300px", height: "85vh", align: "center", float: "left", marginRight: "30px"}
}

export default ScheduleView;