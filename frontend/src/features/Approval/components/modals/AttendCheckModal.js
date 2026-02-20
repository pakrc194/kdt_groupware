import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';
import AttendContent from '../AttendContent';


const AttendCheckModal = ({ onClose, onOk, docRole, drftDate, ids }) => {
    const [attendList, setAttendList] = useState([]);
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);
    const [deptSchedList, setDeptSchedList] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

    // 1. 초기값 설정 시 props로 받은 ids를 우선 사용
    const [idList, setIdList] = useState(ids && ids.length > 0 ? ids : [myInfo?.empId]);

    // 2. 무한 루프 방지: ids의 내용물이 실제로 변했을 때만 업데이트
    useEffect(() => {
        if (ids && ids.length > 0) {
            // 현재 idList와 새로 들어온 ids를 문자열로 비교 (참조값 비교 방지)
            if (JSON.stringify(ids) !== JSON.stringify(idList)) {
                setIdList(ids);
            }
        }
    }, [ids, idList]); 

    // 3. API 호출 로직
    useEffect(() => {
        if (!idList || idList.length === 0 || !drftDate?.docStart) return;

        const start = drftDate.docStart.replaceAll("-", "");
        const end = drftDate.docEnd.replaceAll("-", "");
        const year = drftDate.docStart.substring(0, 4) || "2026";

        // API 호출들을 변수에 담아 관리 (가독성)
        const fetchAllData = async () => {
            try {
                // 연차
                const annlRes = await fetcher("/gw/aprv/AprvEmpAnnlLv", {
                    method: "POST",
                    body: { ids: idList, year: year }
                });
                setAttendList(annlRes || []);

                // 근태
                const dutyRes = await fetcher("/gw/aprv/AprvDutyScheDtl", {
                    method: "POST",
                    body: { ids: idList, docStart: start, docEnd: end }
                });
                setDutyList(dutyRes || []);

                // 일정
                const schedRes = await fetcher("/gw/aprv/AprvSchedList", {
                    method: "POST",
                    body: { ids: idList, docStart: start, docEnd: end }
                });
                setSchedList(schedRes || []);

                // 부서 일정
                const deptSchedRes = await fetcher("/gw/aprv/AprvSchedList", {
                    method: "POST",
                    body: { role:"DEPT", ids: [myInfo.deptId], docStart: start, docEnd: end }
                });
                setDeptSchedList(deptSchedRes || []);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };

        fetchAllData();

    }, [idList, drftDate.docStart, drftDate.docEnd]); // 날짜 객체 전체 대신 특정 값만 감시

    return (
        <Modal
            title={`기간 확인`}
            message={
                <>
                <AttendContent 
                    docRole={docRole}
                    idList={idList} 
                    attendList={attendList} 
                    dutyList={dutyList} 
                    schedList={schedList} 
                    drftDate={drftDate}
                />
                <AttendContent 
                    docRole={"DEPT"}
                    idList={[myInfo.deptId]} 
                    schedList={deptSchedList} 
                    drftDate={drftDate}
                />
                </>
            }
            onClose={onClose}
            onOk={onOk}
            okMsg={"확인"}
        />
    );
};

export default AttendCheckModal;
