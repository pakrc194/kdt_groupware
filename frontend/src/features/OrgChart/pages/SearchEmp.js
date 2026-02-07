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

    
    useEffect(() => {
        fetcher(`/gw/orgChart/empSch?schFilter=${schFilter}&schValue=${schValue}`)
        .then(dd => {
            setData(Array.isArray(dd) ? dd : [dd])
        })
        .catch(e => console.log(e))
    }, []);

    
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{schFilter === 'EMP_NM' ? '이름' : '직책'} : '{schValue}' 검색결과</h1>
            
            <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>이름</th>
                                    <th style={styles.th}>부서</th>
                                    <th style={styles.th}>직책</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((vv, idx) => (
                                    <tr key={idx} style={styles.tr}>
                                        <td style={styles.td}>
                                            <Link to={`detail/${vv.EMP_ID}`} style={styles.link}>{vv.EMP_NM}</Link>
                                        </td>
                                        <td style={styles.td}>{vv.DEPT_NAME}</td>
                                        <td style={styles.td}>{vv.JBTTL_NM}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
    }
};

// tr hover 효과
styles.tr[':hover'] = {
    backgroundColor: '#f9f9f9'
};

export default SearchEmp;