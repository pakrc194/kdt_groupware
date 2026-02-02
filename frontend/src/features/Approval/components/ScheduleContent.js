import React from 'react';
import ApprovalLine from './ApprovalLine';
import Button from '../../../shared/components/Button';

const ScheduleContent = () => {
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
                장소 선택<input type="text" /><Button variant='primary'>장소 선택</Button>
            </div>
            <div>
                공개 범위
                <input type="radio" />팀 
                <input type="radio" />회사
            </div>
        </>
    );
};

export default ScheduleContent;