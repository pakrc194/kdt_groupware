import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link, useParams } from 'react-router-dom';
import { getStatusLabel } from '../../../shared/func/formatLabel';

const DraftBox = () => {
    const {sideId} = useParams();
    const [aprvDocList, setAprvDocList] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const [stts, setStts] = useState();
    const [formCodeList, setFormCodeList] = useState([]);
    const [formCode, setFormCode] = useState();

    useEffect(() => {
        if (!myInfo?.empId) return;

        const params = new URLSearchParams();

        if (stts) params.append("stts", stts);
        if (formCode) params.append("code", formCode);

        fetcher(`/gw/aprv/DrftDocList/${myInfo.empId}?${params.toString()}`)
            .then(setAprvDocList);
    }, [stts, formCode, myInfo?.empId]);

    useEffect(()=>{
        fetcher("/gw/aprv/AprvDocFormList").then(setFormCodeList)
    },[])

    const fn_stts = (e) => {
        setStts(e.target.value);
    };

    const fn_code = (e) => {
        setFormCode(e.target.value);
    };

    return (
        <>
            <h4>전자결재 > 기안함 </h4>

            <div className="section history-section">
                <div>
                    <select onChange={fn_stts}>
                        <option value="">전체</option>
                        <option value="PENDING">결재 중</option>
                        <option value="COMPLETED">결재 완료</option>
                        <option value="REJECTED">반려</option>
                    </select>
                    <select onChange={fn_code}>
                        <option value="">ALL</option>
                        {formCodeList.map((v,k)=>(
                            <option value={v.docFormCd} key={k}>{v.docFormCd}</option>
                        ))}
                        
                    </select>
                </div>
                <table className="history-table">
                <thead>
                    <tr>
                        <th>문서번호</th>
                        <th>문서제목</th>
                        <th>기안자</th>
                        <th>기안일자</th>
                        <th>진행상태</th>
                    </tr>
                </thead>
                <tbody>
                    {aprvDocList.length > 0 ? (
                    aprvDocList.map((aprvDoc, k)=> (<tr key={k}>
                        <td>{aprvDoc.aprvDocNo}</td>
                        <td><Link to={`/approval/${sideId}/detail/`+aprvDoc.aprvDocId}>{aprvDoc.aprvDocTtl}</Link></td>
                        <td>{aprvDoc.empNm}</td>
                        <td>{aprvDoc.aprvDocDrftDt.substring(0,8)}</td>
                        <td>
                            <span className={`badge-status ${aprvDoc.aprvDocStts}`}>
                                {getStatusLabel(aprvDoc.aprvDocStts)}
                            </span>
                        </td>
                    </tr>))
                    ) : (
                    <tr>
                        <td colSpan="7" className="no-data">
                        데이터가 없습니다.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>

        </>
    );
};

export default DraftBox;