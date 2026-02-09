import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import Instruction from './Instruction';
import ScheduleView from './ScheduleView';
import { fetcher } from '../../../shared/api/fetcher';

function ScheduleMain(props) {

    const { sideId } = useParams();
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    // 권한 상태 관리

    useEffect(()=>{
            localStorage.setItem("EMP_ID", "1")
            console.log("useEffect", myInfo) 
            // 사용자 정보 가져오기
            fetcher(`/gw/schedule/empinfo/${localStorage.getItem("EMP_ID")}`)
            .then(data => {
                
                localStorage.setItem("EMP_NM", data.EMP_NM)
                localStorage.setItem("DEPT_ID", data.DEPT_ID)        // 소속 팀 ID
                localStorage.setItem("JBTTL_ID", data.JBTTL_ID)       // 직책 ID
                localStorage.setItem("EMP_SN", data.EMP_SN)
                localStorage.setItem("DEPT_NAME", data.DEPT_NAME)
                localStorage.setItem("USER_ROLE", data.DEPT_CODE)  // TEAM_USER - 팀만 선택 가능, CP - 팀, 회사 선택 가능
                
            })
            .catch(err => console.error('유저 정보 로딩 실패', err));
        },[])
        
    const renderContent = () => {
        switch(sideId) {
            case 'check':
                return <ScheduleView />
            case 'instruction':
                return <Instruction />
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