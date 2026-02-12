import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AttendanceRate from '../component/AttendanceRate';
import TeamSchdule from '../component/TeamSchdule';
import DocPrcsTime from '../component/DocPrcsTime';

function WfDashboard(props) {
    const [emp, setEmp] = useState([]);
    const [sched, setSched] = useState([]);
    const [docPrc, setDocPrc] = useState([]);

    const date = new Date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    
    const formatted = `${yyyy}-${mm}-${dd}`;

    useEffect(() => {
        // 팀 근태
        fetcher(`/gw/dashboard/dashTeamEmpList?dept=4&date=${formatted}`)
        .then(dd => { setEmp(Array.isArray(dd) ? dd : [dd]) })

        // 팀 일정
        fetcher(`/gw/dashboard/dashTeamSchedList?dept=4`)
        .then(dd => { setSched(Array.isArray(dd) ? dd : [dd])
            console.log(dd)
        })

        // 결재 속도
        fetcher('/gw/dashboard/docPrcsTime?dept=4')
        .then(dd => setDocPrc(Array.isArray(dd) ? dd : [dd]))
    }, [])
    
    return (
        <div>
            <h1>여성패션</h1>
            <AttendanceRate emp={emp} />
            <TeamSchdule sched={sched}/>
            <DocPrcsTime docPrc={docPrc}/>
        </div>
    );
}

export default WfDashboard;