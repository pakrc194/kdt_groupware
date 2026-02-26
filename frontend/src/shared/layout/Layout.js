import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { SIDE_CONFIG } from "./sideConfig";
import "./Layout.css";
import { fetcher } from "../api/fetcher";
import UserProfile from "../components/UserProfile";
import dayjs from "dayjs";

const Layout = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const currentMain = pathParts[1] || "main"; // 현재 메인 메뉴 (예: approval)
  const currentSide = pathParts[2]; // 현재 사이드 메뉴 (예: draft)
  const [myInfo, setMyInfo] = useState(() =>
    JSON.parse(localStorage.getItem("MyInfo") || "null")
  );
  const navigate = useNavigate();

  const [notis, setNotis] = useState([]);

  const unreadCount = notis.filter((n) => n.readYn === "N").length;
  const [openNoti, setOpenNoti] = useState(false);

  const fn_ntf = () => {
    setOpenNoti((prev) => !prev);
  };

  const canAccessMenu = (menu, myAccessList = []) => {
      // access 없으면 기본 공개
      if (!menu.access) return true;

      return myAccessList.includes(menu.access);
  };
  const [myAccessList, setMyAccessList] = useState([]);
  
  useEffect(() => {
      const fetchAccess = async () => {
        const res =
          await fetcher(`/gw/dashboard/accessFilterList?jbttl=${myInfo.jbttlId}&dept=${myInfo.deptId}`);

        const accessList = res.map(v => v.accessDetail);

        setMyAccessList(accessList);
      };

      if (myInfo?.jbttlId && myInfo?.deptId) {
        fetchAccess();
      }

  }, [myInfo?.jbttlId, myInfo?.deptId, location.pathname]);

  // 바깥 클릭하면 닫기
  // useEffect(() => {
  //   function onDown(e) {
  //     if (!openNoti) return;
  //     if (popupRef.current?.contains(e.target)) return;
  //     if (bellRef.current?.contains(e.target)) return;
  //     setOpenNoti(false);
  //   }
  //   function onEsc(e) {
  //     if (e.key === "Escape") setOpenNoti(false);
  //   }

  //   document.addEventListener("mousedown", onDown);
  //   document.addEventListener("keydown", onEsc);
  //   return () => {
  //     document.removeEventListener("mousedown", onDown);
  //     document.removeEventListener("keydown", onEsc);
  //   };
  // }, [openNoti]);

  useEffect(() => {

    fetcher(`/gw/ntf/list`,{
        method:"POST",
        body:{
          empId : myInfo.empId
        }
      }).then(res=>{
        setNotis(res)
      })

    const intervalId = setInterval(() => {
      fetcher(`/gw/ntf/list`,{
        method:"POST",
        body:{
          empId : myInfo.empId
        }
      }).then(res=>{
        setNotis(res)
      })
    }, 1000*10);

    // cleanup (컴포넌트 언마운트 시 실행)
    return () => {
      clearInterval(intervalId);
    };


  }, []);

  const fn_clkOut = () => {
    // fetcher를 사용하여 백엔드 퇴근 로직 호출
    fetcher("/gw/atdc/clkOut", {
      method: "POST",
      body: { empId: myInfo.empId, empNm: myInfo.empNm }, // myInfo는 localStorage 등에서 가져온 값
    })
      .then((res) => {
        alert(res.message);
        // 필요하다면 페이지 이동이나 상태 업데이트
        navigate(0)
      })
      .catch((err) => {
        console.error("퇴근 처리 중 에러 발생:", err);
        alert("퇴근 처리 중 오류가 발생했습니다.");
      });
  };

  const handleClkOut = () => {
    // 1. 근무 정보가 있고, 현재 시간이 종료 시간보다 빠르다면?
    if (myInfo?.endTm) {
      const now = dayjs().format("HH:mm:ss");
      
      if (now < myInfo.endTm) {
        if (window.confirm(`⚠️ 퇴근 시간(${myInfo.endTm.substring(0,5)}) 전입니다. 결근 처리될 수 있는데 퇴근하시겠습니까?`)) {
          fn_clkOut();
        }
        return; // 확인 안 누르면 중단
      }
    }

    // 2. 정상 퇴근 시간 이후라면 바로 확인창
    if (window.confirm("퇴근하시겠습니까?")) {
      fn_clkOut();
    }
  };

  const fn_logout = () => {
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

  useEffect(() => {
    const myInfoStr = localStorage.getItem("MyInfo");
    const myInfo = JSON.parse(myInfoStr);
    const token = myInfo?.token || null;

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
        })
        .catch((error) => {
          console.log(`logChk 에러 : `, error);
          navigate("/");
        });
    } else {
      console.log("토큰없음");
      navigate("/");
    }
  }, []);

  const fn_notiItem = (item) => {
    if (item.readYn == "N") {
      fetcher(`/gw/ntf/read`, {
        method: "POST",
        body: {
          ntfId: item.ntfId,
          empId: myInfo.empId,
        },
      });
    }
    setNotis((prev) =>
      prev.map((n) => (n.ntfId === item.ntfId ? { ...n, readYn: "Y" } : n)),
    );

    navigate(item.linkUrl);
  };
  const fn_deleteNoti = (item) => {
    fetcher(`/gw/ntf/delete`, {
      method: "POST",
      body: {
        ntfId: item.ntfId,
        empId: myInfo.empId,
      },
    });
    setNotis((prev) => prev.filter((n) => n.ntfId !== item.ntfId));
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <Link to={"/home/dashboard"} className="logo-header-container">
            <div className="logo-top-line">
               <span className="logo-the">THE</span>
            </div>
        <div className="logo-main-name">HYUNJIN</div>
          </Link>
        </div>
        <nav className="nav">
          {Object.keys(SIDE_CONFIG).map(
            (key) =>
              SIDE_CONFIG[key].title !== "메인페이지" && (
                <Link
                  key={key}
                  to={`/${key}/${SIDE_CONFIG[key].sideMenus[0].id}`}
                  className={`nav-item ${currentMain === key ? "active" : ""}`}
                >
                  {SIDE_CONFIG[key].title}
                </Link>
              ),
          )}
        </nav>
        <nav className="nav-right">
          <div><b>{myInfo.empNm}&nbsp;{myInfo.deptName}</b></div>
          <div className="nav-noti-wrap">
            <button className="nav-icon" onClick={fn_ntf}>
              🔔
              {unreadCount > 0 && (
                <span className="noti-badge">{unreadCount}</span>
              )}
            </button>
            {openNoti && (
              <div className="noti-popup">
                <div className="noti-header">알림</div>
                <div className="noti-list">
                  {notis.length > 0 ? (
                    notis.map((v, k) => (
                      <div
                        className={`noti-item ${v.readYn === "N" ? "unread" : ""}`}
                        key={k}
                        onClick={() => fn_notiItem(v)}
                      >
                        <div className="noti-main">
                          <div className="noti-title">{v.title}</div>
                          <div className="noti-body">{v.body}</div>
                        </div>

                        <button
                          className="noti-del-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // 아이템 클릭 막기
                            fn_deleteNoti(v);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="noti-empty">알림 내용이 없습니다</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* 2. 퇴근 버튼 */}
          {myInfo.wrkCd !== "O" && myInfo.wrkCd !== null && (
            <button
              className="nav-icon"
              onClick={() => {
                handleClkOut();
              }}
            >
              퇴근
            </button>
          )}
          <button className={"nav-icon"} onClick={fn_logout}>
            로그아웃
          </button>
        </nav>
      </header>

      <div className="main-wrapper">
        <aside className="sidebar">
          {currentMain === "home" && <UserProfile />}
          {/* <h3 className="sidebar-title">{SIDE_CONFIG[currentMain]?.title}</h3> */}
          <ul className="sidebar-list">
            {SIDE_CONFIG[currentMain]?.sideMenus
              .filter(menu => canAccessMenu(menu, myAccessList))
              .map((menu) => {
              // 하위 메뉴 존재 여부 확인
              const hasSubMenus = menu.subMenus && menu.subMenus.length > 0;

              // 현재 사이드 메뉴가 이 메뉴 본인이거나, 하위 메뉴 중 하나인 경우 '활성화' 상태로 간주
              const isParentActive =
                currentSide === menu.id ||
                menu.subMenus?.some((sub) => sub.id === currentSide);

              return (
                <li key={menu.id} className="sidebar-item-container">
                  <Link
                    to={`/${currentMain}/${menu.id}`}
                    className={`side-item ${isParentActive ? "active" : ""}`}
                  >
                    {menu.name}
                  </Link>

                  {/* subMenus가 있을 때 */}
                  {isParentActive && hasSubMenus && (
                    <ul className="sub-menu-list">
                      {menu.subMenus
                        .filter(sub => canAccessMenu(sub, myAccessList))
                        .map((sub) => (
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
