import React from 'react';

import './DetailForm.css'
const DetailForm = ({inputForm}) => {
    return (
        <div className='aprv-content-row'>
            <div className='aprv-content-label'>{inputForm.label}</div>
            <div className='aprv-content-value'>{inputForm.value}</div>
        </div>
    );
};

export default DetailForm;