import React from 'react';
import './ApprovalLine.css'
const ApprovalLine = ({docLine}) => {
    const empNm = localStorage.getItem("EMP_NM")

    return (
        <>
            <div className='approvalLine'>
                {docLine.map((v, k)=>{
                    return <div className='empInfo' key={k}>
                        <div>{v.roleCd}</div>
                        <div>{v.aprvPrcsEmpId}</div>
                    </div>
                })}
            </div>
        </>
    );
};

export default ApprovalLine;