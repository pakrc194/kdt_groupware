import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import { fetcher } from '../../../shared/api/fetcher';

const DocFormList = () => {
    const [formList, setFormList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("Y"); // 필터 상태 (ALL, Y, N)
    const navigate = useNavigate();

    useEffect(() => {
        fetcher("/gw/aprv/AprvDetailFormList").then(setFormList);
    }, []);

    const fn_formInsert = () => {
        navigate("/approval/docFormBox/insert");
    };

    const fn_visible = (v) => {
        // 숨김/공개 처리 후 목록 다시 불러오기
        fetcher(`/gw/aprv/AprvFormVisible/${v.docFormId}`)
            .then(() => fetcher("/gw/aprv/AprvDetailFormList"))
            .then(setFormList)
            .catch(e => console.log("visible error:", e));
    };

    // --- [Filter Logic] ---
    // 선택된 필터값에 따라 보여줄 리스트를 계산합니다.
    const filteredList = formList.filter(item => {
        if (filterStatus === "ALL") return true;
        return item.docFormYn === filterStatus;
    });

    return (
        <div className="doc-form-container">
            <h4>전자결재 > 양식 보관함</h4>


            <div className="section history-section">
                {/* 필터 컨트롤 영역 */}
                <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>공개 여부 필터:</label>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="ALL">전체보기</option>
                        <option value="Y">공개(Y)</option>
                        <option value="N">숨김(N)</option>
                    </select>
                </div>

                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>양식 코드</th>
                            <th>양식 제목</th>
                            <th>양식 종류</th>
                            <th>사용 부서</th>
                            <th>공개 여부</th>
                            <th>상태 변경</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.length > 0 ? (
                            filteredList.map((v, k) => (
                                <tr key={k}>
                                    <td>{v.docFormCd}</td>
                                    <td>{v.docFormNm}</td>
                                    <td>{v.docFormType}</td>
                                    <td>{v.deptNames || "공통"}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ 
                                            color: v.docFormYn === 'Y' ? '#2ecc71' : '#e74c3c',
                                            fontWeight: 'bold'
                                        }}>
                                            {v.docFormYn}
                                        </span>
                                    </td>
                                    <td>
                                        <Button 
                                            variant={v.docFormYn === 'Y' ? "secondary" : "primary"} 
                                            onClick={() => fn_visible(v)}
                                        >
                                            {v.docFormYn === 'Y' ? "숨김" : "공개"}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data" style={{ textAlign: 'center', padding: '20px' }}>
                                    해당 조건에 맞는 양식이 없습니다.
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="6" style={{ backgroundColor: '#f9f9f9' }}>
                                <Button type="secondary" onClick={fn_formInsert}>신규 양식 등록</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocFormList;