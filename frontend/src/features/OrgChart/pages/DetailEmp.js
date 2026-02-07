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

    const modifyInfo = () => {
        window.location.href=`../../modify?id=${id}`;
    }

    const retired = async () => {
        alert('계정이 바활성화됩니다.')

        try {
            await fetcher(`/gw/orgChart/deactivate`, {
            method: 'POST',
            body: { 
                empId: id
            }
            });

        } catch (err) {
            console.error('계정 비활성화 실패:', err.message);
        }
        navigate(-1)
    }

    
    
    return (
        <div>
            <h1>{data.EMP_NM} {localStorage.getItem("JBTTL_ID")} {localStorage.getItem("DEPT_ID")}</h1>
            <br/>
            <table border="">
                <tbody>
                <tr>
                    <td>사진</td>
                    <td>{data.EMP_PHOTO}</td>
                </tr>
                <tr>
                    <td>이름</td>
                    <td>{data.EMP_NM}</td>
                </tr>
                <tr>
                    <td>팀</td>
                    <td>{data.DEPT_NAME} {data.DEPT_ID}</td>
                </tr>
                <tr>
                    <td>직책</td>
                    <td>{data.JBTTL_NM}</td>
                </tr>
                <tr>
                    <td>내선번호</td>
                    <td>{data.EMP_ACTNO}</td>
                </tr>
                <tr>
                    <td>생년월일</td>
                    <td>{data.EMP_BIRTH}</td>
                </tr>
                {/* 같은 팀 팀장 -  주소 보임*/}
                {(localStorage.getItem("JBTTL_ID") < 3) &&
                <>
                    <tr>
                        <td>이메일</td>
                        <td>{data.EMP_EML_ADDR}</td>
                    </tr>
                    <tr>
                        <td>전화번호</td>
                        <td>{data.EMP_TELNO}</td>
                    </tr>
                {((localStorage.getItem("JBTTL_ID") < 3 && localStorage.getItem("DEPT_ID") == data.DEPT_ID)
                || (localStorage.getItem("JBTTL_ID") == 1)) &&
                <>
                    <tr>
                        <td>주소</td>
                        <td>{data.EMP_ADDR}</td>
                    </tr>
                {(localStorage.getItem("JBTTL_ID") == 1) &&
                <>
                    <tr>
                        <td>계좌번호</td>
                        <td>{data.EMP_ACTNO}</td>
                    </tr>
                </>}
                </>}
                </>}
                </tbody>
            </table>
            <button onClick={() => navigate(-1)}>뒤로</button>
            {/* 인사팀일 때만 버튼 활성화 */}
            {(localStorage.getItem("DEPT_ID") == 6) && (
                <>
                    <button onClick={modifyInfo}>정보수정</button>
                    <button onClick={retired}>비활성화</button>
                </>
            )}
        </div>
    );
}

export default DetailEmp;