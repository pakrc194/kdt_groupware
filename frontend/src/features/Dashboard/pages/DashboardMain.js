import React from 'react';

import { useParams } from 'react-router-dom';
import AccessList from './AccessList';
import CompDashboard from './CompDashboard';

function DashboardMain(props) {
    const { sideId } = useParams();

    const renderContent = () => {
        switch(sideId) {
            case 'aaa':
                return <CompDashboard />
            case 'ddd':
                return <AccessList />
            default :
                return <CompDashboard dept={sideId} />
        }
    }

    return (
        <div>
            대시보드
            {renderContent()}
        </div>
    );
}

export default DashboardMain;