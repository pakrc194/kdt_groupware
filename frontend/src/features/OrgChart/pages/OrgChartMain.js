import React from 'react';

import { useParams } from 'react-router-dom';
import AllEmp from './AllEmp';
import NewEmp from './NewEmp';
import DetailEmp from './DetailEmp';
import Emp from './Emp';

function OrgChartMain(props) {
    const { sideId } = useParams();

    const renderContent = () => {
        console.log(sideId);
        switch(sideId.split("/")[0]) {
            case 'allorg':
                return <AllEmp />
            case 'register':
                return <NewEmp />
            case 'detail':
                return <DetailEmp />
        }
    }

    return (
        <div className='orgchart-container'>
            <div className='search-box' align="right">
            <form action="empSch">
                <select name="schFilter">
                    <option>이름</option>
                    <option>직책</option>
                </select>
                <input type="text" name="schValue" />
                <input type="submit" value="검색" />
            </form>
            </div>
            <div className='org-content-area'>
                {renderContent()}
            </div>
        </div>
    );
}

export default OrgChartMain;