import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import { fetcher } from '../../../shared/api/fetcher';

const DocFormList = () => {
    const [formList, setFormList] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        fetcher("/gw/aprv/AprvDetailFormList").then(setFormList)
    },[])
    
    const fn_formInsert = () => {
        navigate("/approval/docFormBox/insert");
    }


    return (
        <div>

            <h4>전자결재 > 양식 보관함</h4>      
            <div className="section history-section">
                <div>
                    <select >
                        <option value="">ALL</option>
                        <option>PENDING</option>
                        <option>REJECTED</option>
                        <option>COMPLETED</option>
                    </select>
                    <select>
                        <option>전체</option>
                        <option>공용</option>
                        <option>부서</option>
                    </select>
                </div>
                <table className="history-table">
                <thead>
                    <tr>
                        <th>양식 코드</th>
                        <th>양식 제목</th>
                        <th>양식 종류</th>
                        <th>사용 부서</th>
                        <th>공개 여부</th>
                        <th>숨김 처리</th>
                    </tr>
                </thead>
                <tbody>
                    {formList.length > 0 ? (
                        formList.map((v, k)=>(
                            <tr key={k}>
                                <td>{v.docFormCd}</td>
                                <td>{v.docFormNm}</td>
                                <td>{v.docFormType}</td>
                                <td>{v.deptNames}</td>
                                <td>{v.docFormYn}</td>
                                <td><Button>숨김</Button></td>
                            </tr>
                        ))
                    ) : (
                    <tr>
                        <td colSpan="7" className="no-data">
                        데이터가 없습니다.
                        </td>
                    </tr>
                    )}
                </tbody>
                    <Button type="secondary" onClick={fn_formInsert}>양식 등록</Button>
                </table>
            </div>
        </div>
    );
};

export default DocFormList;