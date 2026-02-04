import React from 'react';

import { Outlet, useParams } from 'react-router-dom';
import Instruction from './Instruction';
import ScheduleView from './ScheduleView';

function ScheduleMain(props) {

    const { sideId } = useParams();

    const renderContent = () => {
        switch(sideId) {
            case 'check':
                return <ScheduleView />
            case 'instruction':
                return <Instruction />
        }
    }

    return (
        <div className='orgchart-container'>
            <div className='org-content-area'>
                {renderContent()}
            </div>
        </div>
    );
}

export default ScheduleMain;