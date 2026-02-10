import React from 'react';

import { useParams } from 'react-router-dom';
import AccessList from './AccessList';
import CompDashboard from './CompDashboard';
import HRDashboard from './HrDashboard';

function DashboardMain(props) {
    const { sideId } = useParams();
    console.log("sideId 정보 확인",sideId)

    const renderContent = () => {
        switch(sideId) {
            case 'aaa':
                return <CompDashboard />
            case 'bbb':
                return <HRDashboard />
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