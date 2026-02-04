import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 1. 실제 작업한 파일들을 불러옵니다.
import DraftPage from './DraftPage';
import ApprovalBox from './ApprovalBox';
import './DraftPage.css'
import DraftBox from './DraftBox';
import ReferBox from './ReferBox';
import RejectBox from './RejectBox';


const ApprovalMain = () => {
  const { sideId } = useParams(); // URL의 :sideId 값을 가져옴
  
  useEffect(()=>{
    localStorage.setItem("EMP_ID", "1")
    localStorage.setItem("EMP_NM", "강백호")

    
  },[])

  
  // 2. 스위치 문에서 '컴포넌트'를 반환합니다.
  const renderContent = () => {
    switch (sideId) {
      case 'draft':
        return <DraftPage />; // 경로 문자열이 아니라 컴포넌트 호출!
      case 'draftBox':
        return <DraftBox />;
      case 'approvalBox':
        return <ApprovalBox />;
      case 'referBox':
        return <ReferBox />;
      case 'rejectBox':
        return <RejectBox />;
      case 'completed':
        return <div>✅ 결재 완료 목록 화면 (팀원이 작성 중...)</div>;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="approval-container">
      <div className="content-area">
        {renderContent()} {/* 여기서 선택된 화면이 렌더링됨 */}
      </div>
    </div>
  );
};

export default ApprovalMain;