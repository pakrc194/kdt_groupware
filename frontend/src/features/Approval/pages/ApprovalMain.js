import React from 'react';
import { useParams } from 'react-router-dom';
// 1. 실제 작업한 파일들을 불러옵니다.
import DraftPage from './DraftPage';
import PendingPage from './PendingPage';

const ApprovalMain = () => {
  const { sideId } = useParams(); // URL의 :sideId 값을 가져옴

  // 2. 스위치 문에서 '컴포넌트'를 반환합니다.
  const renderContent = () => {
    switch (sideId) {
      case 'draft':
        return <DraftPage />; // 경로 문자열이 아니라 컴포넌트 호출!
      case 'pending':
        return <PendingPage />;
      case 'completed':
        return <div>✅ 결재 완료 목록 화면 (팀원이 작성 중...)</div>;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="approval-container">
      <h2>전자결재 시스템</h2>
      <div className="content-area">
        {renderContent()} {/* 여기서 선택된 화면이 렌더링됨 */}
      </div>
    </div>
  );
};

export default ApprovalMain;