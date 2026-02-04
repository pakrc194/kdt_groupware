import React, { useRef, useState } from 'react';
import Modal from '../../../../shared/components/Modal';

const AtrzModal = ({onClose, onOk}) => {
    const refArea = useRef();
    const [prcsData, setPrcsData] = useState('atrz');

    const fn_prcs = (e) => {
        setPrcsData(e.target.value)
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
                <>
                    <input type="radio" name="prcs" value="atrz" onChange={fn_prcs} checked={prcsData=="atrz"}/>결재
                    <input type="radio" name="prcs" value="rjct" onChange={fn_prcs} checked={prcsData=="rjct"}/>반려<br/>
                    반려사유<br/><textarea name="rjctRsn" ref={refArea}/>
                </>
            }
            onClose={onClose}
            onOk={fn_ok}
            okMsg="확인"
          />  
        </>
    );
};

export default AtrzModal;