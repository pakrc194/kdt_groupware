import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 1. 실제 작업한 파일들을 불러옵니다.
import DraftPage from './DraftPage';
import ApprovalBox from './ApprovalBox';
import './DraftPage.css'
import DraftBox from './DraftBox';
import ReferBox from './ReferBox';
import RejectBox from './RejectBox';
import DocStatus from './DocStatus';
import DocFormList from './DocFormList';
import DocFormInsert from './DocFormInsert';
import TempBox from './TempBox';


const ApprovalMain = () => {
  const { sideId, service } = useParams(); // URL의 :sideId 값을 가져옴

  useEffect(()=>{
  },[])

  
  // 2. 스위치 문에서 '컴포넌트'를 반환합니다.
  const renderContent = () => {
    switch (sideId) {
      case 'docStatus':
        return <DocStatus/>;
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
      case 'docFormBox':
        switch(service) {
          case 'insert' :
            return <DocFormInsert/>
          default : 
            return <DocFormList/>
        }
      case 'tempBox':
        return <TempBox/>
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