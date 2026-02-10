import React from 'react';

const AprvBoxBoard = ({aprvDoc}) => {
    return (
        <>
            <div>
            {aprvDoc.aprvDocNo}
            {aprvDoc.aprvDocTtl}
            {aprvDoc.empNm}
            {aprvDoc.aprvDocDrftDt.substring(0,10)}
            {aprvDoc.aprvDocStts}
            </div>
        </>

    );
};

export default AprvBoxBoard;