import React from 'react';
import ApprovalLine from './ApprovalLine';
import Button from '../../../shared/components/Button';

const AttendanceContent = () => {
    return (
        <>
            <div>
                기간 선택 
                <input type="date" name="docStart"/>
                ~
                <input type="date" name="docEnd"/>
            </div>
            <div> 
                결재선 <Button>결재선 편집</Button>
                <ApprovalLine/>
            </div>
            <div>
                결재 내용<br/>
                <textarea/>
            </div>
        </>
    );
};

export default AttendanceContent;