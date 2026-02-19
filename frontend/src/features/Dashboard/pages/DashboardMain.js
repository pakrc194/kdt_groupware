import React, { useState } from 'react';

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
import NoAccess from '../../../shared/components/NoAccess';

function DashboardMain(props) {
    const { sideId } = useParams();
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const renderContent = () => {
        if (myInfo.deptCode === 'CP'){
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
            }
        }
        else if (myInfo.jbttlId === 2)  {
            switch(myInfo.deptCode) {
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
            }
        }
        else {
            return <NoAccess />
        }
    }

    return (
        <div>
            {renderContent()}
        </div>
    );
}

export default DashboardMain;