import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function TeamEmpList(props) {
    
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const [data, setData] = useState([]);
    const [deptData, setDeptData] = useState('');
    const [selectedValue, setSelectedValue] = useState("ACTIVE");
    // const [newTAccessCk, setNewTAccessCk] = useState(0);  // 입사예정자
    const [newAccessCk, setNewAccessCk] = useState(0);  // 입사예정자
    const [reTAccessCk, setReTAccessCk] = useState(0);    // 퇴사자
    const [reAccessCk, setReAccessCk] = useState(0);    // 퇴사자
    useEffect(() => {
        fetcher(`/gw/orgChart/teamList/${props.code}`)
        .then(dd => setData(Array.isArray(dd) ? dd : [dd]))
        .catch(e => console.log(e))

        fetcher(`/gw/orgChart/teamName/${props.code}`)
        .then(dd => {setDeptData(dd)
        })
        .catch(e => console.log(e))

        // // 권한 확인용 - 팀 단위 퇴사자
        fetcher(`/gw/orgChart/access?id=${myInfo.deptId}&type=DEPT&section=ORGCHART&accessId=16`)
        .then(dd => {
            setReTAccessCk(dd)
        })
        // 권한 확인용 - 직책 단위 입사예정자
        fetcher(`/gw/orgChart/access?id=${myInfo.jbttlId}&type=JBTTL&section=ORGCHART&accessId=15`)
        .then(dd => {
            setNewAccessCk(dd)
        })
        .catch(e => console.log(e))
        // 권한 확인용 - 직책 단위 퇴사자
        fetcher(`/gw/orgChart/access?id=${myInfo.jbttlId}&type=JBTTL&section=ORGCHART&accessId=16`)
        .then(dd => {
            setReAccessCk(dd)
        })
        .catch(e => console.log(e))

    }, [props.code]);

    const filterChange = (e) => {
        setSelectedValue(e.target.value);
    };

    const getTitle = () => {
        switch (selectedValue) {
        case "ACTIVE":
            return "재직자 리스트";
        case "초기":
            return "입사예정자 리스트";
        case "RETIRED":
            return "퇴사자 리스트";
        default:
            return "전체 사원 리스트";
        }
    };
    
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{deptData.deptName}팀 {getTitle()}</h2>
            {(newAccessCk) ? (
            <div style={styles.filter}>
                    <select name="empFt" onChange={filterChange} style={styles.select}>
                        <option value="ACTIVE">재직자</option>
                        <option value="초기">입사예정자</option>
                        {(reTAccessCk && reAccessCk) ?
                            <option value="RETIRED">퇴사자</option> : null}
                    </select>
            </div>
            ) : null}
            <table style={styles.table}>
                <tbody>
                <tr>
                    <td style={styles.th}>이름</td>
                    <td style={styles.th}>부서</td>
                    <td style={styles.th}>직책</td>
                </tr>
                </tbody>
            {data.filter(dd => dd.EMP_ACNT_STTS == selectedValue).length > 0 ? (
            data.filter(dd => dd.EMP_ACNT_STTS == selectedValue)
            .map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    <td style={styles.td}>
                        <nav className="nav">
                        <Link to={`detail/${vv.EMP_ID}`} style={styles.link}>{vv.EMP_NM}</Link>
                        </nav>
                    </td>
                    <td style={styles.td}>{vv.DEPT_NAME}</td>
                    <td style={styles.td}>{vv.JBTTL_NM}</td>
                </tr>
                </tbody>
            ))
            ) : (
                <tr>
                    <td colSpan="3" style={styles.noData}>데이터가 없습니다.</td>
                </tr>
            )
        }
            </table>
            <Outlet />
        </div>
    );
}

// 스타일
const styles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
        float: 'left'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '12px 10px',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd',
        fontWeight: 'bold',
        color: '#555',
        width: '100px'
    },
    tr: {
        borderBottom: '1px solid #eee',
        transition: 'background-color 0.2s',
    },
    td: {
        padding: '12px 10px',
        color: '#333',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
    select: {
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        width: '200px',
    },
    filter: {
        marginTop: '20px',
        float: 'right',
    },
    noData: {
    textAlign: "center",
    padding: 16,
    color: "#bfbfbf",
  },
};

// tr hover 효과
styles.tr[':hover'] = {
    backgroundColor: '#f9f9f9'
};

export default TeamEmpList;