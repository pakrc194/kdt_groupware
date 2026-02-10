import React from 'react';
import './ApprovalLine.css'
const ApprovalLine = ({docLine}) => {

    return (
        <>
            <div className='approvalLine'>
                {docLine.map((v, k)=>{
                    return <div className='empInfo' key={k}>
                        <div>{v.roleCd}</div>
                        <div>{v.aprvPrcsEmpNm}</div>
                    </div>
                })}
            </div>
        </>
    );
};

export default ApprovalLine;