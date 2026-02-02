import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import axios from 'axios';

function LoginMain(props) {
    const [empSn, setEmpSn] = useState("");  // 사번 저장
    const [empPswd, setEmpPswd] = useState("");// 비밀번호 저장
    const navigate = useNavigate(); // 이동하는데 쓰는 함수

    const fn_login = async () => {
        try{
            const response = await axios.post('http://192.168.0.36:8080/Login/LoginMain',
              { empSn: empSn,empPswd: empPswd});
            
        if(response.data === "성공"){
            navigate('/home/dashboard');
        }else{
            navigate('/EmpDetails')
        }
        
        }catch(error){
            console.error("에러발생",error);
        }
    };

    return (
        <>
         <div>Groupware</div>
        <table>
            <tbody>
                <tr>
                <td>사번</td>
                <td><input type="text" onChange={(e)=>setEmpSn(e.target.value)}></input></td>
            </tr>
            <tr>
                <td>비밀번호</td>
                <td><input type="password" onChange={(e)=>setEmpPswd(e.target.value)}></input></td>
            </tr>
            </tbody>
            
        </table>
         <div>
            <Button variant="primary" onClick={fn_login}>로그인</Button>
            <a href=''>비밀번호 찾기</a>
            </div>
        </>
    );
}

export default LoginMain;