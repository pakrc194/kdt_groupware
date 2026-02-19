import React, { useEffect, useRef, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AttendanceRate from '../component/AttendanceRate';
import TeamSchdule from '../component/TeamSchdule';
import DocPrcsTime from '../component/DocPrcsTime';
import EventBoothCnt from '../component/EventBoothCnt';
import { useParams } from 'react-router-dom';

function MfDashboard(props) {
    const [emp, setEmp] = useState([]);
    const [sched, setSched] = useState([]);
    const [docPrc, setDocPrc] = useState([]);

    const date = new Date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    
    const formatted = `${yyyy}-${mm}-${dd}`;

    const { refId } = useParams();
    const sectionRefs = useRef({});

    const moveTo = (key) => {
        sectionRefs.current[key]?.scrollIntoView({
        behavior: "smooth"
        });
    };

    useEffect(() => {
            moveTo(refId)
        }, [refId])

    useEffect(() => {
        // 팀 근태
        fetcher(`/gw/dashboard/dashTeamEmpList?dept=5&date=${formatted}`)
        .then(dd => { setEmp(Array.isArray(dd) ? dd : [dd]) })

        // 팀 일정
        fetcher(`/gw/dashboard/dashTeamSchedList?dept=5`)
        .then(dd => { setSched(Array.isArray(dd) ? dd : [dd])
         })

         // 결재 속도
                 fetcher('/gw/dashboard/docPrcsTime?dept=5')
                 .then(dd => setDocPrc(Array.isArray(dd) ? dd : [dd]))
    }, [])
    
    return (
        <div>
            <div ref={(el) => (sectionRefs.current["att"] = el)}></div>
            <h1>남성패션</h1>
            <AttendanceRate emp={emp} />
            <div ref={(el) => (sectionRefs.current["teamsched"] = el)}></div>
            <TeamSchdule sched={sched}/>
            <div ref={(el) => (sectionRefs.current["eventbooth"] = el)}></div>
            <EventBoothCnt docPrc={docPrc} sched={sched}/>
            <div ref={(el) => (sectionRefs.current["aprvlog"] = el)}></div>
            <DocPrcsTime docPrc={docPrc}/>
        </div>
    );
}


export default MfDashboard;