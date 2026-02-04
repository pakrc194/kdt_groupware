import React from 'react';
import Modal from '../../../../shared/components/Modal';

const ReferModal = ({onClose, onOk}) => {
    return (
        <>
          <Modal 
            title="참조"
            message="수신 확인을 보내시겠습니까?"
            okMsg="확인"
            onClose={onClose}
            onOk={onOk}
          />  
        </>
    );
};

export default ReferModal;