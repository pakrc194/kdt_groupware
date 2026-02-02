import React, { useState } from 'react';
import './ApprovalLine.css';
import Modal from '../../../shared/components/Modal';

const ApprovalLineDetail = ({aprvLine, drafter}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [aptzDate, setAptzDate] = useState();

    const fn_close = () => {
        setIsOpen(false);
    }
    const fn_name = () => {
        setIsOpen(true)
    }
    const fn_ok = () => {
        setIsOpen(false);
        const date = new Date().toISOString().slice(0, 10);
        setAptzDate(date)
    }

    return (
        <>
            <div className='approvalLine'>
                <div className='empInfo'>
                    <div>기안자</div>
                    <div>{drafter.empNm}</div>
                </div>
                {aprvLine.drftRefncEmp1Nm && <div className='empInfo'>
                    <div>참조자</div>
                    <div onClick={fn_name}>{aprvLine.drftRefncEmp1Nm}</div>
                    <div></div>
                    {isOpen && <Modal title="참조" onClose={fn_close}/>}
                </div>}
                {aprvLine.midAtrzEmpNm && <div className='empInfo'>
                    <div>중간 결재자</div>
                    <div onClick={fn_name}>{aprvLine.midAtrzEmpNm}</div>
                    {isOpen && <Modal title="중간 결재" onClose={fn_close}/>}
                </div>}
                {aprvLine.midRefncEmp1Nm && <div className='empInfo'>
                    <div>중간 참조자</div>
                    <div onClick={fn_name}>{aprvLine.midRefncEmp1Id}</div>
                    {isOpen && <Modal title="참조" onClose={fn_close}/>}
                </div>}
                <div className='empInfo'>
                    <div>최종 결재자</div>
                    <div onClick={fn_name}>{aprvLine.lastAtrzEmpNm}</div>
                    <div>{aptzDate}</div>
                    {isOpen && <Modal title="최종 결재" onClose={fn_close}  onOk={fn_ok} okMsg="확인"/>}
                </div>
            </div>
        </>
    );
};

export default ApprovalLineDetail;