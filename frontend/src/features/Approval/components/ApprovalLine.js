import React from 'react';
import './ApprovalLine.css'
const ApprovalLine = ({docLine}) => {
    const roleMap = {
        DRFT : "기안자",
        DRFT_REF : "참조자",
        MID_ATRZ : "중간 결재자",
        MID_REF : "중간 참조자",
        LAST_ATRZ : "최종 결재자"
    }


    return (
        <>
            <div className='approvalLine'>
                {docLine.map((v, k)=>{
                    return <div className='empInfo' key={k}>
                        <div>{roleMap[v.roleCd]}</div>
                        <div>{v.aprvPrcsEmpNm}</div>
                    </div>
                })}
            </div>
        </>
    );
};

export default ApprovalLine;