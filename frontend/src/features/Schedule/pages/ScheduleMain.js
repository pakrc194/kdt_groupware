import React, { useEffect, useState } from 'react';

import { Outlet, useParams } from 'react-router-dom';
import Instruction from './Instruction';
import ScheduleView from './ScheduleView';
import { fetcher } from '../../../shared/api/fetcher';

function ScheduleMain(props) {

    const { sideId } = useParams();
    const [empInfo, setEmpInfo] = useState([]);

    // 권한 상태 관리

    useEffect(()=>{
            localStorage.setItem("EMP_ID", "1")
            
            // 사용자 정보 가져오기
            fetcher(`/gw/home/1/schedule/empinfo/${localStorage.getItem("EMP_ID")}`)
            .then(data => {
                setEmpInfo(data);
                
                console.log(data)
                localStorage.setItem("EMP_NM", data.empNm)
                localStorage.setItem("DEPT_ID", data.deptId)        // 소속 팀 ID
                localStorage.setItem("DEPT_NAME", data.deptName)
                localStorage.setItem("JBTTL_ID", data.jbttlId)       // 직책 ID
                localStorage.setItem("USER_ROLE", data.deptCode)  // TEAM_USER - 팀만 선택 가능, CP - 팀, 회사 선택 가능
                localStorage.setItem("EMP_SN", data.empSn)
            })
            .catch(err => console.error('유저 정보 로딩 실패', err));
        },[])

    const renderContent = () => {
        switch(sideId) {
            case 'check':
                return <ScheduleView />
            case 'instruction':
                return <Instruction EmpInfo={empInfo} />
        }
    }

    return (
        <div className='orgchart-container'>
            <div className='org-content-area'>
                {renderContent()}
            </div>
        </div>
    );
}

export default ScheduleMain;