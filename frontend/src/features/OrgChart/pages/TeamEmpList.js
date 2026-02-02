import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams, useSearchParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function AllEmp(props) {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetcher(`/gw/home/1/teamList/${props.code}`)
        .then(dd => setData(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))
    }, [props.code]);


    return (
        <div>
            <h1>팀리스트 {props.code}</h1>
            
            <table border="">
                <tbody>
                <tr>
                    <td>이름</td>
                    <td>부서번호</td>
                    <td>직책번호</td>
                </tr>
                </tbody>
            {data.map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    <td>
                        <nav className="nav">
                        <Link to={`detail/${vv.empId}`}>{vv.empNm}</Link>
                        </nav>
                    </td>
                    <td>{vv.deptId}</td>
                    <td>{vv.jbttlId}</td>
                </tr>
                </tbody>
            ))}
            </table>
            <Outlet />
        </div>
    );
}

export default AllEmp;