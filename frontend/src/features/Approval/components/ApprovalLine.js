import React from 'react';
import './ApprovalLine.css'
const ApprovalLine = ({drafter, firstRef, midApprover, secondRef, finApproval}) => {
    return (
        <>
            <div className='approvalLine'>
                <div className='empInfo'>
                    <div>기안자</div>
                    <div>{drafter}</div>
                </div>
                <div className='empInfo'>
                    <div>참조자</div>
                    <div>{firstRef}</div>
                </div>
                <div className='empInfo'>
                    <div>중간 결재자</div>
                    <div>{midApprover}</div>
                </div>
                <div className='empInfo'>
                    <div>중간 참조자</div>
                    <div>{secondRef}</div>
                </div>
                <div className='empInfo'>
                    <div>최종 결재자</div>
                    <div>{finApproval}</div>
                </div>
            </div>
        </>
    );
};

export default ApprovalLine;