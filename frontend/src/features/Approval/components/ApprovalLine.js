import React, { useEffect } from 'react';
import './ApprovalLine.css'
import { getAprvLineMap } from '../../../shared/func/formatLabel';
const ApprovalLine = ({docLine}) => {
    useEffect(()=>{
        if(!docLine) return;

        console.log(docLine)
    },[docLine])


    return (
        <>
            <div className='approvalLine'>
                {docLine.map((v, k)=>{
                    return <div className='empInfo' key={k}>
                        <div>{getAprvLineMap(v.roleCd)}</div>
                        <div>{v.aprvPrcsEmpNm}</div>
                    </div>
                })}
            </div>
        </>
    );
};

export default ApprovalLine;