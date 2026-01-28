import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/Layout';
import ApprovalHome from './features/Approval/ApprovalHome'; // 예시 파일 임포트
import './Main.css'
import LoginHome from './features/Login/LoginHome';

function Main() {
  return (
    <Routes>
      <Route path="/login" element={<LoginHome />} />
      <Route path="/" element={<Layout />}>
        {/* 첫 화면 접속 시 전자결재 draft로 이동 */}
        <Route index element={<Navigate to="/main/:sideId" replace />} />
        <Route path="main/:sideId" element={<div>메인페이지</div>} />
        <Route path="approval/:sideId" element={<ApprovalHome />} />
        <Route path="schedule/:sideId" element={<div>일정관리 페이지</div>} />
        <Route path="attendance/:sideId" element={<div>근태관리 페이지</div>} />
        <Route path="board/:sideId" element={<div>공지게시판</div>} />
        <Route path="orgChart/:sideId" element={<div>조직도 페이지</div>} />
        <Route path="dashboard/:sideId" element={<div>대시보드 페이지</div>} />
      </Route>
    </Routes>
  );
}

export default Main