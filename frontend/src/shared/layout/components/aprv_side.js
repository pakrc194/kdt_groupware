import React from 'react';

const aprv_side = () => {
    return (<>
        {SIDE_CONFIG[currentMain]?.sideMenus.map((menu) => {
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
    </>);
};

export default aprv_side;