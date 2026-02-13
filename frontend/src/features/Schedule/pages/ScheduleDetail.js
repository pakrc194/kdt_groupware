import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import { chkToday } from '../../../shared/api/chkToday';
import Modal from '../../../shared/components/Modal';

function ScheduleDetail(props) {
    const { id } = useParams();
    const [sched, setSched] = useState([]);
    const [schedA, setSchedA] = useState(0);
    const [schedType, setSchedType] = useState('');
    const [schedTitle, setSchedTitle] = useState('');
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const [isOpen, setIsOpen] = useState(false);
    const [deptId, setDeptId] = useState('');
    const [persId, setPersId] = useState('');

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;
    
    const navigate = useNavigate();
    useEffect(() => {
        fetcher(`/gw/schedule/sched_detail/${id}`)
        .then(dd => {setSched(Array.isArray(dd) ? dd : [dd])
            setSchedA(dd.schedAuthorId)
            setSchedType(dd.schedType)
            setSchedTitle(dd.schedTitle)
            setDeptId(dd.schedDeptId)
            setPersId(dd.schedEmpId)
            console.log(dd)
        })
        .catch(e => console.log(e))
    }, []);

    const schedDelete = () => {
        fetcher(`/gw/schedule/sched_delete/${id}
            ?empId=${myInfo.empId}&title=${schedTitle}&type=${schedType}&dept=${deptId}&pers=${persId}`)
        .catch(e => console.log(e))
        console.log('일정 삭제')
        alert('일정이 삭제됐습니다.')
        navigate(-1)
    }
    
    return (
        <div>
            {sched.map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    <td>구분</td>
                    <td>{vv.schedType}</td>
                </tr>
                <tr>
                    <td>제목</td>
                    <td>{vv.schedTitle}</td>
                </tr>
                <tr>    
                    <td>상세내용</td>
                    <td>{vv.schedDetail}</td>
                </tr>
                {vv.schedType == "DEPT" &&
                    <tr>
                        <td>담당팀</td>
                        <td>{vv.schedDept}</td>
                    </tr>
                }
                {vv.schedType == "PERSONAL" &&
                    <tr>
                        <td>담당자</td>
                        <td>{vv.schedEmpNm}</td>
                    </tr>
                }
                <tr>
                    <td>위치</td>
                    <td>{vv.schedLocNm}</td>
                </tr>
                
                <tr>    
                    {/* <td>구분(회사, 팀, 개인, TODO)</td>
                    <td>{vv.schedType}</td> */}
                </tr>
                
                <tr>    
                    <td>시작일</td>
                    <td>{vv.schedStartDate.split(' ')[0]}</td>
                </tr><tr>    
                    <td>종료일</td>
                    <td>{vv.schedEndDate.split(' ')[0]}</td>
                </tr>
                </tbody>
            ))}
            {sched.map(dedate => (
                <>
                {(dedate.schedStartDate.split(' ')[0] != formatted) && chkToday(dedate.schedStartDate) && chkToday(dedate.schedEndDate) && myInfo.empId == schedA && schedType != 'TODO' &&
                <>
                    <button onClick={() => setIsOpen(true)}>일정 삭제</button>
                    {isOpen && (
                        <Modal 
                        title={dedate.schedTitle}
                        message="삭제하시겠습니까?"
                        onClose={() => setIsOpen(false)} 
                        onOk={schedDelete} 
                        okMsg="삭제" 
                        />
                    )}
                </>
                }
                </>
            ))}
            <button onClick={() => navigate(-1)}>뒤로</button>
        </div>
    );
}

export default ScheduleDetail;