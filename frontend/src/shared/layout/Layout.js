import React, { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { SIDE_CONFIG } from "./sideConfig";
import "./Layout.css";
import { fetcher } from "../api/fetcher";
import UserProfile from "../components/UserProfile";

const Layout = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const currentMain = pathParts[1] || "main"; // 현재 메인 메뉴 (예: approval)
  const currentSide = pathParts[2]; // 현재 사이드 메뉴 (예: draft)

  const navigate = useNavigate();

  const fn_logout = () => {
    const myInfoStr = localStorage.getItem("MyInfo");
    const myInfo = JSON.parse(myInfoStr);
    const token = myInfo.token;

    if (token) {
      //토큰이 있을 경우에만 진입
      fetcher(`/gw/login/hello`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(`logChk 결과 : `, response);
          localStorage.removeItem("MyInfo");
          alert("로그아웃");
          navigate("/login");
        })
        .catch((error) => {
          console.log(`logChk 에러 : `, error);
        });
    } else {
      console.log("토큰없음");
    }
  };

  useEffect(()=> {
    const myInfoStr = localStorage.getItem("MyInfo")
    const myInfo = JSON.parse(myInfoStr)
    const token = myInfo?.token || null
    
    if(token){  //토큰이 있을 경우에만 진입
      fetcher(
      `/gw/login/hello`,
      {
          method:"GET",
          headers:{
          "Authorization" : `Bearer ${token}`
          }
      })
      .then(response=>{
          console.log(`logChk 결과 : `, response)})
      .catch(error=>{
          console.log(`logChk 에러 : `, error)
          navigate("/")
      })
    }else{
      console.log("토큰없음")
      navigate("/")
    }
  },[])


  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <Link to={"/home/dashboard"} className="nav-icon">
            Groupware
          </Link>
        </div>
        <nav className="nav">
          {Object.keys(SIDE_CONFIG).map((key) => (
            <Link
              key={key}
              to={`/${key}/${SIDE_CONFIG[key].sideMenus[0].id}`}
              className={`nav-item ${currentMain === key ? "active" : ""}`}
            >
              {SIDE_CONFIG[key].title}
            </Link>
          ))}
        </nav>
        <nav className="nav-right">
          <button className={"nav-icon"} onClick={fn_logout}>
            로그아웃
          </button>
        </nav>
      </header>

      <div className="main-wrapper">
        <aside className="sidebar">
          <UserProfile />
          <h3 className="sidebar-title">{SIDE_CONFIG[currentMain]?.title}</h3>
          <ul className="sidebar-list">
            {SIDE_CONFIG[currentMain]?.sideMenus.map((menu) => {
              // 하위 메뉴 존재 여부 확인
              const hasSubMenus = menu.subMenus && menu.subMenus.length > 0;

              // 현재 사이드 메뉴가 이 메뉴 본인이거나, 하위 메뉴 중 하나인 경우 '활성화' 상태로 간주
              const isParentActive =
                currentSide === menu.id ||
                menu.subMenus?.some((sub) => sub.id === currentSide);

              return (
                <li key={menu.id} className="sidebar-item-container">
                  {hasSubMenus && (
                    <Link
                      to={`/${currentMain}/${menu.id}`}
                      onClick={(e) => e.preventDefault()}
                      style={{ pointerEvents: "none" }}
                      className={`side-item ${isParentActive ? "active" : ""}`}
                    >
                      {menu.name}
                    </Link>
                  )}
                  {!hasSubMenus && (
                    <Link
                      to={`/${currentMain}/${menu.id}`}
                      className={`side-item ${isParentActive ? "active" : ""}`}
                    >
                      {menu.name}
                    </Link>
                  )}

                  {/* subMenus가 있을 때 */}
                  {hasSubMenus && (
                    <ul className="sub-menu-list">
                      {menu.subMenus.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/${currentMain}/${sub.id}`}
                            className={`side-sub-item ${currentSide === sub.id ? "active" : ""}`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
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
