import react from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';

function Employee_details(props){
    const navigate = useNavigate();

    


    return(
        <table>


            <tr>
                <td>사진</td>
                <td><input type='file'></input></td>
            </tr>           
            <tr>
                <td>이름</td>
                <td><input></input></td>
            </tr>           
            <tr>
                <td>내선번호</td>
                <td><input></input></td>
            </tr>           
            <tr>
                <td>이메일</td>
                <td><input></input></td>
            </tr>           
            <tr>
                <td>주소</td>
                <td><input></input></td>
            </tr>


            <tr>
                <td>이메일 입력</td>
                <td><input></input></td>
            </tr>           
            <tr>
                <td>이메일 인증번호</td>
                <td><input></input></td>
                <Button>인증번호 전송</Button>
            </tr>           
             
            <Button>인증번호 확인</Button>

        </table>




    );



}

export default Employee_details;