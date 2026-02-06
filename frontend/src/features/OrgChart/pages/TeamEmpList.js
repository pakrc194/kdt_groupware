import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams, useSearchParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function TeamEmpList(props) {
    const [data, setData] = useState([]);
    const [deptData, setDeptData] = useState('');
    const [deptmname, setDeptName] = useState('');
    
    useEffect(() => {
        fetcher(`/gw/orgChart/teamList/${props.code}`)
        .then(dd => setData(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))

        fetcher(`/gw/orgChart/teamName/${props.code}`)
        .then(dd => {setDeptData(dd)
            // console.log(dd)
        })
        .catch(e => console.log(e))
    }, [props.code]);

    useEffect(() => {
        setDeptName(deptData.deptName);
    }, [deptData])
    console.log('팀 정보 '+deptmname)
    
    return (
        <div>
            <h1>{deptData.deptName}팀</h1>
            
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

export default TeamEmpList;