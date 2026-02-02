import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function AllOrg(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetcher('/gw/home/1/list')
        .then(dd => setData(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, []);


    return (
        <div>
            <h1>전체사원리스트</h1>
            {data.deptId}
            <table border="">
                <tbody>
                <tr>
                    <td>EMP_NM</td>
                    <td>DEPT_ID</td>
                    <td>JBTTL_ID</td>
                </tr>
                </tbody>
            {data.map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    <td><Link to={`/orgChart/detail/${vv.empId}`}>{vv.empNm}</Link></td>
                    <td>{vv.deptId}</td>
                    <td>{vv.jbttlId}</td>
                </tr>
                </tbody>
            ))}
            </table>
        </div>
    );
}

export default AllOrg;