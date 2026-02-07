import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function AllEmp(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetcher('/gw/orgChart/list')
        .then(dd => {
            setData(Array.isArray(dd) ? dd : [dd]);
            console.log(dd)
        })
        .catch(e => console.log(e))
    }, []);


    return (
        <div>
            <h1>전체사원리스트</h1>
            <table border="">
                <tbody>
                <tr>
                    <td>이름</td>
                    <td>부서</td>
                    <td>직책</td>
                </tr>
                </tbody>
            {data.map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    <td>
                        <nav className="nav">
                        <Link to={`detail/${vv.EMP_ID}`}>{vv.EMP_NM}</Link>
                        </nav>
                    </td>
                    <td>{vv.DEPT_NAME}</td>
                    <td>{vv.JBTTL_NM}</td>
                </tr>
                </tbody>
            ))}
            </table>
            <Outlet />
        </div>
    );
}

export default AllEmp;