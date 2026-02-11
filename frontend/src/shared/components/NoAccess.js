import React from 'react';

function NoAccess(props) {
    return (
        <div>
            <div style={{
                maxWidth: '400px',
                margin: '100px auto',
                padding: '30px',
                border: '2px solid #dc3545',
                borderRadius: '8px',
                backgroundColor: '#fff0f0',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#dc3545', marginBottom: '10px' }}>권한이 없습니다</h1>
                <p style={{ color: '#555', fontSize: '14px' }}>
                    이 페이지에 접근할 수 있는 권한이 없습니다.<br/>
                </p>
            </div>
        </div>
    );
}

export default NoAccess;