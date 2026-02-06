import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function DetailEmp(props) {
    const [data, setData] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        fetcher(`/gw/orgChart/detail/${id}`)
        .then(dd => setData(dd))
        .catch(e => console.log(e))
    }, []);

    
    return (
        <div>
            <h1>{data.EMP_NM}</h1>
            <br/>
            <table border="">
                <tbody>
                <tr>
                    <td>이름</td>
                    <td>{data.EMP_NM}</td>
                </tr>
                <tr>
                    <td>부서</td>
                    <td>{data.DEPT_NAME}</td>
                </tr>
                <tr>
                    <td>이메일</td>
                    <td>{data.EMP_EML_ADDR}</td>
                </tr>
                <tr>
                    <td>사진</td>
                    <td>{data.EMP_PHOTO}</td>
                </tr>
                <tr>
                    <td>주소</td>
                    <td>{data.EMP_ADDR}</td>
                </tr>
                <tr>
                    <td>전화번호</td>
                    <td>{data.EMP_TELNO}</td>
                </tr>
                <tr>
                    <td>내선번호</td>
                    <td>{data.EMP_ACTNO}</td>
                </tr>
                </tbody>
            </table>
            <button onClick={() => navigate(-1)}>뒤로</button>
        </div>
    );
}

export default DetailEmp;