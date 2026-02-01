import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SIDE_CONFIG } from './sideConfig';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const currentMain = pathParts[1] || 'main'; // 현재 메인 메뉴 (예: approval)
  const currentSide = pathParts[2]; // 현재 사이드 메뉴 (예: draft)

  return (
    <div className="container">
      <header className="header">
        <div className="logo"><Link to={'/home/dashboard'} className='nav-icon'>Groupware</Link></div>
        <nav className="nav">
          {Object.keys(SIDE_CONFIG).map((key) => (
            <Link 
              key={key} 
              to={`/${key}/${SIDE_CONFIG[key].sideMenus[0].id}`} 
              className={`nav-item ${currentMain === key ? 'active' : ''}`}
            >
              {SIDE_CONFIG[key].title}
            </Link>
          ))}
        </nav>
        <nav className="nav-right">
          <Link to={'/login'} className={'nav-icon'}>
          로그아웃
          </Link>
        </nav>
      </header>

      <div className="main-wrapper">
        <aside className="sidebar">
          <h3 className="sidebar-title">{SIDE_CONFIG[currentMain]?.title}</h3>
          <ul className="sidebar-list">
            {SIDE_CONFIG[currentMain]?.sideMenus.map((menu) => (
              <li key={menu.id}>
                <Link 
                  to={`/${currentMain}/${menu.id}`} 
                  className={`side-item ${currentSide === menu.id ? 'active' : ''}`}
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;