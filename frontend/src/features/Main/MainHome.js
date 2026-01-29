import React, { useEffect, useState } from 'react';

function MainHome(props) {
    const [empData, setEmpData]= useState("로딩중")

    useEffect(()=>{
        fetch("http://192.168.0.117/gw/main")
        .then(res => res.text())
        .then(data => {
            setEmpData(data);
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
    },[])


    return (
        <div>
            {empData}
        </div>
    );
}

export default MainHome;