import React from 'react';

import { useParams } from 'react-router-dom';
import AccessList from './AccessList';

function DashboardMain(props) {
    const { sideId } = useParams();
    console.log("sideId 정보 확인",sideId)

    const renderContent = () => {
        switch(sideId) {
            case 'ddd':
                return <AccessList />
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