import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import PersonnelChangeStats from '../compDasComponent/PersonnelchangeStats';
import OrganizationStatistics from '../compDasComponent/OrganizationStatistics';
import AccessDeletionHistory from '../compDasComponent/AccessDeletionHistory';
import ScheduleDeletionHistory from '../compDasComponent/ScheduleDeletionHistory';
import ApprovalProcessHistory from '../compDasComponent/ApprovalProcessHistory';
import CompAttendanceRate from '../component/CompAttendanceRate';
import CompanyDashboardGraph from '../component/CompanyDashboardGraph';

function CompDashboard(props) {
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));   // 로그인 정보
    const [accessCk, setAccessCk] = useState(0);
    const [inOut, setInOut] = useState([]); // 입사, 퇴사 기록
    const [changeEmpData, setChangeEmpData] = useState([]);
    const [deleteSchedLog, setDeleteSchedLog] = useState([]);
    const [accessDeleteList, setAccessDeleteList] = useState([]);
    const [approval, setApproval] = useState([]);
    const [emp, setEmp] = useState([]);


    const date = new Date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    
    const formatted = `${yyyy}-${mm}-${dd}`;


    useEffect(() => {
        // 권한 확인용
        fetcher(`/gw/orgChart/access?id=${myInfo.jbttlId}&type=JBTTL&section=DASHBOARD&accessId=14`)
        .then(dd => { setAccessCk(dd) })
        .catch(e => console.log(e))

        // 입사, 퇴사 정보
        fetcher(`/gw/dashboard/hrEmpList`)
        .then(dd => { setInOut(Array.isArray(dd) ? dd : [dd]) })
        .catch(e => console.log(e))

        // 승진, 팀 이동 정보
        fetcher(`/gw/dashboard/hrHistList`)
        .then(dd => { setChangeEmpData(Array.isArray(dd) ? dd : [dd]) })
        .catch(e => console.log(e))

        // 권한 삭제 이력
        fetcher('/gw/dashboard/accessDelete')
        .then(dd => { setAccessDeleteList(Array.isArray(dd) ? dd : [dd]) })
        .catch(err => console.error('권한 삭제 리스트 로딩 실패', err));

        // 일정 삭제 기록
        fetcher(`/gw/dashboard/deleteSchedLog`)
        .then(dd => { setDeleteSchedLog(Array.isArray(dd) ? dd : [dd]) })
        .catch(e => console.log(e))

        // 결재 처리 이력
        fetcher(`/gw/dashboard/aprvPrcs`)
        .then(dd => { setApproval(Array.isArray(dd) ? dd : [dd]) 
        })
        .catch(e => console.log(e))

        // 전체 근태
        fetcher(`/gw/dashboard/dashTeamEmpList?dept=0&date=${formatted}`)
        .then(dd => { setEmp(Array.isArray(dd) ? dd : [dd]); })
      }, [])

    return (
        <div>
            <h1>회사 대시보드</h1>
            <CompanyDashboardGraph inOut={inOut} emp={emp} approval={approval} />
            <CompAttendanceRate emp={emp} />
            <PersonnelChangeStats inOut={inOut} changeEmpData={changeEmpData} />
            <OrganizationStatistics inOut={inOut} />
            <AccessDeletionHistory accessDeleteList={accessDeleteList} />
            <ScheduleDeletionHistory deleteSchedLog={deleteSchedLog} />
            <ApprovalProcessHistory approval={approval} />
        </div>
    );
}

export default CompDashboard;