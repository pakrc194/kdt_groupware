import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AllEmp from './AllEmp';
import NewEmp from './NewEmp';
import DetailEmp from './DetailEmp';
import TeamEmpList from './TeamEmpList';
import SearchEmp from './SearchEmp';
import ModifyEmp from './ModifyEmp';

function OrgChartMain() {
    const { sideId } = useParams();
    const [selectedValue, setSelectedValue] = useState("EMP_NM");

    const renderContent = () => {
        switch(sideId) {
            case 'allorg':
                return <AllEmp />;
            case 'register':
                return <NewEmp />;
            case 'detail':
                return <DetailEmp />;
            case 'empSch':
                return <SearchEmp />;
            case 'modify':
                return <ModifyEmp />;
            default:
                return <TeamEmpList code={sideId} />;
        }
    }

    const filterChange = (e) => {
        setSelectedValue(e.target.value);
    };

    return (
        <div style={styles.container}>
            {/* 검색 박스 */}
            <div style={styles.searchBox}>
                <form style={styles.form} action="empSch">
                    <select name="schFilter" onChange={filterChange} style={styles.select}>
                        <option value="EMP_NM">이름</option>
                        <option value="JBTTL_NM">직책</option>
                    </select>
                    {selectedValue == "EMP_NM" && <input type="text" name="schValue" placeholder="검색어를 입력하세요" style={styles.input} />}
                    {selectedValue == "JBTTL_NM" && 
                        <select name="schValue" style={styles.select2}>
                        <option value="대표이사">대표이사</option>
                        <option value="팀장">팀장</option>
                        <option value="팀원">팀원</option>
                    </select>}
                    
                    <button type="submit" style={styles.submitBtn}>검색</button>
                </form>
            </div>

            {/* 콘텐츠 영역 */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
}

// 스타일
const styles = {
    container: {
        maxWidth: '1000px',
        margin: '20px auto',
        padding: '0 15px',
        fontFamily: 'Arial, sans-serif',
    },
    searchBox: {
        marginBottom: '20px',
        textAlign: 'right',
    },
    form: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    select: {
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
    },
    select2: {
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        width: '200px',
    },
    input: {
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        width: '200px',
    },
    submitBtn: {
        padding: '8px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default OrgChartMain;
