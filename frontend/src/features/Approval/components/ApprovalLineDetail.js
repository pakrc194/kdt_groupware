import React from 'react';
import './ApprovalLine.css';
import { formatToYYMMDD } from '../../../shared/func/formatToDate';

const ApprovalLineDetail = ({ aprvLine, myInfo, setSelectedEmp, setOpenModal }) => {
    
    if (!aprvLine || aprvLine.length === 0) {
        return <div>결재선 정보를 불러오는 중...</div>;
    }

    const roleMap = {
        DRFT: "기안자",
        DRFT_REF: "참조자",
        MID_ATRZ: "중간 결재자",
        MID_REF: "중간 참조자",
        LAST_ATRZ: "최종 결재자"
    };

    return (
        <div className='aprv-stamp-line'>
            {aprvLine.map((v, k) => {
                const isDone = v.aprvPrcsDt != null && v.aprvPrcsDt !== "";
                const isRejected = v.aprvPrcsStts === "REJECTED";

                let typeClass = "";
                if (v.roleCd.includes("REF")) typeClass = "type-ref";
                else if (v.roleCd.includes("ATRZ")) typeClass = "type-atrz";
                else typeClass = "type-drft";

                return (
                    <div 
                        className={`aprv-stamp-item ${typeClass} ${isDone ? 'is-done' : ''} ${isRejected ? 'is-rejected' : ''}`} 
                        key={k}
                    >
                        <div className="aprv-stamp-role">
                            {roleMap[v.roleCd]}
                        </div>
                        
                        <div 
                            className="aprv-stamp-name" 
                            onClick={() => {
                                // 본인이고 아직 결재 전이라면 부모 상태 업데이트하여 모달 띄움
                                if (v.aprvPrcsEmpId == myInfo.empId && !isDone) {
                                    setSelectedEmp(v);
                                    setOpenModal(v.roleCd);
                                }
                            }}
                            style={{ cursor: (v.aprvPrcsEmpId == myInfo.empId && !isDone) ? 'pointer' : 'default' }}
                        >
                            {v.aprvPrcsEmpNm}
                        </div>

                        <div className="aprv-stamp-date">
                            {v.aprvPrcsDt ? formatToYYMMDD(v.aprvPrcsDt) : ""}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ApprovalLineDetail;