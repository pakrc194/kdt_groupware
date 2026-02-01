import React from 'react';
import { Link } from 'react-router-dom';

function LoginMain(props) {
    return (
        <div>
            <Link to={'/home/dashboard'}>로그인</Link>
        </div>
    );
}

export default LoginMain;