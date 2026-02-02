import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage'; // 방금 만든 인증 페이지 컴포넌트

// root 엘리먼트에 React 앱 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 기본 경로에서 AuthPage 출력 */}
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);