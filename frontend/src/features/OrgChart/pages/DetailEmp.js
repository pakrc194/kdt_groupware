import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function DetailEmp(props) {
    const [data, setData] = useState([]);
    const { id } = useParams();
    
    useEffect(() => {
        fetcher(`/gw/home/1/detail/${id}`)
        .then(dd => setData(dd))
        .catch(e => console.log(e))
    }, []);

    
    return (
        <div>
            사원 상세 정보
            {id}
            <br/>
            <table border="">
                <tbody>
                <tr>
                    <td>이름</td>
                    <td>{data.empNm}</td>
                </tr>
                <tr>
                    <td>부서번호</td>
                    <td>{data.deptId}</td>
                </tr>
                <tr>
                    <td>이메일</td>
                    <td>{data.empEmlAddr}</td>
                </tr>
                <tr>
                    <td>사진</td>
                    <td>{data.empPhoto}</td>
                </tr>
                <tr>
                    <td>주소</td>
                    <td>{data.empAddr}</td>
                </tr>
                <tr>
                    <td>전화번호</td>
                    <td>{data.empTelNo}</td>
                </tr>
                <tr>
                    <td>내선번호</td>
                    <td>{data.empActNo}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DetailEmp;