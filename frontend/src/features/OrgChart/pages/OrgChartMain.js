import React from 'react';

import { useParams } from 'react-router-dom';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AllEmp from './AllEmp';
import NewEmp from './NewEmp';

function OrgChartMain(props) {
    const { sideId } = useParams();

    const renderContent = () => {
        switch(sideId) {
            case 'allorg':
                return <AllEmp />
            case 'register':
                return <NewEmp />
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