import React, { useRef, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import AttendContent from '../AttendContent';
import './AtrzModal.css'
const AtrzModal = ({onClose, onOk, docRole, idList, attendList, dutyList, schedList, drftDate}) => {
    const refArea = useRef();
    const [prcsData, setPrcsData] = useState('atrz');

    const fn_prcs = (e) => {
        const value = e.target.value;
        setPrcsData(value);

        if (value === "atrz" && refArea.current) {
            refArea.current.value = "";
        }
    }

    const fn_ok = () => {

        const result = {
            prcs: prcsData,                 // 'atrz' 또는 'rjct'
            rjctRsn: refArea.current.value // textarea 입력값
        };

        onOk(result)
    }

    return (
        <>
          <Modal
            title="결재"
            message={
                <div className="AtrzModal">
                    {/* 결재/반려 선택 영역 */}
                    <div className="atrz-type-group">
                        <label className="atrz-label">
                            <input type="radio" name="prcs" value="atrz" onChange={fn_prcs} checked={prcsData === "atrz"} />
                            <span className="radio-text">결재</span>
                        </label>
                        <label className="atrz-label">
                            <input type="radio" name="prcs" value="rjct" onChange={fn_prcs} checked={prcsData === "rjct"} />
                            <span className="radio-text">반려</span>
                        </label>
                    </div>

                    {/* 반려 사유 입력 영역 */}
                    <div className="atrz-reason-box">
                        <p className="atrz-title">반려사유</p>
                        <textarea 
                            name="rjctRsn" 
                            ref={refArea} 
                            className="atrz-textarea"
                            disabled={prcsData !== "rjct"} 
                            placeholder={prcsData === "rjct" ? "반려 사유를 입력하세요" : "반려 시에만 입력 가능합니다"}
                        />
                    </div>

                    {/* 하단 상세 콘텐츠 */}
                    <div className="atrz-content-area">
                        <AttendContent docRole={docRole} idList={idList} attendList={attendList} dutyList={dutyList} schedList={schedList} drftDate={drftDate}/>
                    </div>
                </div>
            }
            onClose={onClose}
            onOk={fn_ok}
            okMsg="확인"
          />  
        </>
    );
};

export default AtrzModal;