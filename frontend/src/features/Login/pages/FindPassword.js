import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";

function FindPassword(){
    const navigate = useNavigate();
    
    return(
        <table>
            <tr>
                <td>이메일</td>
                <td><input></input></td>
            </tr>

        </table>
    )
}

export default FindPassword;