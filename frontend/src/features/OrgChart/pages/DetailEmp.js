import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function DetailEmp(props) {
    const [data, setData] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    // 부서번호 6(인사팀)만 접근 가능
    // if (localStorage.getItem("DEPT_ID") != 6) {
    //     return <div style={{ color: 'red', fontWeight: 'bold' }}><h1>권한이 없습니다</h1></div>;
    // }
    
    useEffect(() => {
        fetcher(`/gw/orgChart/detail/${id}`)
        .then(dd => setData(dd))
        .catch(e => console.log(e))
    }, []);

    const modifyInfo = () => {
        window.location.href=`../../modify?id=${id}`;
    }

    const retired = () => {
        alert('계정 RETIRED')
    }

    
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
                    <td>생년월일</td>
                    <td>{data.EMP_BIRTH}</td>
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
            {/* 인사팀일 때만 버튼 활성화 */}
            {(localStorage.getItem("DEPT_ID")) && (
                <>
                    <button onClick={modifyInfo}>정보수정</button>
                    {/* 이름, 팀, 직책, 생년월일만 수정 */}
                    <button onClick={retired}>비활성화</button>
                </>
            )}
        </div>
    );
}

export default DetailEmp;