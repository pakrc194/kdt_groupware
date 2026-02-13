import React from 'react';

import { useParams } from 'react-router-dom';
import AccessList from './AccessList';
import CompDashboard from './CompDashboard';
import HRDashboard from './HrDashboard';
import FoDashboard from './FoDashboard';
import BuDashboard from './BuDashboard';
import WfDashboard from './WfDashboard';
import MfDashboard from './MfDashboard';
import FmDashboard from './FmDashboard';
import SoDashboard from './SoDashboard';
import BoardDash from './BoardDashboard';

function DashboardMain(props) {
    const { sideId } = useParams();
    console.log("sideId 정보 확인",sideId)

    const renderContent = () => {
        switch(sideId) {
            case 'CP':
                return <CompDashboard />
            case 'FO':
                return <FoDashboard />
            case 'BU':
                return <BuDashboard />
            case 'WF':
                return <WfDashboard />
            case 'MF':
                return <MfDashboard />
            case 'HR':
                return <HRDashboard />
            case 'FM':
                return <FmDashboard />
            case 'SO':
                return <SoDashboard />
            case 'AD':
                return <AccessList />
            case 'BO':
                return <BoardDash/>
            default :
                return <CompDashboard dept={sideId} />
        }
    }

    return (
        <div>
            {renderContent()}
        </div>
    );
}

export default DashboardMain;