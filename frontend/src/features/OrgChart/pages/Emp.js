import React from 'react';
import { useParams, Routes, Route } from 'react-router-dom';
import AllEmp from './AllEmp';
import DetailEmp from './DetailEmp';

function Emp(props) {
    return (
        <div>
            <Routes>
                <Route path="/orgChart/allorg" element={<AllEmp />} />
                <Route path="detail/:id" element={<DetailEmp />} />
            </Routes>
        </div>
    );
}

export default Emp;