import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';

function LoginMain(props) {
    const navigate = useNavigate();

    const fn_login = () => {
        navigate('/home/dashboard')
    }

    return (
        <div>
            
            <Button variant="primary" onClick={fn_login}>로그인</Button>
        </div>
    );
}

export default LoginMain;