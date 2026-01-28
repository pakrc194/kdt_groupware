import React from 'react';
import { Link } from 'react-router-dom';

function LoginHome(props) {
    return (
        <div>
            <Link to={'/main/dashboard'}>로그인</Link>
        </div>
    );
}

export default LoginHome;