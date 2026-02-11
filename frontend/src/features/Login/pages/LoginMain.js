import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import axios from "axios";
import { fetcher } from "../../../shared/api/fetcher";
import FindPassword from "./FindPassword";

function LoginMain(props) {
  const [empSn, setEmpSn] = useState(""); // 사번 저장
  const [empPswd, setEmpPswd] = useState(""); // 비밀번호 저장
  const navigate = useNavigate(); // 이동하는데 쓰는 함수

  const fn_login = async () => {
    fetcher("/gw/login", {
      method: "POST",
      body: {
        empSn: empSn,
        empPswd: empPswd,
      },
    }).then((res) => {
      console.log(res);
      if (res.logChk === "Fail") {
        alert("로그인 실패");
      } else if (res.logChk === "NewEmp") {
        alert("신규계정생성 페이지로 이동합니다 ");
        navigate(`/EmpDetails?empSn=${res.empSn}`);
      } else {
        localStorage.setItem("MyInfo", JSON.stringify(res));
        navigate("/home/dashboard");
      }
      //토큰저장
    });
  };

  useEffect(() => {
    fn_check();
  }, []);

  const fn_check = () => {
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
          navigate("/home/dashboard");
          console.log(`logChk 결과 : `, response);
        })
        .catch((error) => {
          console.log(`logChk 에러 : `, error);
        });
    } else {
      console.log("토큰없음");
    }
  };

  return (
    <>
      <div>Groupware</div>
      <table>
        <tbody>
          <tr>
            <td>사번</td>
            <td>
              <input
                type="text"
                onChange={(e) => setEmpSn(e.target.value)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>비밀번호</td>
            <td>
              <input
                type="password"
                onChange={(e) => setEmpPswd(e.target.value)}
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <Button variant="primary" onClick={fn_login}>
          로그인
        </Button>
        <Button variant="primary" onClick={fn_check}>
          토큰확인
        </Button>
        <Button onClick={() => navigate("/FindPassword")}>비밀번호 찾기</Button>
        <br /> test계정 20240101/ 1234
        <br /> 손흥민 SO0001/ hashed_pwd_09
      </div>
    </>
  );
}

export default LoginMain;
