import React, { useEffect, useState } from "react";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import { fetcher } from "../../../shared/api/fetcher";
import { useParams } from "react-router-dom";
import HomeDashBoard from "./HomeDashBoard";
import HomeModProf from "./HomeModProf";

function HomeMain(props) {
  //로그인 정보 가져다 쓰기
  const [myInfo, setMyInfo] = useState(
    JSON.parse(localStorage.getItem("MyInfo")),
  );
  const { sideId } = useParams(); // URL의 :sideId 값을 가져옴

  // 2. 스위치 문에서 '컴포넌트'를 반환합니다.
  const renderContent = () => {
    switch (sideId) {
      case "dashboard":
        return <HomeDashBoard />; // 경로 문자열이 아니라 컴포넌트 호출!
      case "modProf":
        return <HomeModProf />;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };
  useEffect(() => {
    console.log("useEffect", myInfo);
  }, [myInfo]);

  const [empData, setEmpData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [testData, setTestData] = useState("테스트 클릭");

  const fn_test = () => {
    setIsOpen(true);
  };

  // const fn_testCancel = () => {
  //   setIsOpen(false);
  //   setTestData("테스트 취소");
  // };
  // const fn_testOk = async () => {
  //   setIsOpen(false);
  //   setTestData("테스트 확인");

  //   fetcher("/gw/home/test", {
  //     method: "POST",
  //     body: { test: "ok" },
  //   }).then(setEmpData);
  // };

  return (
    <>
      {/* <div>
        {myInfo.empNm}
        <hr />

        {testData}
        <br />
        <br />
        <Button variant="primary" onClick={fn_test}>
          테스트
        </Button>
        {isOpen && (
          <Modal
            title="테스트 확인"
            onClose={fn_testCancel}
            onOk={fn_testOk}
            message="테스트중입니다"
            okMsg="확인확인"
          />
        )}
      </div> */}
      <div className="approval-container">
        <div className="content-area">
          {renderContent()} {/* 여기서 선택된 화면이 렌더링됨 */}
        </div>
      </div>
    </>
  );
}

export default HomeMain;
