import React from 'react';

import { useParams } from 'react-router-dom';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AllOrg from './AllOrg';
import NewOrg from './NewOrg';

function OrgChartMain(props) {
    const { sideId } = useParams();

    const renderContent = () => {
        switch(sideId) {
            case 'allorg':
                return <AllOrg />
            case 'register':
                return <NewOrg />
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

export default OrgChartMain;