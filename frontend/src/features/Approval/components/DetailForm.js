import React from 'react';

import './DetailForm.css'
const DetailForm = ({inputForm}) => {
    


    return (
        <>
            <div className='formDiv'>
                <div className='formLabel'>{inputForm.label}</div>
                <div className='formValue'>{inputForm.value}</div>
            </div>  
        </>
    );
};

export default DetailForm;