import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams, useSearchParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function SearchEmp(props) {
    const [data, setData] = useState([]);
    const [deptData, setDeptData] = useState('');
    const [deptmname, setDeptName] = useState('');
    const [searchParams] = useSearchParams();

    const [schFilter, setSchFilter] = useState(searchParams.get('schFilter'));
    const [schValue, setSchValue] = useState(searchParams.get('schValue'));
    console.log('검색화면에 확인: '+schFilter+", "+schValue);

    // fetch(`/orgChart/empSch?${params}`)
    //     .then(res => res.json())
    //     .then(data => console.log(data));
    // };
    
    useEffect(() => {
        fetcher(`/gw/orgChart/empSch?schFilter=${schFilter}&schValue=${schValue}`)
        .then(dd => {
            setData(Array.isArray(dd) ? dd : [dd])
            console.log(dd)
        })
        .catch(e => console.log(e))
    }, []);

    // useEffect(() => {
    //     setDeptName(deptData.deptName);
    // }, [deptData])
    // console.log('팀 정보 '+deptmname)
    
    return (
        <div>
            <h1>{schFilter === 'EMP_NM' ? '이름' : '직책'} : '{schValue}' 검색결과</h1>
            
            <table border="">
                            <tbody>
                            <tr>
                                <td>이름</td>
                                <td>부서</td>
                                <td>직책번호</td>
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
                                <td>{vv.JBTTL_ID}</td>
                            </tr>
                            </tbody>
                        ))}
                        </table>
        </div>
    );
}

export default SearchEmp;